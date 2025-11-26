import { NextResponse } from 'next/server';
import { getTopCustomers, getDailyProfits } from '@/lib/database';

export async function GET() {
  try {
    // Get top customers
    const topCustomers = await getTopCustomers(1);
    const topCustomer = topCustomers[0]?.customer_name || 'No customers yet';
    
    // Get daily profits for last 30 days
    const dailyProfits = await getDailyProfits(30);
    
    // Calculate total profit from historic data
    const totalProfit = dailyProfits.reduce((sum, day) => sum + parseFloat(day.total_profit), 0);
    const totalTransactions = dailyProfits.reduce((sum, day) => sum + day.transaction_count, 0);
    
    // Get today's profit
    const today = new Date().toISOString().split('T')[0];
    const todayData = dailyProfits.find(day => day.date === today);
    const todayProfit = todayData ? parseFloat(todayData.total_profit) : 0;
    
    return NextResponse.json({
      totalProfit: Math.round(totalProfit),
      totalTransactions,
      topCustomer,
      todayProfit: Math.round(todayProfit)
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
