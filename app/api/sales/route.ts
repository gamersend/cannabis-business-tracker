import { NextRequest, NextResponse } from 'next/server';

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

    console.log('Database unavailable, simulating sale addition:', saleData);

    // Return success response with the sale data
    const result = {
      id: Date.now().toString(),
      ...saleData,
      created_at: new Date().toISOString(),
      success: true,
      message: 'Sale recorded successfully (simulated)'
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error adding sale:', error);
    return NextResponse.json(
      { error: 'Failed to add sale' },
      { status: 500 }
    );
  }
}
