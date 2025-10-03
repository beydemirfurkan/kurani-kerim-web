import { NextRequest, NextResponse } from 'next/server';

const ALQURAN_API_BASE_URL = 'https://alquran-api.pages.dev/api/quran';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const lang = searchParams.get('lang') || 'en';

  if (!query || query.length < 3) {
    return NextResponse.json(
      { error: 'Query must be at least 3 characters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${ALQURAN_API_BASE_URL}/search?q=${encodeURIComponent(query)}&lang=${lang}`
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to search from Al-Quran API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching Al-Quran API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
