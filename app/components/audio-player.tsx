'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { AudioRecitation } from '../services/alquran-api';

interface AudioPlayerProps {
  audioData: Record<string, AudioRecitation>;
  surahName: string;
}

export function AudioPlayer({ audioData, surahName }: AudioPlayerProps) {
  const [selectedReciter, setSelectedReciter] = useState<string>('1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentAudio = audioData[selectedReciter];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    // Reset when reciter changes
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlaying(false);

      if (wasPlaying) {
        // Auto-play if it was playing before
        setTimeout(() => {
          audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
        }, 100);
      }
    }
  }, [selectedReciter]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}
    >
      <audio ref={audioRef} src={currentAudio?.url} preload="metadata" />

      {/* Header */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          {surahName} - Sesli Dinle
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--neutral-600)' }}>
          {currentAudio?.reciter}
        </p>
      </div>

      {/* Reciter Selection and Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <select
          value={selectedReciter}
          onChange={(e) => setSelectedReciter(e.target.value)}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '0.625rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--card-bg)',
            color: 'var(--foreground)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23525252' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '12px',
            paddingRight: '2.5rem'
          }}
        >
          {Object.entries(audioData).map(([key, recitation]) => (
            <option key={key} value={key}>
              {recitation.reciter}
            </option>
          ))}
        </select>

        <button
          onClick={togglePlay}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          {isPlaying ? (
            <>
              <Pause style={{ width: '1.25rem', height: '1.25rem' }} />
              Duraklat
            </>
          ) : (
            <>
              <Play style={{ width: '1.25rem', height: '1.25rem' }} />
              Oynat
            </>
          )}
        </button>

        <button
          onClick={toggleMute}
          className="btn btn-secondary btn-icon"
          style={{ padding: '0.5rem' }}
        >
          {isMuted ? (
            <VolumeX style={{ width: '1.25rem', height: '1.25rem' }} />
          ) : (
            <Volume2 style={{ width: '1.25rem', height: '1.25rem' }} />
          )}
        </button>
      </div>
    </div>
  );
}
