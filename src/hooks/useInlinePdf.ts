import { useEffect, useState } from 'react'

const COARSE = '(pointer: coarse)'

function supported() {
  if (typeof window === 'undefined') return true
  // Desktop browsers with PDF viewing turned off say so outright.
  const nav = navigator as Navigator & { pdfViewerEnabled?: boolean }
  if (nav.pdfViewerEnabled === false) return false
  // Every phone and tablet reports a coarse pointer, and none of them will
  // paint a PDF inside an iframe.
  return !window.matchMedia(COARSE).matches
}

/**
 * Whether this browser will render a PDF inside an `<iframe>`.
 *
 * Mobile browsers won't: iOS Safari and Chrome on Android replace the frame
 * with a grey panel and an "open" button, so an embedded certificate looks
 * broken on a phone while it renders fine on a laptop. Where this is false,
 * show a poster image of the page instead.
 */
export function useInlinePdf(): boolean {
  const [ok, setOk] = useState(supported)

  useEffect(() => {
    const media = window.matchMedia(COARSE)
    const update = () => setOk(supported())
    media.addEventListener('change', update)
    update()
    return () => media.removeEventListener('change', update)
  }, [])

  return ok
}
