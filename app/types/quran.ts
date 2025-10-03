// Legacy types (kept for backwards compatibility)
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda?: boolean;
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: 'text' | 'audio';
  type: 'translation' | 'transliteration' | 'tafsir' | 'quran';
  direction: 'ltr' | 'rtl';
}

export interface QuranData {
  surahs: Surah[];
  edition: Edition;
  ayahs?: Ayah[];
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: Ayah[];
  edition: Edition;
}

export interface AudioData {
  identifier: string;
  name: string;
  englishName: string;
  format: 'audio';
  language: string;
  direction: null;
  type: 'quran';
}

// Diyanet API Types (based on real API response)
export interface DiyanetChapter {
  SureId: number;
  SureNameTurkish: string;
  SureNameArabic: string;
  BesmeleVisible: boolean;
  InisOrder: number;
  AyetCount: number;
  Cuz: number;
  FirstPage: number;
  MealInfo: string;
  HeaderOnBackPage: boolean;
}

export interface DiyanetVerse {
  page_number: number;
  surah_id: number;
  verse_id_in_surah: number;
  translation: {
    text: string;
  };
  arabic_script: {
    text_font_id: number;
    text: string;
  };
}

export interface DiyanetApiResponse<T> {
  data: T;
  status?: number;
}

export interface DiyanetChaptersResponse {
  data: DiyanetChapter[];
}

export interface DiyanetChapterDetailResponse {
  data: DiyanetVerse[];
}