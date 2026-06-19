import { useEffect, useRef, useState } from 'react'
import { FluidSim } from './FluidSim'

type HeroFluidProps = {
  /** sRGB hex of the currently selected ink */
  color: string
  /** dark vs light water/glass tint */
  isDark: boolean
}

export function HeroFluid({ color, isDark }: HeroFluidProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let sim: FluidSim
    try {
      sim = new FluidSim(canvas)
    } catch {
      setUnsupported(true)
      return
    }
    if (!sim.isSupported) {
      setUnsupported(true)
      sim.dispose()
      return
    }

    simRef.current = sim
    sim.setColor(colorRef.current)
    sim.setTheme(isDarkRef.current)

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

    // Seed a couple of soft blooms so the surface isn't empty on load.
    sim.setColor(colorRef.current)
    sim.addSplat(0.35, 0.55, 0.0, 0.002)
    sim.addSplat(0.62, 0.42, -0.002, 0.0)

    // ── Render loop with offscreen pause ──
    let raf = 0
    let last = performance.now()
    let visible = true

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !raf) {
          last = performance.now()
          raf = requestAnimationFrame(loop)
        }
      },
      { threshold: 0 },
    )
    io.observe(container)

    const loop = (now: number) => {
      const dt = (now - last) / 1000
      last = now
      sim.step(dt)
      sim.render()
      if (visible) {
        raf = requestAnimationFrame(loop)
      } else {
        raf = 0
      }
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointerleave', onPointerLeave)
      sim.dispose()
      simRef.current = null
    }
  }, [])

  return (
    <div ref={containerRef} className={`hero-fluid ${unsupported ? 'is-fallback' : ''}`}>
      <canvas ref={canvasRef} className="hero-fluid-canvas" aria-hidden="true" />
    </div>
  )
}
