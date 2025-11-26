import { NextResponse } from 'next/server';
import { getTopCustomers } from '@/lib/database';

export async function GET() {
  try {
    const customers = await getTopCustomers(20);
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
