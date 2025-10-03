'use client';

import { useEffect, useState } from 'react';
import { SearchModal } from './search-modal';
import { useSearch } from '../contexts/search-context';
import { useLanguage } from '../contexts/language-context';
import { alQuranAPI, AlQuranSurah } from '../services/alquran-api';

export function GlobalSearch() {
  const { isOpen, openSearch, closeSearch } = useSearch();
  const { locale } = useLanguage();
  const [surahs, setSurahs] = useState<AlQuranSurah[]>([]);

  // Load surahs for search
  useEffect(() => {
    alQuranAPI.getAllSurahs(locale)
      .then(data => setSurahs(data.surahs))
      .catch(err => console.error('Error loading surahs for search:', err));
  }, [locale]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, openSearch, closeSearch]);

  if (surahs.length === 0) {
    return null;
  }

  return <SearchModal surahs={surahs} />;
}
