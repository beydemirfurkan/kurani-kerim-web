import { ArrowLeft, BookOpen, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import { type Surah } from '../../data/surahs';

interface SurahReaderProps {
  surah: Surah;
  onBack: () => void;
}

// Mock ayet verisi - gerçek API'den gelecek
const mockAyahs = [
  {
    number: 1,
    text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    translation: 'Rahman ve Rahim olan Allah\'ın adıyla',
    transliteration: 'Bismillahir rahmanir rahim'
  },
  {
    number: 2,
    text: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
    translation: 'Hamd, âlemlerin Rabbi olan Allah\'a mahsustur',
    transliteration: 'Alhamdu lillahi rabbil alameen'
  },
  {
    number: 3,
    text: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    translation: 'O Rahman\'dır, Rahim\'dir',
    transliteration: 'Ar rahmanir rahim'
  }
];

export const SurahReader = ({ surah, onBack }: SurahReaderProps) => {
  const [currentAyah, setCurrentAyah] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNextAyah = () => {
    if (currentAyah < mockAyahs.length - 1) {
      setCurrentAyah(currentAyah + 1);
    }
  };

  const handlePrevAyah = () => {
    if (currentAyah > 0) {
      setCurrentAyah(currentAyah - 1);
    }
  };

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
    // Burada gerçek ses çalma fonksiyonu olacak
  };

  const ayah = mockAyahs[currentAyah];

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
              {surah.englishName}
            </h2>
            <p className="text-sm arabic-text" style={{color: 'var(--neutral-600)', marginTop: '0.25rem'}}>
              {surah.name}
            </p>
            <p className="text-sm" style={{color: 'var(--neutral-600)'}}>
              {surah.englishNameTranslation} • {surah.numberOfAyahs} ayet • {surah.revelationType === 'Meccan' ? 'Mekki' : 'Medeni'}
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
              {currentAyah + 1}. Ayet
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
              {ayah.text}
            </p>
          </div>

          {/* Turkish Translation */}
          <div className="mb-4">
            <h4 className="font-medium mb-2" style={{color: 'var(--primary-600)'}}>
              Türkçe Meal:
            </h4>
            <p style={{
              fontSize: '1.125rem',
              lineHeight: '1.75rem',
              color: 'var(--foreground)'
            }}>
              {ayah.translation}
            </p>
          </div>

          {/* Transliteration */}
          <div>
            <h4 className="font-medium mb-2" style={{color: 'var(--sage-600)'}}>
              Okunuşu:
            </h4>
            <p style={{
              fontSize: '1rem',
              fontStyle: 'italic',
              color: 'var(--neutral-600)'
            }}>
              {ayah.transliteration}
            </p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="text-center mb-6">
          <button 
            onClick={toggleAudio}
            className="btn btn-primary flex items-center gap-2"
            style={{margin: '0 auto'}}
          >
            {isPlaying ? (
              <>
                <Pause className="icon-sm" />
                Duraklat
              </>
            ) : (
              <>
                <Play className="icon-sm" />
                Dinle
              </>
            )}
          </button>
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

          <div className="flex items-center gap-2">
            {mockAyahs.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentAyah(index)}
                style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentAyah ? 'var(--primary-500)' : 'var(--neutral-300)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              />
            ))}
          </div>

          <button 
            onClick={handleNextAyah}
            disabled={currentAyah === mockAyahs.length - 1}
            className="btn btn-secondary"
            style={{
              opacity: currentAyah === mockAyahs.length - 1 ? 0.5 : 1,
              cursor: currentAyah === mockAyahs.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Sonraki Ayet
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="card-footer">
        <div className="text-center">
          <p className="text-sm" style={{color: 'var(--neutral-600)'}}>
            {currentAyah + 1} / {mockAyahs.length} ayet
          </p>
          <div style={{
            width: '100%',
            height: '0.25rem',
            backgroundColor: 'var(--neutral-200)',
            borderRadius: '0.125rem',
            marginTop: '0.5rem'
          }}>
            <div style={{
              width: `${((currentAyah + 1) / mockAyahs.length) * 100}%`,
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