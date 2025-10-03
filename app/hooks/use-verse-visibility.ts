'use client';

import { useState, useEffect, useRef, MutableRefObject } from 'react';

interface VerseVisibility {
  [verseIndex: number]: boolean;
}

export function useVerseVisibility(verseCount: number) {
  const [visibleVerses, setVisibleVerses] = useState<VerseVisibility>({});
  const [readVerses, setReadVerses] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const verseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const readVersesRef = useRef<Set<number>>(new Set());
  const visibilityTimers = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // Keep ref in sync with state
  useEffect(() => {
    readVersesRef.current = readVerses;
  }, [readVerses]);

  // Initialize verse refs array
  useEffect(() => {
    verseRefs.current = Array(verseCount).fill(null);
  }, [verseCount]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const newVisibleVerses: VerseVisibility = {};

        entries.forEach((entry) => {
          const verseIndex = parseInt(entry.target.getAttribute('data-verse-index') || '0');
          newVisibleVerses[verseIndex] = entry.isIntersecting;
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            // If not already read, start a timer
            if (!readVersesRef.current.has(verseIndex)) {
              // Clear any existing timer for this verse
              const existingTimer = visibilityTimers.current.get(verseIndex);
              if (existingTimer) {
                clearTimeout(existingTimer);
              }
              
              // Set a new timer to mark as read after 1 second of visibility
              const timer = setTimeout(() => {
                setReadVerses(prev => {
                  const newSet = new Set(prev);
                  newSet.add(verseIndex);
                  return newSet;
                });
                visibilityTimers.current.delete(verseIndex);
              }, 1000);
              
              visibilityTimers.current.set(verseIndex, timer);
            }
          } else {
            // Not visible anymore, cancel timer if exists
            const existingTimer = visibilityTimers.current.get(verseIndex);
            if (existingTimer) {
              clearTimeout(existingTimer);
              visibilityTimers.current.delete(verseIndex);
            }
          }
        });

        // Update visible verses
        setVisibleVerses(prev => ({ ...prev, ...newVisibleVerses }));
      },
      {
        threshold: [0, 0.3, 0.7],
        rootMargin: '-20% 0px -20% 0px' // Only consider as visible when in the middle 60% of screen
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      // Clear all timers
      visibilityTimers.current.forEach(timer => clearTimeout(timer));
      visibilityTimers.current.clear();
    };
  }, []); // Remove readVerses dependency

  const setVerseRef = (index: number) => (el: HTMLDivElement | null) => {
    verseRefs.current[index] = el;
    if (observerRef.current && el) {
      observerRef.current.observe(el);
    }
  };

  const getReadProgress = () => {
    if (verseCount === 0) return 0;
    return (readVerses.size / verseCount) * 100;
  };

  return {
    visibleVerses,
    readVerses,
    setVerseRef,
    getReadProgress,
    verseRefs: verseRefs as MutableRefObject<(HTMLDivElement | null)[]>
  };
}