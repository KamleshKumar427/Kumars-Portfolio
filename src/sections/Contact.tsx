import { profile } from '../data/profile'

export function Contact() {
  return (
    <section id="contact" className="contact-record">
      <div className="contact-record-inner">
        <header className="record-header">
          <p className="record-log">
            <span className="record-log-bracket">[</span>
            CONTACT
            <span className="record-log-bracket">]</span>
          </p>
          <h2 className="record-title">Reach me directly</h2>
          <p className="record-subtitle">
            Based in Helsinki. Comfortable with remote collaboration across European and Asian time
            zones.
          </p>
        </header>

        <div className="contact-channels">
          <a href={`mailto:${profile.email}`} className="contact-channel">
            <span className="contact-channel-key">email</span>
            <span className="contact-channel-val">{profile.email}</span>
          </a>
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="contact-channel">
            <span className="contact-channel-key">phone</span>
            <span className="contact-channel-val">{profile.phone}</span>
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="contact-channel"
          >
            <span className="contact-channel-key">linkedin</span>
            <span className="contact-channel-val">/in/kamlesh-kumar</span>
          </a>
        </div>
      </div>

      <footer className="site-footer">
        <span>{profile.name}</span>
        <span>{profile.location}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </section>
  )
}
