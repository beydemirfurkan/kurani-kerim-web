'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, Check, BookCheck } from 'lucide-react';
import Link from 'next/link';
import { alQuranAPI, AlQuranSurah, AlQuranSurahDetail } from '@/app/services/alquran-api';
import { AudioPlayer } from '@/app/components/audio-player';
import { useLanguage } from '@/app/contexts/language-context';
import { useProgress } from '@/app/contexts/progress-context';

interface SurahClientProps {
  initialSurah: AlQuranSurah;
  initialSurahDetail: AlQuranSurahDetail;
  initialAllSurahs: AlQuranSurah[];
}

export function SurahClient({
  initialSurah,
  initialSurahDetail,
  initialAllSurahs,
}: SurahClientProps) {
  const { locale, t } = useLanguage();
  const { isRead, markAsRead, markAsUnread } = useProgress();
  const [surah, setSurah] = useState<AlQuranSurah>(initialSurah);
  const [surahDetail, setSurahDetail] = useState<AlQuranSurahDetail>(initialSurahDetail);
  const [allSurahs, setAllSurahs] = useState<AlQuranSurah[]>(initialAllSurahs);
  const [loading, setLoading] = useState(false);

  const isSurahRead = isRead(surah.id);

  const toggleRead = () => {
    if (isSurahRead) {
      markAsUnread(surah.id);
    } else {
      markAsRead(surah.id);
    }
  };

  useEffect(() => {
    // Refetch when locale changes
    if (locale !== 'tr') {
      setLoading(true);
      Promise.all([
        alQuranAPI.getAllSurahs(locale),
        alQuranAPI.getSurah(surah.id, locale),
      ])
        .then(([data, detail]) => {
          setAllSurahs(data.surahs);
          const foundSurah = data.surahs.find(s => s.id === surah.id);
          if (foundSurah) {
            setSurah(foundSurah);
          }
          setSurahDetail(detail);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching surah data:', error);
          setLoading(false);
        });
    } else {
      setSurah(initialSurah);
      setSurahDetail(initialSurahDetail);
      setAllSurahs(initialAllSurahs);
    }
  }, [locale, surah.id, initialSurah, initialSurahDetail, initialAllSurahs]);

  if (loading) {
    return (
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="content-container text-center py-12">
          <p style={{color: 'var(--neutral-600)'}}>Loading...</p>
        </div>
      </main>
    );
  }

  const prevSurah = allSurahs.find(s => s.id === surah.id - 1);
  const nextSurah = allSurahs.find(s => s.id === surah.id + 1);

  // Structured Data (JSON-LD) for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${surah.translation} Suresi`,
    alternativeHeadline: surah.name,
    description: `${surah.translation} Suresi - ${surah.total_verses} ayet içeren ${surah.type === 'meccan' ? 'Mekki' : 'Medeni'} sure.`,
    articleSection: 'Quran',
    about: {
      '@type': 'Thing',
      name: 'Quran',
      description: 'The Holy Quran'
    },
    inLanguage: ['ar', 'tr'],
    numberOfPages: surah.total_verses,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="content-container">
        {/* Breadcrumb */}
        <nav style={{ marginBottom: '1.5rem' }}>
          <ol style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            listStyle: 'none'
          }}>
            <li>
              <Link href="/" className="breadcrumb-link">
                {t('surah.breadcrumbHome')}
              </Link>
            </li>
            <li className="breadcrumb-separator">
              <ChevronRight style={{ width: '0.875rem', height: '0.875rem' }} />
            </li>
            <li className="breadcrumb-current">
              {surah.translation}
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div style={{
          marginBottom: '3rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '600',
            color: 'var(--foreground)',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            {surah.translation}
          </h1>

          <div className="arabic-text surah-header-arabic">
            {surah.name}
          </div>

          <div className="surah-header-info">
            <span className={`surah-badge ${surah.type === 'meccan' ? 'meccan' : 'medinan'}`}>
              {surah.type === 'meccan' ? t('home.meccan') : t('home.medinan')}
            </span>
            <span>•</span>
            <span>{surah.total_verses} {t('home.verses')}</span>
          </div>

          {/* Mark as Read Button */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              onClick={toggleRead}
              className={`btn ${isSurahRead ? 'btn-secondary' : 'btn-primary'}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isSurahRead ? (
                <>
                  <Check className="icon-sm" />
                  <span>Okundu İşaretini Kaldır</span>
                </>
              ) : (
                <>
                  <BookCheck className="icon-sm" />
                  <span>Okudum Olarak İşaretle</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audio Player */}
        {surahDetail.audio && Object.keys(surahDetail.audio).length > 0 && (
          <AudioPlayer audioData={surahDetail.audio} surahName={surah.translation} />
        )}

        {/* Verses */}
        <div className="card">
          {surahDetail.verses.length === 0 ? (
            <div className="text-center py-12">
              <p style={{color: 'var(--neutral-600)'}}>Verses could not be loaded.</p>
            </div>
          ) : (
            <div style={{ padding: '1rem' }} className="verses-container">
              {surahDetail.verses.map((verse, index) => (
                <div key={verse.id} style={{ marginBottom: index < surahDetail.verses.length - 1 ? '2rem' : '0' }} className="verse-item">
                  {/* Verse Number Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <span className="verse-number-badge">
                      {verse.id}
                    </span>
                    <div style={{
                      flex: 1,
                      height: '1px',
                      backgroundColor: 'var(--border)'
                    }} />
                  </div>

                  {/* Arabic Text */}
                  <div className="verse-arabic-container">
                    <p className="arabic-text verse-arabic-text">
                      {verse.text}
                    </p>
                  </div>

                  {/* Translation */}
                  <div className="verse-translation-container">
                    <p className="verse-translation-text">
                      {verse.translation}
                    </p>
                  </div>

                  {/* Separator */}
                  {index < surahDetail.verses.length - 1 && (
                    <div style={{
                      height: '1px',
                      backgroundColor: 'var(--border)',
                      margin: '2rem 0'
                    }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            {prevSurah ? (
              <Link href={`/sure/${prevSurah.id}`} className="btn btn-secondary">
                ← {prevSurah.translation}
              </Link>
            ) : (
              <div style={{ width: '150px' }} />
            )}

            <Link href="/" className="btn btn-primary">
              {t('surah.backToHome')}
            </Link>

            {nextSurah ? (
              <Link href={`/sure/${nextSurah.id}`} className="btn btn-secondary">
                {nextSurah.translation} →
              </Link>
            ) : (
              <div style={{ width: '150px' }} />
            )}
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
