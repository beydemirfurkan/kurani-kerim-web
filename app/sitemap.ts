import { MetadataRoute } from 'next';
import { alQuranAPI } from './services/alquran-api';
import { generateSlug } from './lib/slug-utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kurani-kerim.com'; // Update with your actual domain

  // Fetch all surahs
  const data = await alQuranAPI.getAllSurahs('tr');
  const surahs = data.surahs;

  // Homepage
  const homepage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
  };

  // Surah pages
  const surahPages = surahs.map((surah) => ({
    url: `${baseUrl}/sure/${generateSlug(surah.translation)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [homepage, ...surahPages];
}
