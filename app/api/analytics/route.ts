import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'daily'; // daily, weekly, monthly
    const days = parseInt(searchParams.get('days') || '30');

    let dateFormat: string;
    let groupBy: string;
    
    switch (period) {
      case 'weekly':
        dateFormat = 'YYYY-"Week"-WW';
        groupBy = 'DATE_TRUNC(\'week\', sale_date)';
        break;
      case 'monthly':
        dateFormat = 'YYYY-MM';
        groupBy = 'DATE_TRUNC(\'month\', sale_date)';
        break;
      default: // daily
        dateFormat = 'YYYY-MM-DD';
        groupBy = 'DATE(sale_date)';
    }

    // Profit trends over time
    const profitTrends = await query(`
      SELECT 
        ${groupBy} as period,
        TO_CHAR(${groupBy}, '${dateFormat}') as period_label,
        SUM(profit) as total_profit,
        COUNT(*) as transaction_count,
        AVG(profit) as avg_profit,
        MAX(profit) as max_profit,
        MIN(profit) as min_profit
      FROM sales 
      WHERE sale_date >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY ${groupBy}
      ORDER BY period DESC
      LIMIT 50
    `);

    // Top performing strains
    const strainPerformance = await query(`
      SELECT 
        s.strain_name,
        SUM(sa.profit) as total_profit,
        COUNT(*) as sales_count,
        AVG(sa.profit) as avg_profit,
        SUM(sa.quantity_grams) as total_grams_sold
      FROM sales sa
      JOIN strains s ON sa.strain_id = s.id
      WHERE sa.sale_date >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY s.strain_name
      ORDER BY total_profit DESC
    `);

    // Customer profit distribution
    const customerDistribution = await query(`
      SELECT 
        CASE 
          WHEN total_profit >= 1000 THEN 'Whale ($1000+)'
          WHEN total_profit >= 500 THEN 'VIP ($500-999)'
          WHEN total_profit >= 100 THEN 'Regular ($100-499)'
          ELSE 'New (<$100)'
        END as customer_tier,
        COUNT(*) as customer_count,
        SUM(total_profit) as tier_profit
      FROM (
        SELECT 
          customer_name,
          SUM(profit) as total_profit
        FROM sales
        WHERE sale_date >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY customer_name
      ) customer_totals
      GROUP BY customer_tier
      ORDER BY tier_profit DESC
    `);

    // Hourly sales pattern (for daily period)
    const hourlySales = period === 'daily' ? await query(`
      SELECT 
        EXTRACT(HOUR FROM sale_date) as hour,
        SUM(profit) as total_profit,
        COUNT(*) as transaction_count
      FROM sales
      WHERE sale_date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY EXTRACT(HOUR FROM sale_date)
      ORDER BY hour
    `) : [];

    // Profit margins by strain
    const profitMargins = await query(`
      SELECT 
        s.strain_name,
        s.cost_per_gram,
        AVG(sa.sale_price / sa.quantity_grams) as avg_price_per_gram,
        AVG((sa.profit / sa.sale_price) * 100) as avg_profit_margin
      FROM sales sa
      JOIN strains s ON sa.strain_id = s.id
      WHERE sa.sale_date >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY s.strain_name, s.cost_per_gram
      ORDER BY avg_profit_margin DESC
    `);

    // Growth metrics
    const currentPeriodProfit = await query(`
      SELECT SUM(profit) as current_profit
      FROM sales
      WHERE sale_date >= CURRENT_DATE - INTERVAL '${Math.floor(days/2)} days'
    `);

    const previousPeriodProfit = await query(`
      SELECT SUM(profit) as previous_profit
      FROM sales
      WHERE sale_date >= CURRENT_DATE - INTERVAL '${days} days'
        AND sale_date < CURRENT_DATE - INTERVAL '${Math.floor(days/2)} days'
    `);

    const currentProfit = parseFloat(currentPeriodProfit[0]?.current_profit || '0');
    const previousProfit = parseFloat(previousPeriodProfit[0]?.previous_profit || '0');
    const growthRate = previousProfit > 0 ? ((currentProfit - previousProfit) / previousProfit) * 100 : 0;

    return NextResponse.json({
      profitTrends: profitTrends.map(row => ({
        period: row.period_label,
        totalProfit: parseFloat(row.total_profit),
        transactionCount: parseInt(row.transaction_count),
        avgProfit: parseFloat(row.avg_profit),
        maxProfit: parseFloat(row.max_profit),
        minProfit: parseFloat(row.min_profit)
      })),
      strainPerformance: strainPerformance.map(row => ({
        strainName: row.strain_name,
        totalProfit: parseFloat(row.total_profit),
        salesCount: parseInt(row.sales_count),
        avgProfit: parseFloat(row.avg_profit),
        totalGramsSold: parseFloat(row.total_grams_sold)
      })),
      customerDistribution: customerDistribution.map(row => ({
        tier: row.customer_tier,
        customerCount: parseInt(row.customer_count),
        tierProfit: parseFloat(row.tier_profit)
      })),
      hourlySales: hourlySales.map(row => ({
        hour: parseInt(row.hour),
        totalProfit: parseFloat(row.total_profit),
        transactionCount: parseInt(row.transaction_count)
      })),
      profitMargins: profitMargins.map(row => ({
        strainName: row.strain_name,
        costPerGram: parseFloat(row.cost_per_gram),
        avgPricePerGram: parseFloat(row.avg_price_per_gram),
        avgProfitMargin: parseFloat(row.avg_profit_margin)
      })),
      growthMetrics: {
        currentProfit,
        previousProfit,
        growthRate: Math.round(growthRate * 100) / 100
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
