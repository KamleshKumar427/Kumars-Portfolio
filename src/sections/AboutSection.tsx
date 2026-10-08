import { Reveal } from '../components/ui/Reveal'
import { profile } from '../data/profile'

/**
 * The one place on the site that speaks in the first person. It says little on
 * purpose: everything below it (roles, degrees, projects) is the evidence.
 * Portrait on the left with the seal stamped on its corner; the statement hangs
 * from a large serif quote mark; the glance grid underneath leads with what
 * Kamlesh wants next (the first two rows carry the strong rule and the seal).
 */
/** Finland's flag (18:11, blue #002F6C cross) flying from a short pole, in
 *  the spirit of "made in Finland" marks. Drawn here, not the trademarked
 *  Avainlippu. Decorative: the row's text already says Finland. */
function FlagFinland() {
  return (
    <svg className="glance-flag" viewBox="0 0 22 18" width="22" height="18" aria-hidden="true" focusable="false">
      <rect className="glance-flag-pole" x="0.5" y="0" width="1.5" height="18" rx="0.75" />
      <g className="glance-flag-cloth">
        <rect x="2" y="0.5" width="18" height="11" fill="#fff" />
        <rect x="7" y="0.5" width="3" height="11" fill="#002f6c" />
        <rect x="2" y="4.5" width="18" height="3" fill="#002f6c" />
      </g>
    </svg>
  )
}

/** A ribbon in the seal colour with two round curls, pinned over the
 *  portrait's top-left corner. Decorative only. The curve is a prolate
 *  cycloid (it loops where its radius beats its stride). */
function PortraitRibbon() {
  return (
    <svg className="portrait-ribbon" viewBox="0 0 117 79" aria-hidden="true" focusable="false">
      <path d="M14.0 64.7 L15.4 64.0 L16.8 63.3 L18.1 62.5 L19.4 61.7 L20.7 60.8 L21.9 59.9 L23.0 58.9 L24.1 57.9 L25.1 56.8 L26.1 55.8 L27.0 54.6 L27.8 53.5 L28.6 52.3 L29.3 51.2 L29.9 50.0 L30.5 48.8 L31.0 47.6 L31.4 46.4 L31.7 45.3 L32.0 44.1 L32.3 42.9 L32.4 41.8 L32.5 40.7 L32.5 39.7 L32.5 38.6 L32.4 37.6 L32.3 36.7 L32.1 35.8 L31.8 35.0 L31.5 34.2 L31.2 33.4 L30.9 32.7 L30.5 32.1 L30.0 31.6 L29.6 31.1 L29.1 30.6 L28.6 30.3 L28.1 30.0 L27.6 29.8 L27.1 29.6 L26.6 29.5 L26.1 29.5 L25.7 29.6 L25.2 29.7 L24.8 29.9 L24.3 30.2 L24.0 30.5 L23.6 30.9 L23.3 31.3 L23.0 31.8 L22.8 32.3 L22.7 32.9 L22.5 33.5 L22.5 34.2 L22.5 34.9 L22.6 35.7 L22.7 36.4 L22.9 37.2 L23.1 38.1 L23.4 38.9 L23.8 39.7 L24.3 40.6 L24.8 41.4 L25.4 42.3 L26.1 43.1 L26.8 44.0 L27.6 44.8 L28.5 45.6 L29.5 46.3 L30.5 47.1 L31.5 47.8 L32.6 48.4 L33.8 49.0 L35.0 49.6 L36.3 50.1 L37.6 50.6 L39.0 51.0 L40.4 51.4 L41.8 51.7 L43.2 51.9 L44.7 52.0 L46.2 52.1 L47.8 52.2 L49.3 52.1 L50.8 52.0 L52.4 51.9 L53.9 51.6 L55.4 51.3 L56.9 50.9 L58.4 50.5 L59.9 49.9 L61.4 49.4 L62.8 48.7 L64.2 48.0 L65.5 47.3 L66.8 46.4 L68.1 45.6 L69.3 44.6 L70.5 43.7 L71.6 42.7 L72.6 41.6 L73.6 40.6 L74.5 39.5 L75.4 38.3 L76.2 37.2 L76.9 36.0 L77.5 34.8 L78.1 33.6 L78.6 32.4 L79.1 31.3 L79.5 30.1 L79.8 28.9 L80.0 27.8 L80.2 26.6 L80.3 25.5 L80.3 24.5 L80.3 23.4 L80.2 22.4 L80.1 21.5 L79.9 20.5 L79.7 19.7 L79.4 18.9 L79.1 18.1 L78.8 17.4 L78.4 16.8 L78.0 16.2 L77.5 15.7 L77.1 15.2 L76.6 14.9 L76.1 14.5 L75.6 14.3 L75.1 14.1 L74.6 14.0 L74.1 14.0 L73.6 14.0 L73.1 14.1 L72.7 14.3 L72.3 14.5 L71.9 14.8 L71.5 15.2 L71.2 15.6 L70.9 16.1 L70.7 16.6 L70.5 17.2 L70.4 17.8 L70.3 18.5 L70.3 19.2 L70.3 19.9 L70.4 20.7 L70.6 21.5 L70.8 22.3 L71.1 23.1 L71.5 23.9 L72.0 24.8 L72.5 25.6 L73.0 26.5 L73.7 27.3 L74.4 28.2 L75.2 29.0 L76.0 29.8 L77.0 30.6 L77.9 31.3 L79.0 32.0 L80.1 32.7 L81.2 33.3 L82.4 33.9 L83.7 34.4 L85.0 34.9 L86.3 35.4 L87.7 35.7 L89.2 36.0 L90.6 36.3 L92.1 36.5 L93.6 36.6 L95.1 36.6 L96.6 36.6 L98.2 36.5 L99.7 36.4 L101.2 36.2 L102.8 35.9" fill="none" stroke="var(--seal)" strokeWidth="7" strokeLinejoin="round" />
      <path d="M11.4 59.8 L5.2 63.1 L11.8 65.8 L10.4 72.8 L16.6 69.6 Z" fill="var(--seal)" />
      <path d="M103.6 41.3 L110.5 40.3 L105.2 35.5 L108.9 29.4 L102.0 30.4 Z" fill="var(--seal)" />
    </svg>
  )
}

