import { ApiClient } from '../lib/api-client';
import { CacheManager } from '../lib/cache-manager';
import { QuranData, SurahData, Edition, Ayah } from '../types/quran';

export interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export class QuranApiService {
  private static instance: QuranApiService;
  private apiClient: ApiClient;
  private cacheManager: CacheManager;
  private readonly cacheTTL = 30 * 60 * 1000; // 30 minutes

  private constructor() {
    this.apiClient = ApiClient.getInstance();
    this.cacheManager = CacheManager.getInstance();
  }

  static getInstance(): QuranApiService {
    if (!QuranApiService.instance) {
      QuranApiService.instance = new QuranApiService();
    }
    return QuranApiService.instance;
  }

  async getEditions(): Promise<Edition[]> {
    const cacheKey = 'editions';
    const cached = this.cacheManager.get<Edition[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<ApiResponse<Edition[]>>('/edition');
    const editions = response.data;
    
    this.cacheManager.set(cacheKey, editions, this.cacheTTL);
    return editions;
  }

  async getEditionsByLanguage(language: string): Promise<Edition[]> {
    const cacheKey = this.cacheManager.generateKey('editions', 'language', language);
    const cached = this.cacheManager.get<Edition[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<ApiResponse<Edition[]>>(`/edition/language/${language}`);
    const editions = response.data;
    
    this.cacheManager.set(cacheKey, editions, this.cacheTTL);
    return editions;
  }

  async getQuran(edition: string = 'quran-uthmani'): Promise<QuranData> {
    const cacheKey = this.cacheManager.generateKey('quran', edition);
    const cached = this.cacheManager.get<QuranData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<ApiResponse<QuranData>>(`/quran/${edition}`);
    const quranData = response.data;
    
    this.cacheManager.set(cacheKey, quranData, this.cacheTTL);
    return quranData;
  }

  async getSurah(surahNumber: number, edition: string = 'quran-uthmani'): Promise<SurahData> {
    const cacheKey = this.cacheManager.generateKey('surah', surahNumber, edition);
    const cached = this.cacheManager.get<SurahData>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<ApiResponse<SurahData>>(`/surah/${surahNumber}/${edition}`);
    const surahData = response.data;
    
    this.cacheManager.set(cacheKey, surahData, this.cacheTTL);
    return surahData;
  }

  async getAyah(ayahNumber: number, edition: string = 'quran-uthmani'): Promise<Ayah> {
    const cacheKey = this.cacheManager.generateKey('ayah', ayahNumber, edition);
    const cached = this.cacheManager.get<Ayah>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<ApiResponse<Ayah>>(`/ayah/${ayahNumber}/${edition}`);
    const ayahData = response.data;
    
    this.cacheManager.set(cacheKey, ayahData, this.cacheTTL);
    return ayahData;
  }

  async searchInQuran(keyword: string, surah?: number): Promise<Ayah[]> {
    const url = surah 
      ? `/search/${keyword}/${surah}` 
      : `/search/${keyword}`;
    
    const cacheKey = this.cacheManager.generateKey('search', keyword, surah || 'all');
    const cached = this.cacheManager.get<Ayah[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<ApiResponse<{ matches: Ayah[] }>>(url);
    const ayahs = response.data.matches;
    
    this.cacheManager.set(cacheKey, ayahs, this.cacheTTL);
    return ayahs;
  }

  async getMultipleEditions(surahNumber: number, editions: string[]): Promise<SurahData[]> {
    const editionsParam = editions.join(',');
    const cacheKey = this.cacheManager.generateKey('surah', surahNumber, 'editions', editionsParam);
    const cached = this.cacheManager.get<SurahData[]>(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await this.apiClient.get<ApiResponse<SurahData[]>>(`/surah/${surahNumber}/editions/${editionsParam}`);
    const surahDataArray = response.data;
    
    this.cacheManager.set(cacheKey, surahDataArray, this.cacheTTL);
    return surahDataArray;
  }

  clearCache(): void {
    this.cacheManager.clear();
  }
}