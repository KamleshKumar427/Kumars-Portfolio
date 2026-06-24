import { useEffect, useId, useRef, useState } from 'react'
import { profile } from '../data/profile'

type CvMenuProps = {
  /** Nav link style (header) vs button style (contact). */
  variant?: 'nav' | 'button'
}

export function CvMenu({ variant = 'nav' }: CvMenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const { path, filename } = profile.cv

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const triggerClass =
    variant === 'button' ? 'btn btn--ghost cv-menu-trigger cv-menu-trigger--btn' : 'cv-menu-trigger'

  return (
    <div className={`cv-menu ${variant === 'button' ? 'cv-menu--button' : ''} ${open ? 'is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className={triggerClass}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        CV
        <span className="cv-menu-caret" aria-hidden="true" />
      </button>

      <div className="cv-menu-panel" role="menu" id={menuId} hidden={!open}>
        <a
          role="menuitem"
          className="cv-menu-item"
          href={path}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          View CV
        </a>
        <a
          role="menuitem"
          className="cv-menu-item"
          href={path}
          download={filename}
          onClick={() => setOpen(false)}
        >
          Download CV
        </a>
      </div>
    </div>
  )
}