export function AboutSection() {
  const { about, aboutNote, greeting, glance, portrait } = profile

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="section-inner about-layout">
        <Reveal className="about-portrait">
          <figure className="portrait">
            <div className="portrait-frame">
              {/* The figure moves as one on hover: the photo plus a tint that
                  darkens (light theme) or lightens (dark theme) its lower edge,
                  masked to the photo's own outline so the page stays clean. */}
              <div className="portrait-figure">
                <picture>
                  <source srcSet={portrait.avif} type="image/avif" />
                  <img
                    className="portrait-img"
                    src={portrait.src}
                    alt={portrait.alt}
                    width={portrait.width}
                    height={portrait.height}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <span
                  className="portrait-tint"
                  aria-hidden="true"
                  style={{ WebkitMaskImage: `url(${portrait.avif})`, maskImage: `url(${portrait.avif})` }}
                />
              </div>
              <PortraitRibbon />
              <span className="portrait-seal" aria-hidden="true">
                印
              </span>
            </div>
            <figcaption className="portrait-caption">{greeting}</figcaption>
          </figure>
        </Reveal>

        <div className="about-text">
          <Reveal>
            <h2 id="about-title" className="section-kicker about-kicker">
              私 — About
            </h2>
            <div className="about-statement">
              <span className="about-mark about-mark--open" aria-hidden="true">
                “
              </span>
              <p className="about-quote">
                {about}
                <span className="about-mark about-mark--close" aria-hidden="true">
                  ”
                </span>
              </p>
              <p className="about-quote-note">{aboutNote}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="glance">
              {glance.map((row, i) => (
                <div className={`glance-item${i < 2 ? ' glance-item--lead' : ''}`} key={row.label}>
                  <dt className="glance-label">{row.label}</dt>
                  <dd className="glance-value">
                    {'led' in row && row.led ? <span className="status-led" aria-hidden="true" /> : null}
                    {'flag' in row && row.flag === 'fi' ? <FlagFinland /> : null}
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <a className="about-scroll" href="#experience">
          Scroll for details <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  )
}
