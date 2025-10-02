import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/app/lib/rate-limit-middleware';

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const language_id = searchParams.get('language_id') || '1';

    // Input validation
    const chapterId = parseInt(id, 10);
    if (isNaN(chapterId) || chapterId < 1 || chapterId > 114) {
      return NextResponse.json(
        { error: 'Invalid chapter ID. Must be between 1 and 114' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.DIYANET_API_BASE_URL}/chapters/${chapterId}?language_id=${language_id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.DIYANET_API_KEY}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Chapter not found' },
          { status: 404 }
        );
      }
      throw new Error(`Diyanet API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching chapter verses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chapter verses' },
      { status: 500 }
    );
  }
}

export const GET = withRateLimit(handler);
