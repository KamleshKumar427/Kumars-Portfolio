import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export type LightboxMedia = {
  src: string
  alt: string
  caption?: string
}

function isPdf(src: string) {
  return /\.pdf(\?|#|$)/i.test(src)
}

/**
 * Full-view media overlay with a premium frosted-glass backdrop: the page
 * behind stays visible but blurred. Closes on ✕, Escape, or backdrop click.
 * Locks background scroll (native + Lenis) while open.
 */
export function Lightbox({ media, onClose }: { media: LightboxMedia | null; onClose: () => void }) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!media) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      window.__lenis?.start()
    }
  }, [media, onClose])

  if (!media) return null

  return createPortal(
    <div
      className={`lightbox ${reduced ? 'is-reduced' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={media.alt}
      onClick={onClose}
    >
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        {isPdf(media.src) ? (
          <iframe
            className="lightbox-pdf"
            src={`${media.src.split('#')[0]}#toolbar=0&navpanes=0&view=FitH`}
            title={media.alt}
          />
        ) : (
          <img className="lightbox-img" src={media.src} alt={media.alt} />
        )}
        {media.caption ? <figcaption className="lightbox-caption">{media.caption}</figcaption> : null}
      </figure>
    </div>,
    document.body,
  )
}
