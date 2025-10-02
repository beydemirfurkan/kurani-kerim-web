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