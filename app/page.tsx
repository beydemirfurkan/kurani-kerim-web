import { alQuranAPI } from './services/alquran-api';
import { HomeClient } from './components/home-client';

export const metadata = {
  title: 'Kuran-ı Kerim - Adım Adım Öğrenme Platformu',
  description: '114 sure ve binlerce ayeti Türkçe ve İngilizce mealleri ile birlikte okuyun, dinleyin ve adım adım öğrenin. İlerlemenizi takip edin.',
  keywords: 'kuran, kuran-ı kerim, meal, türkçe meal, arapça, sure, ayet, islam, din, öğrenme, quran, holy quran',
  openGraph: {
    title: 'Kuran-ı Kerim - Adım Adım Öğrenme Platformu',
    description: '114 sure ve binlerce ayeti mealleri ile birlikte okuyun, dinleyin ve adım adım öğrenin.',
    type: 'website',
  },
};

export default async function HomePage() {
  // Server-side data fetching
  const data = await alQuranAPI.getAllSurahs('tr');
  const surahs = data.surahs;

  return <HomeClient initialSurahs={surahs} />;
}
