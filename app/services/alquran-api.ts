/**
 * Al-Quran API Client
 * Base URL: https://alquran-api.pages.dev/api/quran
 */

// Use local API route to avoid CORS issues
const ALQURAN_API_BASE_URL = typeof window !== 'undefined'
  ? '/api/quran'  // Client-side: use local API route
  : 'https://alquran-api.pages.dev/api/quran';  // Server-side: use direct API

const DEFAULT_LANGUAGE = 'tr';

export interface AudioRecitation {
  reciter: string;
  url: string;
  originalUrl: string;
  type: 'complete_surah';
}

export interface AlQuranVerse {
  id: number;
  text: string;
  translation: string;
}

export interface AlQuranSurah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
}

export interface AlQuranSurahDetail extends AlQuranSurah {
  language: string;
  audio: Record<string, AudioRecitation>;
  verses: AlQuranVerse[];
}

export interface AlQuranListResponse {
  language: string;
  available_languages: Array<{
    code: string;
    name: string;
    nativeName: string;
    direction: 'ltr' | 'rtl';
  }>;
  surahs: AlQuranSurah[];
}

class AlQuranAPIService {
  private baseURL: string;

  constructor() {
    this.baseURL = ALQURAN_API_BASE_URL;
  }

  /**
   * Get all surahs
   */
  async getAllSurahs(language: string = DEFAULT_LANGUAGE): Promise<AlQuranListResponse> {
    const url = `${this.baseURL}?lang=${language}`;
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch surahs: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get specific surah with verses and audio
   */
  async getSurah(surahId: number, language: string = DEFAULT_LANGUAGE): Promise<AlQuranSurahDetail> {
    const url = `${this.baseURL}/surah/${surahId}?lang=${language}`;
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${surahId}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get specific verse
   */
  async getVerse(
    surahId: number,
    verseId: number,
    language: string = DEFAULT_LANGUAGE
  ): Promise<{
    language: string;
    surah: {
      id: number;
      name: string;
      transliteration: string;
      translation: string;
    };
    verse: AlQuranVerse;
  }> {
    const url = `${this.baseURL}/surah/${surahId}/verse/${verseId}?lang=${language}`;
    const response = await fetch(url, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch verse ${surahId}:${verseId}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Search in Quran
   */
  async search(
    query: string,
    language: string = DEFAULT_LANGUAGE
  ): Promise<{
    language: string;
    query: string;
    results: Array<{
      surah: {
        id: number;
        name: string;
        transliteration: string;
        translation: string;
      };
      verses: AlQuranVerse[];
    }>;
    total: number;
  }> {
    // Use local API route for client-side, direct for server-side
    const baseUrl = typeof window !== 'undefined' ? '/api/quran' : this.baseURL;
    const url = `${baseUrl}/search?q=${encodeURIComponent(query)}&lang=${language}`;

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to search: ${response.statusText}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const alQuranAPI = new AlQuranAPIService();
