'use client';

import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../contexts/language-context';
import type { AlQuranSurah } from '../services/alquran-api';
import { useEffect, useState } from 'react';
import { alQuranAPI } from '../services/alquran-api';
import { ProgressCard } from './progress-card';
import { useProgress } from '../contexts/progress-context';

interface HomeClientProps {
  initialSurahs: AlQuranSurah[];
}

export function HomeClient({ initialSurahs }: HomeClientProps) {
  const { locale, t } = useLanguage();
  const { isRead } = useProgress();
  const [surahs, setSurahs] = useState<AlQuranSurah[]>(initialSurahs);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only refetch if locale changes from default 'tr'
    if (locale !== 'tr') {
      setLoading(true);
      alQuranAPI.getAllSurahs(locale)
        .then(data => {
          setSurahs(data.surahs);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching surahs:', error);
          setLoading(false);
        });
    } else {
      setSurahs(initialSurahs);
    }
  }, [locale, initialSurahs]);

  return (
    <main className="container home-main">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div className="text-center home-hero">
          <h2 className="home-title">
            {t('home.title')}
          </h2>
          <p className="home-description">
            {t('home.description')}
          </p>
        </div>

        {/* Progress Card */}
        <ProgressCard />

        {/* Surah List */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <BookOpen className="icon-sm" style={{color: 'var(--primary-500)'}} />
              {t('home.surahs')}
            </h2>
            <p className="text-sm" style={{color: 'var(--neutral-600)', marginTop: '0.25rem'}}>
              {t('home.surahsDescription')}
            </p>
          </div>

          <div>
            {loading || surahs.length === 0 ? (
              <div className="text-center py-12">
                <p style={{color: 'var(--neutral-600)'}}>
                  {loading ? 'Loading...' : 'Surahs could not be loaded.'}
                </p>
              </div>
            ) : (
              surahs.map((surah) => (
                <Link
                  key={surah.id}
                  href={`/sure/${surah.id}`}
                  className="surah-item"
                >
                  <div className="surah-content">
                    <div className="surah-number">
                      {surah.id}
                    </div>

                    <div className="surah-info">
                      <div className="surah-names">
                        <h3 className="surah-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {surah.translation}
                          {isRead(surah.id) && (
                            <span className="read-badge">✓</span>
                          )}
                        </h3>
                        <span className="surah-arabic arabic-text">
                          {surah.name}
                        </span>
                      </div>
                      <div className="surah-details">
                        <span>{surah.total_verses} {t('home.verses')}</span>
                        <span>•</span>
                        <span className={`surah-badge ${surah.type === 'meccan' ? 'meccan' : 'medinan'}`}>
                          {surah.type === 'meccan' ? t('home.meccan') : t('home.medinan')}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
