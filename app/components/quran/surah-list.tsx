import { BookOpen, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DiyanetApiService } from '../../services/diyanet-api';
import { type DiyanetChapter } from '../../types/quran';

interface SurahListProps {
  onSurahSelect: (surah: DiyanetChapter) => void;
}

export const SurahList = ({ onSurahSelect }: SurahListProps) => {
  const [showAll, setShowAll] = useState(false);
  const [surahs, setSurahs] = useState<DiyanetChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const displaySurahs = showAll ? surahs : surahs.slice(0, 10);

  // Fetch surahs from API
  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        setError(null);
        const diyanetApi = DiyanetApiService.getInstance();
        const chapters = await diyanetApi.getChapters();
        setSurahs(chapters);
      } catch (err) {
        setError('Sureler yüklenirken bir hata oluştu');
        console.error('Error fetching chapters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="card-content text-center py-12">
          <Loader2 className="icon-lg" style={{animation: 'spin 1s linear infinite', margin: '0 auto', color: 'var(--primary-500)'}} />
          <p className="mt-4" style={{color: 'var(--neutral-600)'}}>Sureler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-content text-center py-12">
          <p style={{color: 'var(--error)'}}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-semibold flex items-center gap-3">
          <BookOpen className="icon-sm" style={{color: 'var(--primary-500)'}} />
          Sureler
        </h2>
        <p className="text-sm" style={{color: 'var(--neutral-600)', marginTop: '0.25rem'}}>
          114 sure arasından seçim yapın
        </p>
      </div>

      <div>
        {displaySurahs.map((surah) => (
          <button
            key={surah.SureId}
            onClick={() => onSurahSelect(surah)}
            className="surah-item"
          >
            <div className="surah-content">
              <div className="surah-number">
                {surah.SureId}
              </div>

              <div className="surah-info">
                <div className="surah-names">
                  <h3 className="surah-name">
                    {surah.SureNameTurkish}
                  </h3>
                  <span className="surah-arabic arabic-text">
                    {surah.SureNameArabic}
                  </span>
                </div>
                <div className="surah-details">
                  <span>{surah.SureNameTurkish}</span>
                  <span>•</span>
                  <span>{surah.AyetCount} ayet</span>
                  <span>•</span>
                  <span className={`surah-badge ${
                    surah.InisOrder <= 86 ? 'meccan' : 'medinan'
                  }`}>
                    {surah.InisOrder <= 86 ? 'Mekki' : 'Medeni'}
                  </span>
                </div>
              </div>
            </div>

            <ChevronRight className="icon-sm surah-chevron" />
          </button>
        ))}
      </div>

      {!showAll && surahs.length > 10 && (
        <div className="card-footer">
          <button
            onClick={() => setShowAll(true)}
            className="btn btn-secondary flex items-center gap-2"
            style={{margin: '0 auto'}}
          >
            <ChevronDown className="icon-sm" />
            Tüm Sureleri Gör ({surahs.length - 10} sure daha)
          </button>
        </div>
      )}
    </div>
  );
};