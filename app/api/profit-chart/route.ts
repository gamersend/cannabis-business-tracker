import { NextResponse } from 'next/server';
import { getDailyProfits } from '@/lib/database';

export async function GET() {
  try {
    const dailyProfits = await getDailyProfits(14); // Last 14 days
    return NextResponse.json(dailyProfits);
  } catch (error) {
    console.error('Error fetching profit chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profit chart data' },
      { status: 500 }
    );
  }
}
