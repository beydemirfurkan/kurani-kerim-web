'use client';

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, BookOpen, Eye, Check, Circle } from 'lucide-react';
import { useLanguage } from '@/app/contexts/language-context';

interface VerseProgressIndicatorProps {
  totalVerses: number;
  readVerses: Set<number>;
  visibleVerses: { [key: number]: boolean };
  onVerseClick: (verseIndex: number) => void;
}

export function VerseProgressIndicator({
  totalVerses,
  readVerses,
  visibleVerses,
  onVerseClick
}: VerseProgressIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getVerseStatus = (index: number) => {
    if (readVerses.has(index)) return 'read';
    if (visibleVerses[index]) return 'visible';
    return 'unread';
  };

  const readProgress = (readVerses.size / totalVerses) * 100;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        left: isMobile ? '1rem' : 'auto',
        maxWidth: isMobile ? 'none' : '320px',
        minWidth: '280px',
        zIndex: 1000,
        backgroundColor: 'var(--background)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '0.75rem 1rem',
          backgroundColor: 'var(--neutral-50)',
          borderBottom: isExpanded ? '1px solid var(--border)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          userSelect: 'none'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <BookOpen style={{ width: '1rem', height: '1rem', color: 'var(--primary-500)' }} />
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--foreground)' }}>
          {readVerses.size}/{totalVerses} {t('progress.verses')}
        </span>
        <div
          style={{
            flex: 1,
            height: '6px',
            backgroundColor: 'var(--neutral-200)',
            borderRadius: '3px',
            marginLeft: '0.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              background: `linear-gradient(90deg, var(--success-500) 0%, var(--success-400) 100%)`,
              width: `${readProgress}%`,
              borderRadius: '3px',
              transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: `${readProgress}%`,
              background: 'var(--neutral-200)'
            }}
          />
        </div>
        {isExpanded ? (
          <ChevronDown style={{ width: '1rem', height: '1rem' }} />
        ) : (
          <ChevronUp style={{ width: '1rem', height: '1rem' }} />
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          style={{
            padding: '1rem',
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(8, 1fr)' : 'repeat(10, 1fr)',
              gap: '0.375rem',
              marginBottom: '1rem',
              maxHeight: '200px',
              overflowY: 'auto',
              padding: '0.25rem'
            }}
          >
            {Array.from({ length: totalVerses }, (_, i) => {
              const status = getVerseStatus(i);
              let backgroundColor = 'var(--neutral-100)';
              let borderColor = 'var(--neutral-300)';
              let textColor = 'var(--neutral-600)';
              let hoverBg = 'var(--neutral-200)';
              
              if (status === 'read') {
                backgroundColor = 'var(--success-500)';
                borderColor = 'var(--success-600)';
                textColor = 'white';
                hoverBg = 'var(--success-600)';
              } else if (status === 'visible') {
                backgroundColor = 'var(--primary-500)';
                borderColor = 'var(--primary-600)';
                textColor = 'white';
                hoverBg = 'var(--primary-600)';
              }

              return (
                <button
                  key={i}
                  onClick={() => onVerseClick(i)}
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    borderRadius: '0.375rem',
                    backgroundColor,
                    border: `1px solid ${borderColor}`,
                    fontSize: '0.75rem',
                    color: textColor,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = backgroundColor;
                  }}
                  title={`${t('progress.verse')} ${i + 1} - ${status === 'read' ? t('progress.read') : status === 'visible' ? t('progress.visible') : t('progress.unread')}`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'var(--neutral-600)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Check style={{ width: '0.875rem', height: '0.875rem', color: 'var(--success-500)' }} />
              <span>{t('progress.read')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Eye style={{ width: '0.875rem', height: '0.875rem', color: 'var(--primary-500)' }} />
              <span>{t('progress.visible')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Circle style={{ width: '0.875rem', height: '0.875rem', color: 'var(--neutral-400)' }} />
              <span>{t('progress.unread')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}