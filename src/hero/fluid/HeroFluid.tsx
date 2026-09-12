import { useEffect, useRef, useState } from 'react'
import type { FluidSim } from './FluidSim'
import { getSharedFluid } from './sharedFluid'

type HeroFluidProps = {
  /** sRGB hex of the currently selected ink */
  color: string
  /** dark vs light water/glass tint */
  isDark: boolean
}

/**
 * Mounts the visit-wide fluid (see sharedFluid) into this hero. The simulation
 * and its canvas outlive the component: leaving a page detaches them, the next
 * hero re-attaches them, so painted ink carries across routes.
 */
export function HeroFluid({ color, isDark }: HeroFluidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const simRef = useRef<FluidSim | null>(null)
  const colorRef = useRef(color)
  const isDarkRef = useRef(isDark)
  const [unsupported, setUnsupported] = useState(false)

  // Keep latest prop values available to the imperative loop.
  useEffect(() => {
    colorRef.current = color
    simRef.current?.setColor(color)
  }, [color])

  useEffect(() => {
    isDarkRef.current = isDark
    simRef.current?.setTheme(isDark)
  }, [isDark])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const shared = getSharedFluid()
    const { sim, canvas } = shared
    if (!sim) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL capability probe
      setUnsupported(true)
      return
    }

    simRef.current = sim
    sim.setColor(colorRef.current)
    sim.setTheme(isDarkRef.current)
    container.appendChild(canvas)

    const sizeToContainer = () => {
      const rect = container.getBoundingClientRect()
      sim.resize(rect.width, rect.height)
    }
    sizeToContainer()

    const ro = new ResizeObserver(sizeToContainer)
    ro.observe(container)

    // ── Pointer → ink dropper ──
    const pointer = { x: 0, y: 0, has: false }

    const toUv = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: (clientX - rect.left) / rect.width,
        y: 1 - (clientY - rect.top) / rect.height,
      }
    }

    const move = (clientX: number, clientY: number) => {
      const p = toUv(clientX, clientY)
      if (!pointer.has) {
        pointer.x = p.x
        pointer.y = p.y
        pointer.has = true
        return
      }
      const dx = p.x - pointer.x
      const dy = p.y - pointer.y
      pointer.x = p.x
      pointer.y = p.y
      if (Math.abs(dx) > 1e-5 || Math.abs(dy) > 1e-5) {
        sim.addSplat(p.x, p.y, dx, dy)
      }
    }

    const onPointerMove = (e: PointerEvent) => move(e.clientX, e.clientY)
    const onPointerDown = (e: PointerEvent) => {
      const p = toUv(e.clientX, e.clientY)
      pointer.x = p.x
      pointer.y = p.y
      pointer.has = true
      // A gentle press releases a bloom even without movement.
      sim.addSplat(p.x, p.y, 0, 0.0015)
    }
    const onPointerLeave = () => {
      pointer.has = false
    }

    container.addEventListener('pointermove', onPointerMove)
    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointerleave', onPointerLeave)

    // Seed a couple of soft blooms so the surface isn't empty — once per visit,
    // not every time you move between pages.
    if (!shared.seeded) {
      shared.seeded = true
      sim.addSplat(0.35, 0.55, 0.0, 0.002)
      sim.addSplat(0.62, 0.42, -0.002, 0.0)
    }

    // ── Render loop on the wall clock ──
    // The loop pauses while the hero is off-screen. The time it missed is
    // applied as a single fade when it resumes (the clock is shared across
    // pages), so ink fades with real time and never freezes.
    let raf = 0
    let visible = true

    const loop = (now: number) => {
      const elapsed = shared.clock === null ? 0 : Math.max(0, (now - shared.clock) / 1000)
      shared.clock = now
      const dt = Math.min(elapsed, 1 / 60)
      if (elapsed - dt > 0.1) sim.fade(elapsed - dt)
      sim.step(dt)
      sim.render()
      raf = visible ? requestAnimationFrame(loop) : 0
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !raf) raf = requestAnimationFrame(loop)
      },
      { threshold: 0 },
    )
    io.observe(container)
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointerleave', onPointerLeave)
      // Leave the canvas where it is: the next hero's appendChild moves it over.
      // Detaching here would leave a frame with no canvas on screen, which reads
      // as a blink during a route change. Never disposed — the fluid outlives us.
      simRef.current = null
    }
  }, [])

  return <div ref={containerRef} className={`hero-fluid ${unsupported ? 'is-fallback' : ''}`} />
}
