import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { DiyanetVerse, DiyanetChapter } from '@/app/types/quran';
import { generateSlug, getSurahIdBySlug, getSlugBySurahId } from '@/app/lib/slug-utils';

// Server-side function to fetch all chapters
async function getAllChapters(): Promise<DiyanetChapter[]> {
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

// Server-side function to fetch verses
async function getVerses(chapterId: number): Promise<DiyanetVerse[]> {
  try {
    const response = await fetch(
      `${process.env.DIYANET_API_BASE_URL}/chapters/${chapterId}?language=tr`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.DIYANET_API_KEY}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch verses');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching verses:', error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const chapters = await getAllChapters();
  const surahId = getSurahIdBySlug(slug, chapters);
  
  if (!surahId) {
    return {
      title: 'Sure Bulunamadı | Kuran-ı Kerim',
      description: 'Aradığınız sure bulunamadı.',
    };
  }

  const chapter = chapters.find(ch => ch.SureId === surahId);
  if (!chapter) {
    return {
      title: 'Sure Bulunamadı | Kuran-ı Kerim',
      description: 'Aradığınız sure bulunamadı.',
    };
  }

  return {
    title: `${chapter.SureNameTurkish} (${chapter.SureNameArabic}) | Kuran-ı Kerim`,
    description: `${chapter.SureNameTurkish} suresini Türkçe meali ile okuyun. ${chapter.AyetCount} ayet, ${chapter.InisOrder <= 86 ? 'Mekki' : 'Medeni'} sure.`,
    openGraph: {
      title: `${chapter.SureNameTurkish} - Kuran-ı Kerim`,
      description: `${chapter.SureNameTurkish} suresini Türkçe meali ile okuyun.`,
      type: 'article',
    },
  };
}

export default async function SurePage({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch all chapters to resolve slug
  const chapters = await getAllChapters();
  const surahId = getSurahIdBySlug(slug, chapters);
  
  if (!surahId) {
    notFound();
  }

  const chapter = chapters.find(ch => ch.SureId === surahId);
  if (!chapter) {
    notFound();
  }

  // Fetch verses
  const verses = await getVerses(surahId);

  // Group verses by unique verse_id_in_surah (remove duplicates)
  const uniqueVerses = verses.reduce((acc: DiyanetVerse[], verse) => {
    const existingVerse = acc.find(v => v.verse_id_in_surah === verse.verse_id_in_surah);
    if (!existingVerse) {
      acc.push(verse);
    }
    return acc;
  }, []).sort((a, b) => a.verse_id_in_surah - b.verse_id_in_surah);

  // Get navigation URLs
  const prevChapter = chapters.find(ch => ch.SureId === chapter.SureId - 1);
  const nextChapter = chapters.find(ch => ch.SureId === chapter.SureId + 1);
  const prevSlug = prevChapter ? generateSlug(prevChapter.SureNameTurkish) : null;
  const nextSlug = nextChapter ? generateSlug(nextChapter.SureNameTurkish) : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/" className="btn btn-secondary btn-icon">
              <ArrowLeft className="icon-sm" />
            </Link>
            
            <div className="text-center">
              <h1 className="text-xl font-semibold flex items-center gap-3 justify-center">
                <BookOpen className="icon-sm" style={{color: 'var(--primary-500)'}} />
                {chapter.SureNameTurkish}
              </h1>
              <p className="text-sm arabic-text" style={{color: 'var(--neutral-600)', marginTop: '0.25rem'}}>
                {chapter.SureNameArabic}
              </p>
              <p className="text-sm" style={{color: 'var(--neutral-600)'}}>
                {chapter.AyetCount} ayet • {chapter.InisOrder <= 86 ? 'Mekki' : 'Medeni'}
              </p>
            </div>

            <div style={{width: '2.5rem'}} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-8">
        <div className="card">
          <div className="card-content">
            {uniqueVerses.length === 0 ? (
              <div className="text-center py-12">
                <p style={{color: 'var(--neutral-600)'}}>Bu sure için ayetler yüklenemedi.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {uniqueVerses.map((verse, index) => (
                  <div key={verse.verse_id_in_surah} className="verse-container">
                    {/* Verse Number */}
                    <div className="text-center mb-4">
                      <span className="surah-badge primary" style={{fontSize: '0.875rem', padding: '0.5rem 1rem'}}>
                        {verse.verse_id_in_surah}. Ayet
                      </span>
                    </div>

                    {/* Arabic Text */}
                    <div className="text-center mb-6">
                      <p className="arabic-text" style={{
                        fontSize: '2rem',
                        lineHeight: '3rem',
                        color: 'var(--foreground)',
                        marginBottom: '1rem'
                      }}>
                        {verse.arabic_script.text}
                      </p>
                    </div>

                    {/* Turkish Translation */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-2" style={{color: 'var(--primary-600)'}}>
                        Türkçe Meal:
                      </h4>
                      <p style={{
                        fontSize: '1.125rem',
                        lineHeight: '1.75rem',
                        color: 'var(--foreground)'
                      }}>
                        {verse.translation.text}
                      </p>
                    </div>

                    {/* Separator */}
                    {index < uniqueVerses.length - 1 && (
                      <div style={{
                        height: '1px',
                        backgroundColor: 'var(--neutral-200)',
                        margin: '2rem 0'
                      }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with navigation */}
          <div className="card-footer">
            <div className="flex items-center justify-between">
              {prevSlug ? (
                <Link href={`/sure/${prevSlug}`} className="btn btn-secondary">
                  ← {prevChapter?.SureNameTurkish}
                </Link>
              ) : (
                <div />
              )}
              
              <Link href="/" className="btn btn-primary">
                Ana Sayfa
              </Link>
              
              {nextSlug ? (
                <Link href={`/sure/${nextSlug}`} className="btn btn-secondary">
                  {nextChapter?.SureNameTurkish} →
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Generate static params for all surahs using slugs
export async function generateStaticParams() {
  const chapters = await getAllChapters();
  
  return chapters.map((chapter) => ({
    slug: generateSlug(chapter.SureNameTurkish),
  }));
}