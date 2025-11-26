import { NextResponse } from 'next/server';
import { getStrains } from '@/lib/database';

export async function GET() {
  try {
    const strains = await getStrains();
    return NextResponse.json(strains);
  } catch (error) {
    console.error('Error fetching strains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch strains' },
      { status: 500 }
    );
  }
}
