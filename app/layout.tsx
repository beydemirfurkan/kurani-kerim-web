import type { Metadata } from 'next';
import './globals.css';

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
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
