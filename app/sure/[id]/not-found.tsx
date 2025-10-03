import Link from 'next/link';
import { BookOpen, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="text-center">
        <div className="mb-6">
          <BookOpen className="icon-xl" style={{ color: 'var(--neutral-400)', margin: '0 auto' }} />
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Sure Bulunamadı</h1>
        
        <p className="text-lg mb-8" style={{ color: 'var(--neutral-600)' }}>
          Aradığınız sure mevcut değil. Lütfen ana sayfaya dönüp geçerli bir sure seçiniz.
        </p>
        
        <Link href="/" className="btn btn-primary flex items-center gap-2" style={{ margin: '0 auto' }}>
          <Home className="icon-sm" />
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}