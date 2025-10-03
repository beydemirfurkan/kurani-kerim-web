'use client';

import { useState, useEffect } from 'react';
import { X, Share2, Copy, Check, MessageCircle, Send, Facebook } from 'lucide-react';
import { useLanguage } from '@/app/contexts/language-context';
import { 
  ShareData, 
  shareOnTwitter, 
  shareOnFacebook, 
  shareOnWhatsApp, 
  shareViaTelegram,
  copyToClipboard,
  nativeShare,
  canShare,
  formatShareText
} from '@/app/lib/share-utils';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareData;
}

export function ShareModal({ isOpen, onClose, shareData }: ShareModalProps) {
  const [copiedStates, setCopiedStates] = useState({ link: false, text: false });
  const [showNativeShare, setShowNativeShare] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { t, locale } = useLanguage();

  useEffect(() => {
    setShowNativeShare(canShare());
  }, []);

  useEffect(() => {
    if (copiedStates.link) {
      const timer = setTimeout(() => setCopiedStates(prev => ({ ...prev, link: false })), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedStates.link]);

  useEffect(() => {
    if (copiedStates.text) {
      const timer = setTimeout(() => setCopiedStates(prev => ({ ...prev, text: false })), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedStates.text]);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareData.url);
    if (success) {
      setCopiedStates(prev => ({ ...prev, link: true }));
    }
  };

  const handleCopyText = async () => {
    const text = formatShareText(shareData, 'generic') + '\n\n' + shareData.url;
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedStates(prev => ({ ...prev, text: true }));
    }
  };

  const handleNativeShare = async () => {
    try {
      setIsSharing(true);
      const success = await nativeShare(shareData);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Native share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleSocialShare = async (shareFunction: () => void) => {
    try {
      setIsSharing(true);
      shareFunction();
      // Give some time for the popup to open
      setTimeout(() => setIsSharing(false), 1000);
    } catch (error) {
      console.error('Social share failed:', error);
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--background)',
          borderRadius: '1rem',
          padding: '1.25rem',
          maxWidth: '420px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--border)',
          backdropFilter: 'blur(10px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--foreground)', margin: 0 }}>
            {t('share.title')}
          </h3>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderRadius: '0.5rem',
              color: 'var(--neutral-500)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--neutral-100)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </div>

        {/* Verse Preview */}
        <div
          style={{
            backgroundColor: 'var(--primary-50)',
            padding: '0.875rem',
            borderRadius: '0.625rem',
            marginBottom: '1.25rem',
            border: '1px solid var(--primary-200)'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: '500', marginBottom: '0.5rem' }}>
            {shareData.surahName} • {shareData.verseNumber}. Ayet
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--neutral-700)', lineHeight: '1.4' }}>
            "{shareData.translation}"
          </div>
        </div>

        {/* Native Share (if available) */}
        {showNativeShare && (
          <button
            onClick={handleNativeShare}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-600)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-500)';
            }}
          >
            <Share2 style={{ width: '1rem', height: '1rem' }} />
            {t('share.share')}
          </button>
        )}

        {/* Social Media Buttons */}
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--neutral-600)', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
            {t('share.socialMedia')}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.375rem' }}>
            {/* WhatsApp */}
            <button
              onClick={() => handleSocialShare(() => shareOnWhatsApp(shareData))}
              style={{
                padding: '0.5rem',
                backgroundColor: '#25D366',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                aspectRatio: '1',
                minHeight: '2.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1DA851';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#25D366';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="WhatsApp'ta Paylaş"
            >
              <MessageCircle style={{ width: '1rem', height: '1rem' }} />
            </button>

            {/* Twitter */}
            <button
              onClick={() => handleSocialShare(() => shareOnTwitter(shareData))}
              style={{
                padding: '0.5rem',
                backgroundColor: '#1DA1F2',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                aspectRatio: '1',
                minHeight: '2.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0D8BD9';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1DA1F2';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Twitter'da Paylaş"
            >
              <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>𝕏</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => handleSocialShare(() => shareOnFacebook(shareData.url))}
              style={{
                padding: '0.5rem',
                backgroundColor: '#1877F2',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                aspectRatio: '1',
                minHeight: '2.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0C63D4';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1877F2';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Facebook'ta Paylaş"
            >
              <Facebook style={{ width: '1rem', height: '1rem' }} />
            </button>

            {/* Telegram */}
            <button
              onClick={() => handleSocialShare(() => shareViaTelegram(shareData))}
              style={{
                padding: '0.5rem',
                backgroundColor: '#0088CC',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                aspectRatio: '1',
                minHeight: '2.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0077B5';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0088CC';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Telegram'da Paylaş"
            >
              <Send style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>
        </div>

        {/* Copy Options */}
        <div>
          <h4 style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--neutral-600)', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
            {t('share.copy')}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.375rem' }}>
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              style={{
                padding: '0.5rem',
                backgroundColor: copiedStates.link ? 'var(--success-500)' : 'var(--neutral-100)',
                color: copiedStates.link ? 'white' : 'var(--neutral-700)',
                border: '1px solid var(--border)',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                transition: 'all 0.2s ease'
              }}
            >
              {copiedStates.link ? (
                <>
                  <Check style={{ width: '1rem', height: '1rem' }} />
                  {t('share.copied')}
                </>
              ) : (
                <>
                  <Copy style={{ width: '1rem', height: '1rem' }} />
                  {t('share.copyLink')}
                </>
              )}
            </button>

            {/* Copy Text */}
            <button
              onClick={handleCopyText}
              style={{
                padding: '0.5rem',
                backgroundColor: copiedStates.text ? 'var(--success-500)' : 'var(--neutral-100)',
                color: copiedStates.text ? 'white' : 'var(--neutral-700)',
                border: '1px solid var(--border)',
                borderRadius: '0.375rem',
                fontSize: '0.8rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.375rem',
                transition: 'all 0.2s ease'
              }}
            >
              {copiedStates.text ? (
                <>
                  <Check style={{ width: '1rem', height: '1rem' }} />
                  {t('share.copied')}
                </>
              ) : (
                <>
                  <Copy style={{ width: '1rem', height: '1rem' }} />
                  {t('share.copyText')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}