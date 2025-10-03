'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../contexts/language-context';
import { useSearch } from '../contexts/search-context';
import { alQuranAPI } from '../services/alquran-api';

interface SearchResult {
  id: number;
  name: string;
  translation: string;
  transliteration: string;
  total_verses: number;
  type: 'meccan' | 'medinan';
}

interface VerseSearchResult {
  surah: {
    id: number;
    name: string;
    transliteration: string;
    translation: string;
  };
  verses: Array<{
    id: number;
    text: string;
    translation: string;
  }>;
}

interface SearchModalProps {
  surahs: SearchResult[];
}

export function SearchModal({ surahs }: SearchModalProps) {
  const { isOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [verseResults, setVerseResults] = useState<VerseSearchResult[]>([]);
  const [searchingVerses, setSearchingVerses] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, locale } = useLanguage();

  // Search function
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setVerseResults([]);
      return;
    }

    // Search in surah names
    const searchQuery = query.toLowerCase();
    const filtered = surahs.filter(surah =>
      surah.translation.toLowerCase().includes(searchQuery) ||
      surah.transliteration.toLowerCase().includes(searchQuery) ||
      surah.id.toString() === searchQuery
    );

    setResults(filtered);

    // Search in verses if query is at least 3 characters
    if (query.length >= 3) {
      setSearchingVerses(true);
      const timeoutId = setTimeout(() => {
        alQuranAPI.search(query, locale)
          .then(data => {
            setVerseResults(data.results);
            setSearchingVerses(false);
          })
          .catch(err => {
            console.error('Verse search error:', err);
            setSearchingVerses(false);
          });
      }, 500); // Debounce search

      return () => clearTimeout(timeoutId);
    }
  }, [query, surahs, locale]);

  // Keyboard shortcuts - moved to layout level, removed from here

  // Focus input when opened and handle body scroll
  useEffect(() => {
    if (isOpen) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
      // Prevent body scroll and add blur
      document.body.style.overflow = 'hidden';
      document.body.classList.add('search-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('search-open');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('search-open');
    };
  }, [isOpen]);

  const handleClose = () => {
    closeSearch();
    setQuery('');
    setResults([]);
    setVerseResults([]);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} style={{ backgroundColor: 'var(--primary-200)', padding: '0 2px' }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <>(
        <div className="search-overlay" onClick={handleClose}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            {/* Search input */}
            <div className="search-input-container">
              <Search className="icon-sm" style={{ color: 'var(--neutral-400)' }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search surahs by name or number..."
                className="search-input"
              />
              <button
                onClick={handleClose}
                className="btn btn-icon"
                style={{ padding: '0.25rem' }}
              >
                <X className="icon-sm" />
              </button>
            </div>

            {/* Search results */}
            <div className="search-results">
              {/* Surah Results */}
              {results.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">Sureler</div>
                  {results.map((surah) => (
                    <Link
                      key={surah.id}
                      href={`/sure/${surah.id}`}
                      onClick={handleClose}
                      className="search-result-item"
                    >
                      <div className="search-result-number">
                        {surah.id}
                      </div>
                      <div className="search-result-info">
                        <div className="search-result-name">
                          {surah.translation}
                        </div>
                        <div className="search-result-details">
                          <span>{surah.transliteration}</span>
                          <span>•</span>
                          <span>{surah.total_verses} {t('home.verses')}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Verse Results */}
              {verseResults.length > 0 && (
                <div className="search-section">
                  <div className="search-section-title">
                    <FileText className="icon-sm" />
                    Ayetler
                  </div>
                  {verseResults.map((result) => (
                    <div key={`${result.surah.id}`}>
                      {result.verses.slice(0, 3).map((verse) => (
                        <Link
                          key={`${result.surah.id}-${verse.id}`}
                          href={`/sure/${result.surah.id}`}
                          onClick={handleClose}
                          className="search-verse-item"
                        >
                          <div className="search-verse-header">
                            <span className="search-verse-surah">{result.surah.translation}</span>
                            <span className="search-verse-number">Ayet {verse.id}</span>
                          </div>
                          <div className="search-verse-text">
                            {highlightText(verse.translation, query)}
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Loading state */}
              {searchingVerses && query.length >= 3 && (
                <div className="search-loading">
                  <p>Ayetler aranıyor...</p>
                </div>
              )}

              {/* Empty state */}
              {query && results.length === 0 && verseResults.length === 0 && !searchingVerses && (
                <div className="search-empty">
                  <p>Sonuç bulunamadı</p>
                </div>
              )}
            </div>

            {/* Footer hint */}
            {!query && (
              <div className="search-footer">
                <span className="search-hint">
                  Type to search • <kbd>ESC</kbd> to close
                </span>
              </div>
            )}
          </div>
        </div>
    </>
  );
}
