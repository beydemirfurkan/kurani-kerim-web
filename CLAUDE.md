# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turkish/English Quran learning platform built with Next.js 15, featuring step-by-step reading, audio playback, and progress tracking. The application provides access to all 114 surahs with translations and audio recitations.

## Development Commands

```bash
# Development server (runs on port 3339)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Architecture

### Core Services
- **AlQuran API Service** (`app/services/alquran-api.ts`): Primary API client for fetching Quran data from alquran-api.pages.dev
- **Diyanet API Service** (`app/services/diyanet-api.ts`): Secondary API for Turkish translations
- **API Routes** (`app/api/`): Local proxy endpoints to handle CORS and caching

### State Management
- **Language Context** (`app/contexts/language-context.tsx`): Manages Turkish/English locale switching with localStorage persistence
- **Progress Context** (`app/contexts/progress-context.tsx`): Tracks reading progress across surahs
- **Search Context** (`app/contexts/search-context.tsx`): Global search functionality

### Key Components
- **Audio Player** (`app/components/audio-player.tsx`): Handles Quran recitation playback
- **Surah Reader** (`app/components/quran/surah-reader.tsx`): Main reading interface with verses
- **Search Modal** (`app/components/search-modal.tsx`): Global search across all verses

### API Integration
- Uses proxy pattern: client-side requests go through `/api/*` routes to avoid CORS
- Server-side rendering uses direct API calls
- Implements caching strategies: `no-store` for dynamic content, `force-cache` for static verses

### Data Flow
1. Homepage fetches all surahs via `alQuranAPI.getAllSurahs()`
2. Individual surah pages load via `getSurah(id)` with verses and audio
3. Search functionality queries across all verses with highlighted results
4. Progress tracking stores completion status in localStorage

### Security Features
- Comprehensive CSP headers in `next.config.ts`
- Whitelisted audio domains for recitation streaming
- Rate limiting middleware for API protection

### Styling
- CSS-in-JS approach with CSS custom properties for theming
- Dark/light theme support via `theme-toggle.tsx`
- Responsive design with mobile-first approach

## Important Notes

- Default language is Turkish (`tr`), with English (`en`) support
- Audio files served from multiple MP3 Quran servers (server6, server8, server11)
- All API calls include error handling and loading states
- Progress data persisted in localStorage for offline access