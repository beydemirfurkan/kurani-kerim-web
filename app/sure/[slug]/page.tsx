import { notFound } from 'next/navigation';
import { alQuranAPI } from '@/app/services/alquran-api';
import { generateSlug } from '@/app/lib/slug-utils';
import { SurahClient } from '@/app/components/surah-client';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all surahs
export async function generateStaticParams() {
  const data = await alQuranAPI.getAllSurahs('tr');
  return data.surahs.map((surah) => ({
    slug: generateSlug(surah.translation),
  }));
}

// Generate metadata for each surah page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await alQuranAPI.getAllSurahs('tr');
  const surah = data.surahs.find(s => generateSlug(s.translation) === slug);

  if (!surah) {
    return {
      title: 'Sure Bulunamadı',
    };
  }

  return {
    title: `${surah.translation} Suresi - Kuran-ı Kerim`,
    description: `${surah.translation} Suresi (${surah.name}) - ${surah.total_verses} ayet, ${surah.type === 'meccan' ? 'Mekki' : 'Medeni'} sure. Arapça metin, Türkçe meal ve sesli okuyuş ile birlikte.`,
    keywords: `${surah.translation}, ${surah.name}, kuran suresi, meal, arapça, türkçe meal, ayet, ${surah.type === 'meccan' ? 'mekki' : 'medeni'}`,
    openGraph: {
      title: `${surah.translation} Suresi - Kuran-ı Kerim`,
      description: `${surah.translation} Suresi - ${surah.total_verses} ayet içeren ${surah.type === 'meccan' ? 'Mekki' : 'Medeni'} sure.`,
      type: 'article',
    },
  };
}

export default async function SurePage({ params }: PageProps) {
  const { slug } = await params;

  // Server-side data fetching
  const data = await alQuranAPI.getAllSurahs('tr');
  const allSurahs = data.surahs;

  const foundSurah = allSurahs.find(s => generateSlug(s.translation) === slug);

  if (!foundSurah) {
    notFound();
  }

  const surahDetail = await alQuranAPI.getSurah(foundSurah.id, 'tr');

  return (
    <SurahClient
      initialSurah={foundSurah}
      initialSurahDetail={surahDetail}
      initialAllSurahs={allSurahs}
      slug={slug}
    />
  );
}
