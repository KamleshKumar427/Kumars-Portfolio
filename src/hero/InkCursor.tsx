import { useEffect, useRef } from 'react'

/**
 * A soft sumi ink-dab cursor, active only while the pointer is over the hero.
 * Follows the pointer with a whisper of lag (like a brush gliding), shrinks on
 * press, and hides the native cursor. Fine pointers only — touch/coarse devices
 * keep their normal behaviour untouched.
 */
export function InkCursor() {
  const dabRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const hero = document.getElementById('hero')
    const dab = dabRef.current
    if (!hero || !dab) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    hero.classList.add('ink-cursor-on')

    let targetX = -100
    let targetY = -100
    let x = -100
    let y = -100
    let visible = false
    let raf = 0

    const loop = () => {
      // ease toward the pointer — small factor = subtle inky glide
      x += (targetX - x) * 0.5
      y += (targetY - y) * 0.5
      dab.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!visible) {
        visible = true
        // jump the dab to the pointer on first appearance (no glide-in from corner)
        x = targetX
        y = targetY
        dab.classList.add('is-visible')
      }
    }
    const onLeave = () => {
      visible = false
      dab.classList.remove('is-visible')
    }
    const onDown = () => dab.classList.add('is-pressed')
    const onUp = () => dab.classList.remove('is-pressed')

    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerleave', onLeave)
    hero.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      hero.classList.remove('ink-cursor-on')
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      hero.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={dabRef} className="ink-cursor" aria-hidden="true" />
}
