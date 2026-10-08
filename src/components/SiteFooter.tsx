/** The page's foot: the sign-off above the rule, the copyright centred below
 *  it. Contact links live in the Contact section, so they aren't repeated. */
export function SiteFooter() {
  return (
    <footer className="footer">
      <p className="footer-credit">
        Designed and built with <span aria-label="love">❤️</span> by Kamlesh
      </p>
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} 墨と水</span>
      </div>
    </footer>
  )
}

