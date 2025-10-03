export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-container">
      <div className="container">
        <div className="footer-content">
          {/* Copyright */}
          <div className="footer-copyright">
            © {currentYear} Kuran Dersleri. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
}
