import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Database unavailable, using fallback strains data');

    // Return fallback strains data
    const fallbackStrains = [
      {
        id: '1',
        name: 'Girl Scout Cookies',
        type: 'Hybrid',
        cost_per_gram: 8.50,
        cost_per_pound: 2700,
        current_stock_grams: 850,
        reorder_point: 200,
        emoji: '🍪'
      },
      {
        id: '2',
        name: 'Purple Chem',
        type: 'Indica',
        cost_per_gram: 7.50,
        cost_per_pound: 3000,
        current_stock_grams: 1200,
        reorder_point: 300,
        emoji: '💜'
      },
      {
        id: '3',
        name: 'Stardust',
        type: 'Sativa',
        cost_per_gram: 7.75,
        cost_per_pound: 2700,
        current_stock_grams: 650,
        reorder_point: 250,
        emoji: '✨'
      },
      {
        id: '4',
        name: 'Candyland',
        type: 'Sativa',
        cost_per_gram: 7.00,
        cost_per_pound: 2600,
        current_stock_grams: 180,
        reorder_point: 200,
        emoji: '🍭'
      }
    ];

    return NextResponse.json(fallbackStrains);
  } catch (error) {
    console.error('Error fetching strains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strains' },
      { status: 500 }
    );
  }
}
