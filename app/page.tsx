import { alQuranAPI } from './services/alquran-api';
import { HomeClient } from './components/home-client';

export const metadata = {
  title: 'Kuran Dersleri - Online Kuran Öğrenme Platformu',
  description: '114 sure ve binlerce ayeti Türkçe ve İngilizce mealleri ile birlikte okuyun, dinleyin ve online kuran dersleri alın. İlerlemenizi takip edin.',
  keywords: 'kuran dersleri, online kuran, kuran öğrenme, meal, türkçe meal, arapça, sure, ayet, islam, din, eğitim, quran, holy quran',
  openGraph: {
    title: 'Kuran Dersleri - Online Kuran Öğrenme Platformu',
    description: '114 sure ve binlerce ayeti mealleri ile birlikte okuyun, dinleyin ve online kuran dersleri alın.',
    type: 'website',
  },
};

export default async function HomePage() {
  // Server-side data fetching
  const data = await alQuranAPI.getAllSurahs('tr');
  const surahs = data.surahs;

  return <HomeClient initialSurahs={surahs} />;
}
