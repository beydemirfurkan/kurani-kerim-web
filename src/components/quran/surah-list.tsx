import { BookOpen, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { surahs, type Surah } from '../../data/surahs';

interface SurahListProps {
  onSurahSelect: (surah: Surah) => void;
}

export const SurahList = ({ onSurahSelect }: SurahListProps) => {
  const [showAll, setShowAll] = useState(false);
  const displaySurahs = showAll ? surahs : surahs.slice(0, 10);

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
            key={surah.number}
            onClick={() => onSurahSelect(surah)}
            className="surah-item"
          >
            <div className="surah-content">
              <div className="surah-number">
                {surah.number}
              </div>
              
              <div className="surah-info">
                <div className="surah-names">
                  <h3 className="surah-name">
                    {surah.englishName}
                  </h3>
                  <span className="surah-arabic arabic-text">
                    {surah.name}
                  </span>
                </div>
                <div className="surah-details">
                  <span>{surah.englishNameTranslation}</span>
                  <span>•</span>
                  <span>{surah.numberOfAyahs} ayet</span>
                  <span>•</span>
                  <span className={`surah-badge ${
                    surah.revelationType === 'Meccan' ? 'meccan' : 'medinan'
                  }`}>
                    {surah.revelationType === 'Meccan' ? 'Mekki' : 'Medeni'}
                  </span>
                </div>
              </div>
            </div>
            
            <ChevronRight className="icon-sm surah-chevron" />
          </button>
        ))}
      </div>
      
      {!showAll && (
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