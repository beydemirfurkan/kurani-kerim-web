import { DiyanetApiClient } from '../lib/diyanet-api-client';
import { CacheManager } from '../lib/cache-manager';
import {
  type DiyanetChapter,
  type DiyanetVerse,
  type DiyanetChaptersResponse,
  type DiyanetChapterDetailResponse,
  type Surah
} from '../types/quran';

export class DiyanetApiService {
  private static instance: DiyanetApiService;
  private apiClient: DiyanetApiClient;
  private cacheManager: CacheManager;
  private readonly cacheTTL = 60 * 60 * 1000; // 60 minutes (Quran data doesn't change)

  private constructor() {
    this.apiClient = DiyanetApiClient.getInstance();
    this.cacheManager = CacheManager.getInstance();
  }

  static getInstance(): DiyanetApiService {
    if (!DiyanetApiService.instance) {
      DiyanetApiService.instance = new DiyanetApiService();
    }
    return DiyanetApiService.instance;
  }

  /**
   * Get all chapters (surahs)
   * @param language - Optional language parameter (default: 'tr')
   */
  async getChapters(language: string = 'tr'): Promise<DiyanetChapter[]> {
    const cacheKey = this.cacheManager.generateKey('diyanet', 'chapters', language);
    const cached = this.cacheManager.get<DiyanetChapter[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<DiyanetChaptersResponse>(
      `/chapters`,
      { params: { language } }
    );

    const chapters = response.data;
    this.cacheManager.set(cacheKey, chapters, this.cacheTTL);
    return chapters;
  }

  /**
   * Get verses for a specific chapter
   * @param chapterId - Chapter ID (1-114)
   * @param language - Optional language parameter (default: 'tr')
   */
  async getChapterVerses(
    chapterId: number,
    language: string = 'tr'
  ): Promise<DiyanetVerse[]> {
    const cacheKey = this.cacheManager.generateKey(
      'diyanet',
      'chapter',
      chapterId,
      language
    );
    const cached = this.cacheManager.get<DiyanetVerse[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<DiyanetChapterDetailResponse>(
      `/chapters/${chapterId}`,
      { params: { language } }
    );

    const verses = response.data;
    this.cacheManager.set(cacheKey, verses, this.cacheTTL);
    return verses;
  }

  /**
   * Get verses by page number
   * @param pageNumber - Page number (1-604)
   * @param language - Optional language parameter (default: 'tr')
   */
  async getVersesByPage(
    pageNumber: number,
    language: string = 'tr'
  ): Promise<DiyanetVerse[]> {
    const cacheKey = this.cacheManager.generateKey(
      'diyanet',
      'page',
      pageNumber,
      language
    );
    const cached = this.cacheManager.get<DiyanetVerse[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<{ data: DiyanetVerse[] }>(
      `/verses/page/${pageNumber}`,
      { params: { language } }
    );

    const verses = response.data;
    this.cacheManager.set(cacheKey, verses, this.cacheTTL);
    return verses;
  }

  /**
   * Get verses by Juz number
   * @param juzId - Juz ID (1-30)
   * @param language - Optional language parameter (default: 'tr')
   */
  async getVersesByJuz(juzId: number, language: string = 'tr'): Promise<DiyanetVerse[]> {
    const cacheKey = this.cacheManager.generateKey('diyanet', 'juz', juzId, language);
    const cached = this.cacheManager.get<DiyanetVerse[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<{ data: DiyanetVerse[] }>(
      `/juz/${juzId}`,
      { params: { language } }
    );

    const verses = response.data;
    this.cacheManager.set(cacheKey, verses, this.cacheTTL);
    return verses;
  }

  /**
   * Convert Diyanet chapter to legacy Surah format
   */
  convertChapterToSurah(chapter: DiyanetChapter): Surah {
    // Note: revelationType information is not available in Diyanet API
    // We'll need to add this separately or fetch from static data
    return {
      number: chapter.SureId,
      name: chapter.SureNameArabic,
      englishName: chapter.SureNameTurkish,
      englishNameTranslation: chapter.SureNameTurkish,
      revelationType: 'Meccan', // Default, should be enriched from static data
      numberOfAyahs: chapter.AyetCount,
    };
  }

  /**
   * Clear all cached data
   */
  clearCache(): void {
    this.cacheManager.clear();
  }
}
