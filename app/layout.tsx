import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import './globals.css';
import { ThemeToggle } from './components/theme-toggle';
import { LanguageSwitcher } from './components/language-switcher';
import { LanguageProvider } from './contexts/language-context';
import { Footer } from './components/footer';

export const metadata: Metadata = {
  title: 'Kuran-ı Kerim - Adım Adım Öğrenme Platformu',
  description: '114 sure ve binlerce ayeti Türkçe mealleri ile birlikte okuyun, dinleyin ve adım adım öğrenin. İlerlemenizi takip edin.',
  keywords: 'kuran, kuran-ı kerim, meal, türkçe meal, arapça, sure, ayet, islam, din, öğrenme',
  authors: [{ name: 'Kuran-ı Kerim Platformu' }],
  openGraph: {
    type: 'website',
    title: 'Kuran-ı Kerim - Adım Adım Öğrenme Platformu',
    description: '114 sure ve binlerce ayeti Türkçe mealleri ile birlikte okuyun, dinleyin ve adım adım öğrenin.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kuran-ı Kerim - Adım Adım Öğrenme Platformu',
    description: '114 sure ve binlerce ayeti Türkçe mealleri ile birlikte okuyun, dinleyin ve adım adım öğrenin.',
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
    name: 'Kuran-ı Kerim',
    description: 'Adım adım öğrenme platformu - 114 sure ve binlerce ayeti mealleri ile birlikte okuyun, dinleyin.',
    url: 'https://kurani-kerim.com',
    inLanguage: ['tr', 'en', 'ar'],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kurani-kerim.com/sure/{slug}',
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
          <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
            {/* Header */}
            <header className="header">
              <div className="container header-content">
                <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
                  <div className="logo-icon">
                    <BookOpen className="icon-md" />
                  </div>
                  <div className="logo-text">
                    <h1>Kuran-ı Kerim</h1>
                    <p>Adım adım öğrenme platformu</p>
                  </div>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <LanguageSwitcher />
                  <ThemeToggle />
                </div>
              </div>
            </header>

            {children}

            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
