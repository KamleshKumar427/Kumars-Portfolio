import { cn } from '@/lib/cn'

type ImageSlotProps = {
  /** Asset URL under public/ (images, PDFs, etc.) */
  src?: string
  alt?: string
  /** Placeholder hint when src is missing */
  label: string
  fit?: 'cover' | 'contain'
  className?: string
  /** When set, the media becomes a button that opens a full-view lightbox. */
  onExpand?: (media: { src: string; alt: string }) => void
}

function isPdfSrc(src: string) {
  return /\.pdf(\?|#|$)/i.test(src)
}

/** PDF viewer params: hide chrome and fit page width inside the frame. */
function pdfEmbedSrc(src: string) {
  const base = src.split('#')[0]
  return `${base}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`
}

/** Hover/focus affordance shown on expandable media. */
function ZoomCue() {
  return (
    <span className="img-slot-cue" aria-hidden="true">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

/** Image or inline PDF with a styled placeholder until src is provided. */
export function ImageSlot({ src, alt, label, fit = 'cover', className, onExpand }: ImageSlotProps) {
  const resolvedAlt = alt ?? label

  if (src && isPdfSrc(src)) {
    const frame = (
      <iframe
        className="img-slot-pdf"
        src={pdfEmbedSrc(src)}
        title={resolvedAlt}
        loading="lazy"
        tabIndex={-1}
      />
    )
    if (onExpand) {
      return (
        <button
          type="button"
          className={cn('img-slot img-slot--pdf img-slot--zoom', className)}
          aria-label={`View ${resolvedAlt} full screen`}
          onClick={() => onExpand({ src, alt: resolvedAlt })}
        >
          {frame}
          <ZoomCue />
        </button>
      )
    }
    return (
      <div className={cn('img-slot img-slot--pdf', className)} aria-label={resolvedAlt}>
        {frame}
      </div>
    )
  }

  if (src) {
    if (onExpand) {
      return (
        <button
          type="button"
          className={cn('img-slot img-slot--zoom', className)}
          aria-label={`View ${resolvedAlt} full screen`}
          onClick={() => onExpand({ src, alt: resolvedAlt })}
        >
          <img className="img-slot-inner" src={src} alt={resolvedAlt} loading="lazy" style={{ objectFit: fit }} />
          <ZoomCue />
        </button>
      )
    }
    return (
      <img
        className={cn('img-slot', className)}
        src={src}
        alt={resolvedAlt}
        loading="lazy"
        style={{ objectFit: fit }}
      />
    )
  }

  return (
    <div className={cn('img-slot img-slot--empty', className)} role="img" aria-label={`${label} — coming soon`}>
      <span className="img-slot-hint">{label}</span>
    </div>
  )
}
