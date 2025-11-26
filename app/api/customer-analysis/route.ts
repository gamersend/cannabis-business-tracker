import { NextResponse } from 'next/server';
import { aiAdvisor } from '@/lib/ai-advisor';

export async function GET() {
  try {
    const analysis = await aiAdvisor.analyzeCustomerBehavior();
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing customers:', error);
    return NextResponse.json(
      { error: 'Failed to analyze customers' },
      { status: 500 }
    );
  }
}
