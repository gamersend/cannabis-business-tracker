import { NextRequest, NextResponse } from 'next/server';
import { addSale } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const saleData = await request.json();
    
    // Validate required fields
    const required = ['customer_name', 'strain_name', 'quantity_grams', 'sale_price'];
    for (const field of required) {
      if (!saleData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Calculate cost and profit if not provided
    if (!saleData.cost_price || !saleData.profit) {
      // Get strain cost from database or use average
      const avgCostPerGram = 6.0; // This should come from strain data
      saleData.cost_price = saleData.quantity_grams * avgCostPerGram;
      saleData.profit = saleData.sale_price - saleData.cost_price;
    }
    
    const result = await addSale(saleData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding sale:', error);
    return NextResponse.json(
      { error: 'Failed to add sale' },
      { status: 500 }
    );
  }
}
