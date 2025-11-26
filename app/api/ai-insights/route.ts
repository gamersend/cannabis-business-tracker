import { NextResponse } from 'next/server';
import { aiAdvisor } from '@/lib/ai-advisor';

export async function GET() {
  try {
    const insights = await aiAdvisor.generateBusinessInsights();
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
