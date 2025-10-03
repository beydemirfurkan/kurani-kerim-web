// Utility functions for generating and parsing URL slugs from Turkish surah names

export function generateSlug(turkishName: string): string {
  return turkishName
    .toLowerCase()
    // Uzun ünlüleri normal ünlülere çevir
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/û/g, 'u')
    .replace(/ê/g, 'e')
    .replace(/ô/g, 'o')
    // Türkçe karakterleri çevir
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    // Özel karakterleri ve boşlukları tire ile değiştir
    .replace(/[^a-z0-9]/g, '-')
    // Birden fazla tireyi tek tireye çevir
    .replace(/-+/g, '-')
    // Başta ve sondaki tireleri kaldır
    .replace(/^-|-$/g, '');
}

export function getSlugMapping(): Record<string, number> {
  // This will be populated with actual surah names when we fetch them
  // For now, return empty object - will be filled dynamically
  return {};
}

// Helper to find surah ID by slug
export function getSurahIdBySlug(slug: string, chapters: Array<{SureId: number, SureNameTurkish: string}>): number | null {
  const chapter = chapters.find(ch => generateSlug(ch.SureNameTurkish) === slug);
  return chapter ? chapter.SureId : null;
}

// Helper to get slug by surah ID
export function getSlugBySurahId(surahId: number, chapters: Array<{SureId: number, SureNameTurkish: string}>): string | null {
  const chapter = chapters.find(ch => ch.SureId === surahId);
  return chapter ? generateSlug(chapter.SureNameTurkish) : null;
}