import { Heart, Mail, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      marginTop: '4rem',
      padding: '2rem 0',
      backgroundColor: 'var(--card-bg)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          textAlign: 'center'
        }}>
          {/* Main text */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--neutral-600)'
          }} className="footer-text">
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
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--neutral-500)'
          }} className="footer-copyright">
            © {currentYear} Kuran-ı Kerim. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
