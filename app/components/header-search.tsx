'use client';

import { Search } from 'lucide-react';
import { useSearch } from '../contexts/search-context';

export function HeaderSearch() {
  const { openSearch } = useSearch();

  return (
    <button
      onClick={openSearch}
      className="search-trigger"
      aria-label="Search surahs"
    >
      <Search className="icon-sm" />
      <span className="search-trigger-text">Search...</span>
      <kbd className="search-kbd">⌘K</kbd>
    </button>
  );
}
