import { useVisitCount } from '../hooks/useVisitCount'

/** The page's foot: the sign-off above the rule, the copyright centred below
 *  it, and the visit count beside it once it arrives. Contact links live in
 *  the Contact section, so they aren't repeated. */
export function SiteFooter() {
  const visits = useVisitCount()

  return (
    <footer className="footer">
      <p className="footer-credit">
        Designed and built with <span aria-label="love">❤️</span> by Kamlesh
      </p>
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} 墨と水</span>
        {visits === null ? null : (
          <span className="footer-visits">{visits.toLocaleString('en-GB')} visits</span>
        )}
      </div>
    </footer>
  )
}
