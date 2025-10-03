import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { type DiyanetChapter } from '../../types/quran';
import { DiyanetApiService } from '../../services/diyanet-api';
import { type DiyanetVerse } from '../../types/quran';

interface SurahReaderProps {
  surah: DiyanetChapter;
  onBack: () => void;
}

export const SurahReader = ({ surah, onBack }: SurahReaderProps) => {
  const [currentAyah, setCurrentAyah] = useState(0);
  const [verses, setVerses] = useState<DiyanetVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch verses from Diyanet API
  useEffect(() => {
    const fetchVerses = async () => {
      try {
        setLoading(true);
        setError(null);
        const diyanetApi = DiyanetApiService.getInstance();
        const fetchedVerses = await diyanetApi.getChapterVerses(surah.SureId);
        setVerses(fetchedVerses);
      } catch (err) {
        setError('Ayetler yüklenirken bir hata oluştu');
        console.error('Error fetching verses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [surah.SureId]);

  const currentVerse = verses[currentAyah];

  const handleNextAyah = () => {
    if (currentAyah < verses.length - 1) {
      setCurrentAyah(currentAyah + 1);
    }
  };

  const handlePrevAyah = () => {
    if (currentAyah > 0) {
      setCurrentAyah(currentAyah - 1);
    }
  };

  const handleAyahSelect = (index: number) => {
    setCurrentAyah(index);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="card">
        <div className="card-content text-center py-12">
          <Loader2 className="icon-lg" style={{animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--primary-500)'}} />
          <p className="mt-4 loading-text">Ayetler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !currentVerse) {
    return (
      <div className="card">
        <div className="card-header">
          <button onClick={onBack} className="btn btn-secondary btn-icon">
            <ArrowLeft className="icon-sm" />
          </button>
        </div>
        <div className="card-content text-center py-12">
          <p style={{color: 'var(--error)'}}>{error || 'Ayetler yüklenemedi'}</p>
          <button onClick={onBack} className="btn btn-primary mt-4">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="btn btn-secondary btn-icon"
          >
            <ArrowLeft className="icon-sm" />
          </button>

          <div className="text-center">
            <h2 className="text-xl font-semibold flex items-center gap-3 justify-center">
              <BookOpen className="icon-sm" style={{color: 'var(--primary-500)'}} />
              {surah.SureNameTurkish}
            </h2>
            <p className="text-sm arabic-text header-subtitle">
              {surah.SureNameArabic}
            </p>
            <p className="text-sm header-subtitle">
              {surah.SureNameTurkish} • {surah.AyetCount} ayet • {surah.InisOrder <= 86 ? 'Mekki' : 'Medeni'}
            </p>
          </div>

          <div style={{width: '2.5rem'}} /> {/* Spacer for center alignment */}
        </div>
      </div>

      {/* Ayah Display */}
      <div className="card-content">
        <div className="text-center mb-8">
          <div className="mb-4">
            <span className="surah-badge primary" style={{fontSize: '0.875rem', padding: '0.5rem 1rem'}}>
              {currentVerse.verse_id_in_surah}. Ayet
            </span>
          </div>

          {/* Arabic Text */}
          <div className="mb-6">
            <p className="arabic-text" style={{
              fontSize: '2rem',
              lineHeight: '3rem',
              color: 'var(--foreground)',
              marginBottom: '1rem'
            }}>
              {currentVerse.arabic_script.text}
            </p>
          </div>

          {/* Turkish Translation */}
          <div className="mb-4">
            <h4 className="font-medium mb-2 translation-title">
              Türkçe Meal:
            </h4>
            <p className="translation-text">
              {currentVerse.translation.text}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handlePrevAyah}
            disabled={currentAyah === 0}
            className="btn btn-secondary"
            style={{
              opacity: currentAyah === 0 ? 0.5 : 1,
              cursor: currentAyah === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Önceki Ayet
          </button>

          <div className="flex items-center gap-2" style={{maxWidth: '100%', overflowX: 'auto', padding: '0.5rem'}}>
            {verses.slice(0, Math.min(verses.length, 20)).map((_, index) => (
              <button
                key={index}
                onClick={() => handleAyahSelect(index)}
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentAyah ? 'var(--primary-500)' : 'var(--neutral-300)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  flexShrink: 0
                }}
              />
            ))}
            {verses.length > 20 && (
              <span style={{fontSize: '0.75rem', color: 'var(--neutral-500)', marginLeft: '0.5rem'}}>
                +{verses.length - 20}
              </span>
            )}
          </div>

          <button
            onClick={handleNextAyah}
            disabled={currentAyah === verses.length - 1}
            className="btn btn-secondary"
            style={{
              opacity: currentAyah === verses.length - 1 ? 0.5 : 1,
              cursor: currentAyah === verses.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Sonraki Ayet
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="card-footer">
        <div className="text-center">
          <p className="text-sm progress-text">
            {currentAyah + 1} / {verses.length} ayet
          </p>
          <div style={{
            width: '100%',
            height: '0.25rem',
            backgroundColor: 'var(--neutral-200)',
            borderRadius: '0.125rem',
            marginTop: '0.5rem'
          }}>
            <div style={{
              width: `${((currentAyah + 1) / verses.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--primary-500)',
              borderRadius: '0.125rem',
              transition: 'var(--transition)'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};