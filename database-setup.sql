-- Cannabis Business Tracker Database Schema
-- Database: cannabis_tracker
-- Host: 192.168.0.150
-- User: postgres

-- Create the main database
CREATE DATABASE cannabis_tracker;

-- Connect to the database
\c cannabis_tracker;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    notes TEXT,
    total_profit DECIMAL(10,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    last_purchase_date TIMESTAMP,
    customer_type VARCHAR(20) DEFAULT 'regular', -- regular, vip, whale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create strains/inventory table
CREATE TABLE strains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- flower, edibles, concentrates
    cost_per_gram DECIMAL(8,2) NOT NULL,
    cost_per_pound DECIMAL(10,2) NOT NULL,
    current_stock_grams DECIMAL(10,2) DEFAULT 0,
    reorder_point DECIMAL(10,2) DEFAULT 0,
    supplier VARCHAR(100),
    emoji VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sales table
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id),
    strain_id UUID REFERENCES strains(id),
    customer_name VARCHAR(100), -- for quick reference
    strain_name VARCHAR(100), -- for quick reference
    quantity_grams DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20), -- cash, card, crypto
    notes TEXT,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create historic_profits table (for imported data)
CREATE TABLE historic_profits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(100) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    sale_date DATE NOT NULL,
    notes TEXT,
    imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create daily_summaries table
CREATE TABLE daily_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    total_sales DECIMAL(10,2) DEFAULT 0,
    total_costs DECIMAL(10,2) DEFAULT 0,
    total_profit DECIMAL(10,2) DEFAULT 0,
    profit_margin DECIMAL(5,2) DEFAULT 0,
    transaction_count INTEGER DEFAULT 0,
    top_customer VARCHAR(100),
    top_strain VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AI parsing logs table
CREATE TABLE ai_parsing_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    input_text TEXT NOT NULL,
    parsed_data JSONB,
    confidence_score DECIMAL(3,2),
    status VARCHAR(50), -- success, failed, manual_review, fallback_used
    model_used VARCHAR(100), -- OpenRouter model ID
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial strain data
INSERT INTO strains (name, type, cost_per_gram, cost_per_pound, emoji) VALUES
('Purple Chem', 'flower', 6.70, 3000, '💜'),
('Girl Scout Cookies', 'flower', 6.03, 2700, '🍪'),
('Stardust', 'flower', 6.03, 2700, '✨'),
('Candyland', 'flower', 5.80, 2600, '🍭');

-- Create indexes for better performance
CREATE INDEX idx_customers_name ON customers(name);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_sales_sale_date ON sales(sale_date);
CREATE INDEX idx_historic_profits_customer ON historic_profits(customer_name);
CREATE INDEX idx_historic_profits_date ON historic_profits(sale_date);
CREATE INDEX idx_daily_summaries_date ON daily_summaries(date);

-- Create views for common queries
CREATE VIEW customer_stats AS
SELECT 
    c.id,
    c.name,
    c.total_profit,
    c.total_transactions,
    c.last_purchase_date,
    c.customer_type,
    COALESCE(SUM(s.profit), 0) as calculated_profit,
    COUNT(s.id) as calculated_transactions
FROM customers c
LEFT JOIN sales s ON c.id = s.customer_id
GROUP BY c.id, c.name, c.total_profit, c.total_transactions, c.last_purchase_date, c.customer_type;

CREATE VIEW top_customers AS
SELECT 
    customer_name,
    SUM(profit) as total_profit,
    COUNT(*) as transaction_count,
    AVG(profit) as avg_profit,
    MAX(sale_date) as last_purchase
FROM historic_profits
GROUP BY customer_name
ORDER BY total_profit DESC;
