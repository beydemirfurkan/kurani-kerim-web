'use client';

import { useLanguage } from '../contexts/language-context';
import { TR } from 'country-flag-icons/react/3x2';
import { GB } from 'country-flag-icons/react/3x2';

const languages = [
  { code: 'tr' as const, name: 'Türkçe', Icon: TR },
  { code: 'en' as const, name: 'English', Icon: GB },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const handleLanguageChange = (newLocale: 'tr' | 'en') => {
    setLocale(newLocale);
    // Refresh to apply new language
    window.location.reload();
  };

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => handleLanguageChange(locale === 'tr' ? 'en' : 'tr')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--foreground)',
          fontSize: '0.875rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        aria-label={`Switch to ${locale === 'tr' ? 'English' : 'Türkçe'}`}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--background)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--card-bg)';
        }}
      >
        {currentLanguage && (
          <>
            <currentLanguage.Icon style={{ width: '1.25rem', height: '0.875rem' }} />
            <span>{currentLanguage.code.toUpperCase()}</span>
          </>
        )}
      </button>
    </div>
  );
}
