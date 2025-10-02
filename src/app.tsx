import { BookOpen, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { SurahList } from './components/quran/surah-list';
import { SurahReader } from './components/quran/surah-reader';
import { type Surah } from './data/surahs';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'surahs' | 'reader'>('home');
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleStartLearning = () => {
    setCurrentView('surahs');
  };

  const handleSurahSelect = (surah: Surah) => {
    setSelectedSurah(surah);
    setCurrentView('reader');
  };

  const handleBackToSurahs = () => {
    setCurrentView('surahs');
    setSelectedSurah(null);
  };

  return (
    <div className={`min-h-screen transition ${isDark ? 'dark' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            <div className="logo-icon">
              <BookOpen className="icon-md" />
            </div>
            <div className="logo-text">
              <h1>Kuran-ı Kerim</h1>
              <p>Adım adım öğrenme platformu</p>
            </div>
          </div>
          
          <button onClick={toggleTheme} className="btn btn-secondary btn-icon">
            {isDark ? (
              <Sun className="icon-sm" />
            ) : (
              <Moon className="icon-sm" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {currentView === 'home' ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Kuran-ı Kerim'i Öğrenmeye Başlayın
              </h2>
              <p className="text-lg" style={{maxWidth: '48rem', margin: '0 auto'}}>
                114 sure ve binlerce ayeti Türkçe mealleri ile birlikte okuyun, 
                dinleyin ve adım adım öğrenin. İlerlemenizi takip edin.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3">
              {/* Feature Cards */}
              <div className="feature-card">
                <div className="feature-icon primary">
                  <BookOpen className="icon-lg" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Arapça Metin
                </h3>
                <p>
                  Orijinal Arapça metinleri güzel yazı fontu ile okuyun
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon sage">
                  <BookOpen className="icon-lg" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Türkçe Meal
                </h3>
                <p>
                  Güvenilir Türkçe çeviriler ile anlam öğrenin
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon primary">
                  <BookOpen className="icon-lg" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Sesli Okuma
                </h3>
                <p>
                  Profesyonel kıraat ile ayetleri dinleyin
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center">
              <button 
                onClick={handleStartLearning}
                className="btn btn-primary btn-lg"
              >
                Öğrenmeye Başla
              </button>
            </div>
          </>
        ) : currentView === 'surahs' ? (
          <SurahList onSurahSelect={handleSurahSelect} />
        ) : (
          selectedSurah && (
            <SurahReader 
              surah={selectedSurah} 
              onBack={handleBackToSurahs}
            />
          )
        )}
      </main>
    </div>
  );
}

export default App;