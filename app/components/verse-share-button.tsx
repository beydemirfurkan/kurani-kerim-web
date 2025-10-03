'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { ShareModal } from './share-modal';
import { ShareData, createVerseUrl } from '@/app/lib/share-utils';

interface VerseShareButtonProps {
  surahId: number;
  surahName: string;
  surahNameArabic: string;
  verseNumber: number;
  arabicText: string;
  translation: string;
  className?: string;
}

export function VerseShareButton({
  surahId,
  surahName,
  surahNameArabic,
  verseNumber,
  arabicText,
  translation,
  className = ''
}: VerseShareButtonProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  const shareData: ShareData = {
    surahName,
    surahNameArabic,
    verseNumber,
    arabicText,
    translation,
    url: createVerseUrl(surahId, verseNumber)
  };

  return (
    <>
      <button
        onClick={() => setShowShareModal(true)}
        className={`verse-share-btn ${className}`}
        style={{
          padding: '0.5rem',
          backgroundColor: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '0.375rem',
          color: 'var(--neutral-600)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--primary-50)';
          e.currentTarget.style.borderColor = 'var(--primary-300)';
          e.currentTarget.style.color = 'var(--primary-600)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--neutral-600)';
        }}
        title="Ayeti Paylaş"
      >
        <Share2 style={{ width: '1rem', height: '1rem' }} />
      </button>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareData={shareData}
      />
    </>
  );
}