import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Database unavailable, using fallback customers data');

    // Return fallback customers data
    const fallbackCustomers = [
      {
        customer_name: 'Trife',
        total_profit: 2300,
        transaction_count: 8,
        avg_profit: 287.50,
        last_purchase: '2024-01-15'
      },
      {
        customer_name: 'Online',
        total_profit: 2045,
        transaction_count: 12,
        avg_profit: 170.42,
        last_purchase: '2024-01-14'
      },
      {
        customer_name: 'Ryan',
        total_profit: 1580,
        transaction_count: 6,
        avg_profit: 263.33,
        last_purchase: '2024-01-13'
      },
      {
        customer_name: 'Jay',
        total_profit: 750,
        transaction_count: 4,
        avg_profit: 187.50,
        last_purchase: '2024-01-12'
      },
      {
        customer_name: 'Leveny',
        total_profit: 650,
        transaction_count: 3,
        avg_profit: 216.67,
        last_purchase: '2024-01-11'
      },
      {
        customer_name: 'Karlo',
        total_profit: 690,
        transaction_count: 2,
        avg_profit: 345.00,
        last_purchase: '2024-01-10'
      },
      {
        customer_name: 'Mike',
        total_profit: 420,
        transaction_count: 3,
        avg_profit: 140.00,
        last_purchase: '2024-01-09'
      },
      {
        customer_name: 'Sarah',
        total_profit: 380,
        transaction_count: 2,
        avg_profit: 190.00,
        last_purchase: '2024-01-08'
      },
      {
        customer_name: 'Alex',
        total_profit: 290,
        transaction_count: 2,
        avg_profit: 145.00,
        last_purchase: '2024-01-07'
      },
      {
        customer_name: 'Chris',
        total_profit: 250,
        transaction_count: 1,
        avg_profit: 250.00,
        last_purchase: '2024-01-06'
      },
      {
        customer_name: 'Jordan',
        total_profit: 180,
        transaction_count: 1,
        avg_profit: 180.00,
        last_purchase: '2024-01-05'
      },
      {
        customer_name: 'Taylor',
        total_profit: 160,
        transaction_count: 1,
        avg_profit: 160.00,
        last_purchase: '2024-01-04'
      }
    ];

    return NextResponse.json(fallbackCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
