# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Quran learning web application built with Next.js, TypeScript, and React. The app provides Arabic text, Turkish translations, and audio playback for all 114 Surahs of the Quran. Users can browse surahs, read verses (ayahs) with translations, and listen to recitations. The application integrates with the Diyanet (Turkish Religious Affairs) API for authentic Quran data.

## Common Commands

### Development
- `npm run dev` - Start Next.js development server on port 3334
- `npm run build` - Build production application with Next.js
- `npm run start` - Start production server
- `npm run lint` - Lint codebase with ESLint

## Architecture

### Framework & Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: CSS variables with dark/light theme support
- **State Management**: Basic React state (Zustand installed but not yet used)
- **Data Fetching**: React Query installed but not yet integrated
- **API Integration**: Custom Axios wrapper with Diyanet API

### API Integration
- **API Client** (`app/lib/diyanet-api-client.ts`): Singleton Axios wrapper with request/response interceptors for logging and error handling. Routes through Next.js API routes (`/api/*`) instead of direct external API calls.
- **Diyanet API Service** (`app/services/diyanet-api.ts`): Singleton service layer providing methods to fetch chapters, verses by chapter/page/juz. Uses Diyanet API format with Turkish translations.
- **API Routes** (`app/api/*`): Next.js API routes that proxy requests to Diyanet API (`https://t061.diyanet.gov.tr`) with authentication, rate limiting, and caching.

### State & Caching
- **Cache Manager** (`app/lib/cache-manager.ts`): Singleton in-memory cache with TTL support (default 5 minutes, 60 minutes for Quran data). Automatically cleans expired entries.
- **State Management**: Basic React state in `app/page.tsx` for theme, navigation, and surah selection.
- **Rate Limiting** (`app/lib/rate-limiter.ts`): Token bucket implementation for API rate limiting.

### Error Handling
- **Error Handler** (`app/lib/error-handler.ts`): Singleton for centralized error logging and formatting. Transforms API errors into `AppError` format with code, message, and timestamp.

### Security & Configuration
- **CSP**: Content Security Policy configured in `next.config.ts` allowing connections to Diyanet API
- **Headers**: Security headers including HSTS, X-Frame-Options, etc.
- **Environment Variables**: `DIYANET_API_BASE_URL` and `DIYANET_API_KEY` for API configuration

### Pages & Routing
- **Home Page** (`app/page.tsx`): Server-side rendered homepage displaying all surahs with proper SEO metadata
- **Sure Page** (`app/sure/[slug]/page.tsx`): Server-side rendered individual surah pages with continuous verse display using Turkish name slugs
- **Theme Toggle** (`app/components/theme-toggle.tsx`): Client component for dark/light theme switching with localStorage persistence
- **Static Generation**: All 114 surah pages are statically generated at build time using Turkish name slugs
- **Slug Utils** (`app/lib/slug-utils.ts`): Utilities for converting Turkish surah names to URL-friendly slugs

### Components
- **Legacy Components**: Old client-side components (`app/components/quran/`) are kept but superseded by new server-side pages
- **ThemeToggle**: Client component handling theme persistence and system preference detection
- **Server Components**: Pages directly fetch data server-side for better SEO and performance

### Data Types
- **Updated Types** (`app/types/quran.ts`): DiyanetVerse type updated to match actual API response format:
  - `page_number`, `surah_id`, `verse_id_in_surah`
  - `translation: { text: string }`
  - `arabic_script: { text_font_id: number, text: string }`
- **Legacy Types**: Kept for backwards compatibility but not actively used

### Key Patterns
- **Server-Side First**: All pages use server components with direct API calls
- **Static Generation**: Surah pages are pre-generated for all 114 surahs
- **SEO Optimization**: Proper metadata, structured URLs (`/surah/[id]`), and server-side rendering
- **Continuous Display**: Verses shown continuously without pagination for better reading experience
- **Duplicate Handling**: API sometimes returns duplicate verses; pages filter by `verse_id_in_surah`

### URL Structure
- `/` - Homepage with all surahs
- `/sure/[turkish-name-slug]` - Individual surah pages with all verses (e.g., `/sure/fatiha`, `/sure/bakara`)
- Turkish name slugs are generated from `SureNameTurkish` with proper character conversion (ğ→g, ü→u, etc.)
- Proper SEO-friendly URLs with metadata for each surah

### Integration Points
- Server-side data fetching with proper caching (1 hour revalidation)
- Environment variables for API configuration (`DIYANET_API_BASE_URL`, `DIYANET_API_KEY`)
- Theme persistence with localStorage and system preference detection

## important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.