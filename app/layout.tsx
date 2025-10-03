import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import './globals.css';
import { ThemeToggle } from './components/theme-toggle';
import { LanguageSwitcher } from './components/language-switcher';
import { LanguageProvider } from './contexts/language-context';
import { ProgressProvider } from './contexts/progress-context';
import { SearchProvider } from './contexts/search-context';
import { Footer } from './components/footer';
import { HeaderSearch } from './components/header-search';
import { GlobalSearch } from './components/global-search';

export const metadata: Metadata = {
  title: 'Kuran Dersleri - Online Kuran Öğrenme Platformu',
  description: '114 sure ve binlerce ayeti Türkçe mealleri ile birlikte okuyun, dinleyin ve online kuran dersleri alın. İlerlemenizi takip edin.',
  keywords: 'kuran dersleri, online kuran, kuran öğrenme, meal, türkçe meal, arapça, sure, ayet, islam, din, eğitim',
  authors: [{ name: 'Kuran Dersleri' }],
  metadataBase: new URL('https://kurandersleri.com'),
  openGraph: {
    type: 'website',
    title: 'Kuran Dersleri - Online Kuran Öğrenme Platformu',
    description: '114 sure ve binlerce ayeti Türkçe mealleri ile birlikte okuyun, dinleyin ve online kuran dersleri alın.',
    url: 'https://kurandersleri.com',
    siteName: 'Kuran Dersleri',
    images: [
      {
        url: '/kurandersleri.png',
        width: 1200,
        height: 630,
        alt: 'Kuran Dersleri - Online Kuran Öğrenme Platformu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuran Dersleri - Online Kuran Öğrenme Platformu',
    description: '114 sure ve binlerce ayeti Türkçe mealleri ile birlikte okuyun, dinleyin ve online kuran dersleri alın.',
    images: ['/kurandersleri.png'],
  },
  icons: {
    icon: '/kurandersleri.png',
    shortcut: '/kurandersleri.png',
    apple: '/kurandersleri.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured Data for the Website
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Kuran Dersleri',
    description: 'Online Kuran öğrenme platformu - 114 sure ve binlerce ayeti mealleri ile birlikte okuyun, dinleyin ve kuran dersleri alın.',
    url: 'https://kurandersleri.com',
    inLanguage: ['tr', 'en', 'ar'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kurandersleri.com/sure/{slug}',
      'query-input': 'required name=slug',
    },
  };

  return (
    <html lang="tr">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <LanguageProvider>
          <ProgressProvider>
            <SearchProvider>
              <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
            {/* Header */}
            <header className="header">
              <div className="container header-content">
                <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
                  <div className="logo-icon">
                    <Image
                      src="/kurandersleri.png"
                      alt="Kuran Dersleri Logo"
                      width={40}
                      height={40}
                      style={{ borderRadius: '8px' }}
                    />
                  </div>
                  <div className="logo-text">
                    <h1>Kuran Dersleri</h1>
                    <p>Online Kuran öğrenme platformu</p>
                  </div>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <HeaderSearch />
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {children}

            <Footer />
              </div>

              {/* Global Search Modal */}
              <GlobalSearch />
            </SearchProvider>
          </ProgressProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
