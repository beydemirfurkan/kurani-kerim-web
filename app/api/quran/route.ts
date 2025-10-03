import { NextRequest, NextResponse } from 'next/server';

const ALQURAN_API_BASE_URL = 'https://alquran-api.pages.dev/api/quran';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';

  try {
    const response = await fetch(`${ALQURAN_API_BASE_URL}?lang=${lang}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch from Al-Quran API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from Al-Quran API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
