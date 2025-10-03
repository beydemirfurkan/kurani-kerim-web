'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ProgressContextType {
  readSurahs: Set<number>;
  markAsRead: (surahId: number) => void;
  markAsUnread: (surahId: number) => void;
  isRead: (surahId: number) => boolean;
  getProgress: () => number;
  getTotalRead: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const STORAGE_KEY = 'quran-read-progress';
const TOTAL_SURAHS = 114;

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [readSurahs, setReadSurahs] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setReadSurahs(new Set(parsed));
        }
      } catch (error) {
        console.error('Error loading reading progress:', error);
      }
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever readSurahs changes
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readSurahs)));
      } catch (error) {
        console.error('Error saving reading progress:', error);
      }
    }
  }, [readSurahs, isLoaded]);

  const markAsRead = (surahId: number) => {
    setReadSurahs(prev => new Set(prev).add(surahId));
  };

  const markAsUnread = (surahId: number) => {
    setReadSurahs(prev => {
      const newSet = new Set(prev);
      newSet.delete(surahId);
      return newSet;
    });
  };

  const isRead = (surahId: number) => {
    return readSurahs.has(surahId);
  };

  const getProgress = () => {
    return Math.round((readSurahs.size / TOTAL_SURAHS) * 100);
  };

  const getTotalRead = () => {
    return readSurahs.size;
  };

  return (
    <ProgressContext.Provider
      value={{
        readSurahs,
        markAsRead,
        markAsUnread,
        isRead,
        getProgress,
        getTotalRead,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
