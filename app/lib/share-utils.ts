export interface ShareData {
  surahName: string;
  surahNameArabic: string;
  verseNumber: number;
  arabicText: string;
  translation: string;
  url: string;
}

export function createVerseUrl(surahId: number, verseNumber: number): string {
  return `${typeof window !== 'undefined' ? window.location.origin : 'https://kurandersleri.com'}/sure/${surahId}#ayet-${verseNumber}`;
}

export function formatShareText(data: ShareData, platform: 'twitter' | 'facebook' | 'whatsapp' | 'generic'): string {
  const { surahName, verseNumber, arabicText, translation } = data;
  
  const baseText = `${surahName} Suresi, ${verseNumber}. Ayet:\n\n"${translation}"\n\n${arabicText}`;
  
  switch (platform) {
    case 'twitter':
      // Twitter has character limit, keep it concise
      const shortText = `${surahName} Suresi, ${verseNumber}. Ayet:\n\n"${translation}"`;
      return shortText.length > 240 ? shortText.substring(0, 237) + '...' : shortText;
    
    case 'whatsapp':
      return `${baseText}\n\n📖 Kuran Dersleri'nden paylaşıldı`;
    
    case 'facebook':
    case 'generic':
    default:
      return baseText;
  }
}

export function shareOnTwitter(data: ShareData): void {
  const text = formatShareText(data, 'twitter');
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(data.url)}`;
  window.open(url, '_blank', 'width=550,height=420');
}

export function shareOnFacebook(url: string): void {
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(shareUrl, '_blank', 'width=580,height=400');
}

export function shareOnWhatsApp(data: ShareData): void {
  const text = formatShareText(data, 'whatsapp');
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n\n' + data.url)}`;
  window.open(shareUrl, '_blank');
}

export function shareViaTelegram(data: ShareData): void {
  const text = formatShareText(data, 'generic');
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(text)}`;
  window.open(shareUrl, '_blank');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      textArea.remove();
      return result;
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

export function canShare(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator;
}

export async function nativeShare(data: ShareData): Promise<boolean> {
  if (!canShare()) return false;
  
  try {
    await navigator.share({
      title: `${data.surahName} Suresi, ${data.verseNumber}. Ayet`,
      text: formatShareText(data, 'generic'),
      url: data.url,
    });
    return true;
  } catch (err) {
    console.error('Native share failed:', err);
    return false;
  }
}