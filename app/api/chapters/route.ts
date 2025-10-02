import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/app/lib/rate-limit-middleware';

async function handler(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'tr';

    // Input validation
    if (language && !/^[a-z]{2}$/.test(language)) {
      return NextResponse.json(
        { error: 'Invalid language parameter' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.DIYANET_API_BASE_URL}/chapters?language=${language}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.DIYANET_API_KEY}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Diyanet API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handler);
