import { BookOpen, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { DiyanetChapter } from './types/quran';
import { ThemeToggle } from './components/theme-toggle';
import { generateSlug } from './lib/slug-utils';

// Server-side function to fetch chapters
async function getChapters(): Promise<DiyanetChapter[]> {
  try {
    const response = await fetch(
      `${process.env.DIYANET_API_BASE_URL}/chapters?language=tr`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.DIYANET_API_KEY}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch chapters');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
}

export default async function HomePage() {
  const chapters = await getChapters();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
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

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Kuran-ı Kerim'i Öğrenmeye Başlayın
          </h2>
          <p className="text-lg" style={{maxWidth: '48rem', margin: '0 auto'}}>
            114 sure ve binlerce ayeti Türkçe mealleri ile birlikte okuyun,
            dinleyin ve adım adım öğrenin. İlerlemenizi takip edin.
          </p>
        </div>


        {/* Surah List */}
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
            {chapters.length === 0 ? (
              <div className="text-center py-12">
                <p style={{color: 'var(--neutral-600)'}}>Sureler yüklenemedi.</p>
              </div>
            ) : (
              chapters.map((chapter) => (
                <Link
                  key={chapter.SureId}
                  href={`/sure/${generateSlug(chapter.SureNameTurkish)}`}
                  className="surah-item"
                >
                  <div className="surah-content">
                    <div className="surah-number">
                      {chapter.SureId}
                    </div>

                    <div className="surah-info">
                      <div className="surah-names">
                        <h3 className="surah-name">
                          {chapter.SureNameTurkish}
                        </h3>
                        <span className="surah-arabic arabic-text">
                          {chapter.SureNameArabic}
                        </span>
                      </div>
                      <div className="surah-details">
                        <span>{chapter.AyetCount} ayet</span>
                        <span>•</span>
                        <span className={`surah-badge ${
                          chapter.InisOrder <= 86 ? 'meccan' : 'medinan'
                        }`}>
                          {chapter.InisOrder <= 86 ? 'Mekki' : 'Medeni'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}