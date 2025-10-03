'use client';

import { BookCheck } from 'lucide-react';
import { useProgress } from '../contexts/progress-context';

export function ProgressCard() {
  const { getProgress, getTotalRead } = useProgress();
  const progress = getProgress();
  const totalRead = getTotalRead();

  if (totalRead === 0) {
    return null; // Don't show if no progress
  }

  return (
    <div className="progress-card-minimal">
      <div className="progress-card-content">
        <BookCheck className="icon-sm" style={{ color: 'var(--primary-500)' }} />
        <span className="progress-text">{totalRead} / 114 sure okundu</span>
        <div className="progress-bar-mini">
          <div className="progress-bar-mini-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-percent">{progress}%</span>
      </div>
    </div>
  );
}
