'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'tr' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations = {
  tr: {
    'app.name': 'Kuran-ı Kerim',
    'app.tagline': 'Adım adım öğrenme platformu',
    'home.title': "Kuran-ı Kerim'i Öğrenmeye Başlayın",
    'home.description': '114 sure ve binlerce ayeti Türkçe mealleri ile birlikte okuyun, dinleyin ve adım adım öğrenin.',
    'home.surahs': 'Sureler',
    'home.surahsDescription': '114 sure arasından seçim yapın',
    'home.verses': 'ayet',
    'home.meccan': 'Mekki',
    'home.medinan': 'Medeni',
    'surah.breadcrumbHome': 'Ana Sayfa',
    'surah.listen': 'Sesli Dinle',
    'surah.play': 'Oynat',
    'surah.pause': 'Duraklat',
    'surah.backToHome': 'Ana Sayfa',
  },
  en: {
    'app.name': 'Holy Quran',
    'app.tagline': 'Step-by-step learning platform',
    'home.title': 'Start Learning the Holy Quran',
    'home.description': 'Read, listen and learn 114 surahs and thousands of verses with translations.',
    'home.surahs': 'Surahs',
    'home.surahsDescription': 'Choose from 114 surahs',
    'home.verses': 'verses',
    'home.meccan': 'Meccan',
    'home.medinan': 'Medinan',
    'surah.breadcrumbHome': 'Home',
    'surah.listen': 'Listen',
    'surah.play': 'Play',
    'surah.pause': 'Pause',
    'surah.backToHome': 'Home',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('tr');

  useEffect(() => {
    // Load from localStorage (only runs on client)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locale') as Locale;
      if (saved && (saved === 'tr' || saved === 'en')) {
        setLocaleState(saved);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations.tr] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
