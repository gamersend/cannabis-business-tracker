import { NextRequest, NextResponse } from 'next/server';
import { parseNaturalLanguageSale, parseQuickSale } from '@/lib/ai-parser';

export async function POST(request: NextRequest) {
  try {
    const { input, model = 'openai/gpt-4o-mini' } = await request.json();

    if (!input || typeof input !== 'string') {
      return NextResponse.json(
        { error: 'Input text is required' },
        { status: 400 }
      );
    }

    // Try quick sale format first (e.g., "Jay 325")
    const quickResult = parseQuickSale(input);
    if (quickResult.confidence > 0.8) {
      return NextResponse.json(quickResult);
    }

    // Use OpenRouter AI for natural language parsing
    const result = await parseNaturalLanguageSale(input, model);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error parsing sale:', error);
    return NextResponse.json(
      { error: 'Failed to parse sale input' },
      { status: 500 }
    );
  }
}
