import { Heart, Mail, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="container">
        <div className="footer-content">
          {/* Main text */}
          <div className="footer-text footer-main">
            <span>Made with</span>
            <Heart style={{ width: '1rem', height: '1rem', color: 'var(--primary-500)' }} />
            <span>by</span>
            <a
              href="mailto:furkanbeydemirr@gmail.com"
              style={{
                color: 'var(--primary-600)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
              className="footer-link"
            >
              <Mail style={{ width: '0.875rem', height: '0.875rem' }} />
              furkanbeydemirr@gmail.com
            </a>
          </div>

          {/* Copyright */}
          <div className="footer-copyright">
            © {currentYear} Kuran-ı Kerim. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
