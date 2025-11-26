// Database connection utility for Cannabis Tracker
import { Pool } from 'pg';

const pool = new Pool({
  host: '192.168.0.150',
  user: 'postgres',
  password: 'Qzmpwxno1',
  database: 'cannabis_tracker',
  port: 5432,
  ssl: false, // Set to true if using SSL
});

// Test connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Customer operations
export async function getCustomers() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM customers 
      ORDER BY total_profit DESC
    `);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function getTopCustomers(limit = 10) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        customer_name,
        SUM(profit) as total_profit,
        COUNT(*) as transaction_count,
        AVG(profit) as avg_profit,
        MAX(sale_date) as last_purchase
      FROM historic_profits
      GROUP BY customer_name
      ORDER BY total_profit DESC
      LIMIT $1
    `, [limit]);
    return result.rows;
  } finally {
    client.release();
  }
}

// Sales operations
export async function addSale(saleData: {
  customer_name: string;
  strain_name: string;
  quantity_grams: number;
  sale_price: number;
  cost_price: number;
  profit: number;
  payment_method?: string;
  notes?: string;
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO sales (
        customer_name, strain_name, quantity_grams, 
        sale_price, cost_price, profit, payment_method, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      saleData.customer_name,
      saleData.strain_name,
      saleData.quantity_grams,
      saleData.sale_price,
      saleData.cost_price,
      saleData.profit,
      saleData.payment_method,
      saleData.notes
    ]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Strain operations
export async function getStrains() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT * FROM strains 
      ORDER BY name
    `);
    return result.rows;
  } finally {
    client.release();
  }
}

// Analytics operations
export async function getDailyProfits(days = 30) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        DATE(sale_date) as date,
        SUM(profit) as total_profit,
        COUNT(*) as transaction_count,
        AVG(profit) as avg_profit
      FROM historic_profits
      WHERE sale_date >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(sale_date)
      ORDER BY date DESC
    `);
    return result.rows;
  } finally {
    client.release();
  }
}

// AI parsing operations
export async function logAIParsing(data: {
  input_text: string;
  parsed_data: any;
  confidence_score: number;
  status: string;
}) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      INSERT INTO ai_parsing_logs (input_text, parsed_data, confidence_score, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [data.input_text, JSON.stringify(data.parsed_data), data.confidence_score, data.status]);
    return result.rows[0];
  } finally {
    client.release();
  }
}

// Search customers with fuzzy matching
export async function searchCustomers(query: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT DISTINCT customer_name, SUM(profit) as total_profit, COUNT(*) as transactions
      FROM historic_profits
      WHERE customer_name ILIKE $1
      GROUP BY customer_name
      ORDER BY total_profit DESC
    `, [`%${query}%`]);
    return result.rows;
  } finally {
    client.release();
  }
}

// Log AI parsing attempts
export async function logAIParsing(data: {
  input_text: string;
  parsed_data: any;
  confidence_score: number;
  status: string;
  model_used?: string;
  error_message?: string;
}) {
  const client = await pool.connect();
  try {
    const query = `
      INSERT INTO ai_parsing_logs (input_text, parsed_data, confidence_score, status, model_used, error_message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;

    const values = [
      data.input_text,
      JSON.stringify(data.parsed_data),
      data.confidence_score,
      data.status,
      data.model_used || null,
      data.error_message || null
    ];

    const result = await client.query(query, values);
    return result.rows[0];
  } finally {
    client.release();
  }
}

export default pool;
