# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Quran learning web application built with React, TypeScript, and Vite. The app provides Arabic text, Turkish translations, and audio playback for all 114 Surahs of the Quran. Users can browse surahs, read verses (ayahs) with translations and transliterations, and listen to recitations.

## Common Commands

### Development
- `npm run dev` - Start development server with HMR (Vite)
- `npm run build` - Type check with TypeScript (`tsc -b`) then build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Lint codebase with ESLint

## Architecture

### API Integration
- **API Client** (`src/lib/api-client.ts`): Singleton Axios wrapper with request/response interceptors for logging and error handling. Communicates with `https://api.alquran.cloud/v1`.
- **Quran API Service** (`src/services/quran-api.ts`): Singleton service layer providing methods to fetch editions, surahs, ayahs, and search functionality. All API responses follow the format `{ code, status, data }`.

### State & Caching
- **Cache Manager** (`src/lib/cache-manager.ts`): Singleton in-memory cache with TTL support (default 30 minutes for API responses). Automatically cleans expired entries.
- **State Management**: Basic React state for theme, navigation, and surah selection in `app.tsx`. React Query (`@tanstack/react-query`) is installed but not yet integrated.
- **Zustand** is installed but not yet used.

### Error Handling
- **Error Handler** (`src/lib/error-handler.ts`): Singleton for centralized error logging and formatting. Transforms API errors into `AppError` format with code, message, and timestamp.

### Components
- **App** (`src/app.tsx`): Root component with theme toggle and view routing (home/surahs/reader).
- **SurahList** (`src/components/quran/surah-list.tsx`): Displays list of 114 surahs with metadata from static data file. Shows first 10 with "show all" button.
- **SurahReader** (`src/components/quran/surah-reader.tsx`): Currently uses mock data. Displays ayah Arabic text, Turkish translation, transliteration, and navigation controls. Audio playback UI is stubbed.

### Data
- Static surah metadata is in `src/data/surahs.ts`
- TypeScript types for Quran entities are in `src/types/quran.ts`

### Key Patterns
- All API/cache/error handler classes use singleton pattern
- Cache keys are generated with `generateKey(...parts)` to ensure consistency
- Components use inline styles with CSS variables for theming (e.g., `var(--primary-500)`)

### Integration Points
- `SurahReader` currently uses mock ayah data and needs to be integrated with `QuranApiService.getSurah()` or `getMultipleEditions()`
- Audio playback is stubbed and needs integration with audio edition endpoints
- React Query is installed but not configured with `QueryClientProvider` in `main.tsx`
