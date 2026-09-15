import * as THREE from 'three'
import { inkConfig } from './inkConfig'
import {
  advectionFragment,
  baseVertex,
  clearFragment,
  curlFragment,
  displayFragment,
  divergenceFragment,
  gradientSubtractFragment,
  pressureFragment,
  splatFragment,
  vorticityFragment,
} from './shaders'

type DoubleFBO = {
  read: THREE.WebGLRenderTarget
  write: THREE.WebGLRenderTarget
  swap: () => void
}

type PerfTier = 'high' | 'low'

/** Clear-colour wash. The display saturates dense ink, so a slow decay spends
 *  most of its time on colour you can't see change and then drops at the end —
 *  it read as a delayed cut. A fast rate keeps that hold to ~170ms for a heavy
 *  scribble (instant for light strokes), and by the final zero the ink is well
 *  under visibility, so it lands on clear water without a pop. */
const WASH_SECONDS = 0.45
const WASH_RATE = 16

type Splat = {
  x: number
  y: number
  dx: number
  dy: number
  color: THREE.Color
}

function detectTier(): PerfTier {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const cores = navigator.hardwareConcurrency ?? 4
  if (isMobile || cores <= 4) return 'low'
  return 'high'
}

export class FluidSim {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private quad: THREE.Mesh
  private supported = true

  private tier: PerfTier
  private simRes: number
  private dyeRes: number
  private pressureIterations: number

  private velocity!: DoubleFBO
  private dye!: DoubleFBO
  private divergence!: THREE.WebGLRenderTarget
  private curl!: THREE.WebGLRenderTarget
  private pressure!: DoubleFBO

  private materials: Record<string, THREE.ShaderMaterial> = {}
  private splatQueue: Splat[] = []
  /** Wall-clock end of a running wash in ms, or 0 when none (see clear). */
  private washUntil = 0
  private washLast = 0
  private activeColor = new THREE.Color(inkConfig.swatches[0].hex)
  private waterColor = new THREE.Color(inkConfig.tints.dark.water)
  private glassColor = new THREE.Color(inkConfig.tints.dark.glass)

  private width = 1
  private height = 1
  /** Aspect the current grid was built for, rounded — see resize(). */
  private aspectBucket = 0
  private reducedMotion = false
  private light = new THREE.Vector2(0.7, 0.7)
  private lightT = 0

  constructor(canvas: HTMLCanvasElement) {
    this.tier = detectTier()
    this.simRes = this.tier === 'high' ? inkConfig.simResolution : 96
    this.dyeRes = this.tier === 'high' ? inkConfig.dyeResolution : 512
    this.pressureIterations =
      this.tier === 'high' ? inkConfig.pressureIterations : 16

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
    })
    this.renderer.autoClear = false
    this.renderer.setPixelRatio(1) // sim is internal-res; display quad is cheap

    // Floating-point render targets are required for the solver.
    const gl = this.renderer.getContext()
    this.supported =
      !!gl.getExtension('EXT_color_buffer_float') ||
      !!gl.getExtension('EXT_color_buffer_half_float')

    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
    this.scene.add(this.quad)

    this.reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    this.buildMaterials()
  }

  get isSupported() {
    return this.supported
  }

  private makeRT(w: number, h: number) {
    return new THREE.WebGLRenderTarget(w, h, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false,
      stencilBuffer: false,
    })
  }

  private makeDoubleFBO(w: number, h: number): DoubleFBO {
    const fbo: DoubleFBO = {
      read: this.makeRT(w, h),
      write: this.makeRT(w, h),
      swap() {
        const tmp = this.read
        this.read = this.write
        this.write = tmp
      },
    }
    return fbo
  }

  private buildMaterials() {
    const mat = (fragmentShader: string, uniforms: Record<string, THREE.IUniform>) =>
      new THREE.ShaderMaterial({
        vertexShader: baseVertex,
        fragmentShader,
        uniforms: { texelSize: { value: new THREE.Vector2() }, ...uniforms },
        depthTest: false,
        depthWrite: false,
      })

    this.materials.splat = mat(splatFragment, {
      uTarget: { value: null },
      aspectRatio: { value: 1 },
      color: { value: new THREE.Vector3() },
      density: { value: 0 },
      point: { value: new THREE.Vector2() },
      radius: { value: 1 },
    })
    this.materials.advection = mat(advectionFragment, {
      uVelocity: { value: null },
      uSource: { value: null },
      dt: { value: 0 },
      dissipation: { value: 0 },
    })
    this.materials.divergence = mat(divergenceFragment, {
      uVelocity: { value: null },
    })
    this.materials.curl = mat(curlFragment, { uVelocity: { value: null } })
    this.materials.vorticity = mat(vorticityFragment, {
      uVelocity: { value: null },
      uCurl: { value: null },
      curl: { value: inkConfig.curl },
      dt: { value: 0 },
    })
    this.materials.pressure = mat(pressureFragment, {
      uPressure: { value: null },
      uDivergence: { value: null },
    })
    this.materials.gradientSubtract = mat(gradientSubtractFragment, {
      uPressure: { value: null },
      uVelocity: { value: null },
    })
    this.materials.clear = mat(clearFragment, {
      uTexture: { value: null },
      value: { value: inkConfig.pressure },
    })
    this.materials.display = mat(displayFragment, {
      uDye: { value: null },
      waterColor: { value: new THREE.Vector3() },
      glassColor: { value: new THREE.Vector3() },
      reflectivity: { value: inkConfig.glass.reflectivity },
      fresnelPower: { value: inkConfig.glass.fresnelPower },
      sheen: { value: inkConfig.glass.sheen },
      refraction: { value: inkConfig.glass.refraction },
      light: { value: this.light },
    })
  }

  resize(width: number, height: number) {
    // A container that is detached, or not laid out yet, measures 0x0 — which
    // happens intermittently around a route change. Acting on it would build a
    // square grid and resample the ink into it, then immediately rebuild for
    // the real size: two full reallocations, and the visible lurch when moving
    // between pages. A hero is never legitimately this small.
    if (width < 2 || height < 2) return

    const w = Math.max(1, width)
    const h = Math.max(1, height)
    const sizeChanged = w !== this.width || h !== this.height
    this.width = w
    this.height = h
    if (sizeChanged) this.renderer.setSize(w, h, false)

    if (!this.supported) return

    // The grid is sized from a *rounded* aspect, and only rebuilt when that
    // rounded value changes. Moving between two heroes of slightly different
    // height (a route change) therefore costs nothing — rebuilding would
    // reallocate every render target and resample the ink mid-transition,
    // which is what made the switch stutter. Rotating a phone still rebuilds.
    // Safe because the splat pass already corrects for canvas aspect, so the
    // grid's aspect only affects resolution, never the shape of the ink.
    const aspect = Math.round((w / h) * 4) / 4
    if (this.dye && aspect === this.aspectBucket) return
    this.aspectBucket = aspect

    const simW = aspect >= 1 ? Math.round(this.simRes * aspect) : this.simRes
    const simH = aspect >= 1 ? this.simRes : Math.round(this.simRes / aspect)
    const dyeW = aspect >= 1 ? Math.round(this.dyeRes * aspect) : this.dyeRes
    const dyeH = aspect >= 1 ? this.dyeRes : Math.round(this.dyeRes / aspect)

    const prev = {
      velocity: this.velocity,
      dye: this.dye,
      pressure: this.pressure,
      divergence: this.divergence,
      curl: this.curl,
    }
    this.velocity = this.makeDoubleFBO(simW, simH)
    this.dye = this.makeDoubleFBO(dyeW, dyeH)
    this.divergence = this.makeRT(simW, simH)
    this.curl = this.makeRT(simW, simH)
    this.pressure = this.makeDoubleFBO(simW, simH)

    // Render targets start with undefined contents — zero them so the dye
    // field begins as clear water rather than GPU garbage.
    for (const fbo of [this.velocity, this.dye, this.pressure]) {
      this.clearTarget(fbo.read)
      this.clearTarget(fbo.write)
    }
    this.clearTarget(this.divergence)
    this.clearTarget(this.curl)

    // Carry the painted ink onto the new grid — a window resize, or the canvas
    // moving to the other page's hero, must not wipe it. (Velocity restarts
    // still; the ink simply stops drifting for a moment.)
    if (prev.dye) this.copyInto(prev.dye.read, this.dye.read)
    this.disposeSet(prev)
  }

  private clearTarget(target: THREE.WebGLRenderTarget) {
    this.renderer.setRenderTarget(target)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.clear(true, false, false)
    this.renderer.setRenderTarget(null)
  }

  setColor(hex: string) {
    // Keep the swatch's own sRGB components. The display pass writes straight
    // to the canvas with no colour-space conversion, so THREE.Color's default
    // (convert to linear) would shift every ink away from the swatch it came
    // from. Reading the hex "as linear" leaves the components untouched.
    this.activeColor.setStyle(hex, THREE.LinearSRGBColorSpace)
  }

  setTheme(isDark: boolean) {
    const tint = isDark ? inkConfig.tints.dark : inkConfig.tints.light
    this.waterColor.set(tint.water)
    this.glassColor.set(tint.glass)

    // Light mode is matte — the glossy specular and Fresnel of the dark theme's
    // glass sheet would fight a paper surface.
    const surface = isDark ? inkConfig.glass : inkConfig.glassLight
    const display = this.materials.display
    display.uniforms.reflectivity.value = surface.reflectivity
    display.uniforms.fresnelPower.value = surface.fresnelPower
    display.uniforms.sheen.value = surface.sheen
    display.uniforms.refraction.value = surface.refraction
  }

  /** Queue an ink drop. dx/dy are pointer deltas in normalized [0,1] space. */
  addSplat(x: number, y: number, dx: number, dy: number) {
    this.splatQueue.push({ x, y, dx, dy, color: this.activeColor.clone() })
  }

  private renderPass(material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget | null) {
    this.quad.material = material
    this.renderer.setRenderTarget(target)
    this.renderer.render(this.scene, this.camera)
  }

  private setTexel(material: THREE.ShaderMaterial, target: THREE.WebGLRenderTarget) {
    ;(material.uniforms.texelSize.value as THREE.Vector2).set(
      1 / target.width,
      1 / target.height,
    )
  }

  private applySplats() {
    if (this.splatQueue.length === 0) return
    const aspect = this.width / this.height
    // Smaller, gentler drops on phone-sized heroes — see inkConfig.compact.
    const compact = this.width <= inkConfig.compact.maxWidth
    const radius = (inkConfig.splatRadius / 100) * (compact ? inkConfig.compact.radiusScale : 1)
    const force = inkConfig.splatForce * (compact ? inkConfig.compact.forceScale : 1)

    for (const s of this.splatQueue) {
      // Velocity splat
      const vMat = this.materials.splat
      this.setTexel(vMat, this.velocity.write)
      vMat.uniforms.uTarget.value = this.velocity.read.texture
      vMat.uniforms.aspectRatio.value = aspect
      vMat.uniforms.point.value.set(s.x, s.y)
      ;(vMat.uniforms.color.value as THREE.Vector3).set(
        s.dx * force,
        s.dy * force,
        0,
      )
      vMat.uniforms.radius.value = radius
      vMat.uniforms.density.value = 0
      this.renderPass(vMat, this.velocity.write)
      this.velocity.swap()

      // Dye splat (selected ink color)
      const dMat = this.materials.splat
      this.setTexel(dMat, this.dye.write)
      dMat.uniforms.uTarget.value = this.dye.read.texture
      dMat.uniforms.aspectRatio.value = aspect
      dMat.uniforms.point.value.set(s.x, s.y)
      ;(dMat.uniforms.color.value as THREE.Vector3).set(
        s.color.r,
        s.color.g,
        s.color.b,
      )
      dMat.uniforms.radius.value = radius
      dMat.uniforms.density.value = 1 // .a accumulates ink amount (see displayFragment)
      this.renderPass(dMat, this.dye.write)
      this.dye.swap()
    }
    this.splatQueue.length = 0
  }

  step(dt: number) {
    // No grids until the first real resize — a container measuring 0x0 at mount
    // is skipped (see resize). Stepping then would throw on the missing buffers,
    // and since the throw lands before the loop re-requests its next frame, the
    // hero would stay frozen even after it gets a proper size.
    if (!this.supported || !this.dye) return
    if (this.washUntil) this.wash()
    const clamped = Math.min(dt, 0.016666)

    // Curl
    const curlMat = this.materials.curl
    this.setTexel(curlMat, this.velocity.read)
    curlMat.uniforms.uVelocity.value = this.velocity.read.texture
    this.renderPass(curlMat, this.curl)

    // Vorticity confinement
    const vortMat = this.materials.vorticity
    this.setTexel(vortMat, this.velocity.read)
    vortMat.uniforms.uVelocity.value = this.velocity.read.texture
    vortMat.uniforms.uCurl.value = this.curl.texture
    vortMat.uniforms.curl.value = this.reducedMotion ? 0 : inkConfig.curl
    vortMat.uniforms.dt.value = clamped
    this.renderPass(vortMat, this.velocity.write)
    this.velocity.swap()

    // Divergence
    const divMat = this.materials.divergence
    this.setTexel(divMat, this.velocity.read)
    divMat.uniforms.uVelocity.value = this.velocity.read.texture
    this.renderPass(divMat, this.divergence)

    // Relax pressure
    const clearMat = this.materials.clear
    this.setTexel(clearMat, this.pressure.read)
    clearMat.uniforms.uTexture.value = this.pressure.read.texture
    clearMat.uniforms.value.value = inkConfig.pressure
    this.renderPass(clearMat, this.pressure.write)
    this.pressure.swap()

    // Jacobi pressure solve
    const pMat = this.materials.pressure
    this.setTexel(pMat, this.pressure.read)
    pMat.uniforms.uDivergence.value = this.divergence.texture
    for (let i = 0; i < this.pressureIterations; i++) {
      pMat.uniforms.uPressure.value = this.pressure.read.texture
      this.renderPass(pMat, this.pressure.write)
      this.pressure.swap()
    }

    // Subtract pressure gradient → divergence-free velocity
    const gradMat = this.materials.gradientSubtract
    this.setTexel(gradMat, this.velocity.read)
    gradMat.uniforms.uPressure.value = this.pressure.read.texture
    gradMat.uniforms.uVelocity.value = this.velocity.read.texture
    this.renderPass(gradMat, this.velocity.write)
    this.velocity.swap()

    // Advect velocity
    const advMat = this.materials.advection
    this.setTexel(advMat, this.velocity.read)
    advMat.uniforms.uVelocity.value = this.velocity.read.texture
    advMat.uniforms.uSource.value = this.velocity.read.texture
    advMat.uniforms.dt.value = clamped
    advMat.uniforms.dissipation.value = inkConfig.velocityDissipation
    this.renderPass(advMat, this.velocity.write)
    this.velocity.swap()

    // Advect dye (ink) — never cleared, so colors accumulate
    this.setTexel(advMat, this.dye.read)
    advMat.uniforms.uVelocity.value = this.velocity.read.texture
    advMat.uniforms.uSource.value = this.dye.read.texture
    advMat.uniforms.dissipation.value = inkConfig.densityDissipation
    this.renderPass(advMat, this.dye.write)
    this.dye.swap()

    // Inject queued pointer ink
    this.applySplats()

    // Drift the specular highlight slowly for a living glass surface
    if (!this.reducedMotion) {
      this.lightT += clamped * 0.12
      this.light.set(0.5 + Math.cos(this.lightT) * 0.3, 0.5 + Math.sin(this.lightT * 0.8) * 0.25)
    }
  }

  render() {
    if (!this.dye) return // same reason as step()
    const disp = this.materials.display
    this.setTexel(disp, this.dye.read)
    disp.uniforms.uDye.value = this.dye.read.texture
    ;(disp.uniforms.waterColor.value as THREE.Vector3).set(
      this.waterColor.r,
      this.waterColor.g,
      this.waterColor.b,
    )
    ;(disp.uniforms.glassColor.value as THREE.Vector3).set(
      this.glassColor.r,
      this.glassColor.g,
      this.glassColor.b,
    )
    this.renderPass(disp, null)
  }

  /**
   * Fade the ink (and settle the water) by `seconds` of real time in one pass.
   * The render loop only steps while the hero is on screen; this makes up the
   * time it was paused — scrolled away, a hidden tab, or the other page — so
   * ink always fades on the clock instead of freezing.
   */
  fade(seconds: number) {
    if (!this.supported || !this.dye || seconds <= 0) return
    this.scaleInPlace(this.dye, Math.exp(-inkConfig.densityDissipation * seconds))
    this.scaleInPlace(this.velocity, Math.exp(-inkConfig.velocityDissipation * seconds))
  }

  /**
   * Wash the water clean. Not an instant wipe: the ink drains over a short spell
   * so it reads as the water clearing rather than a cut, then lands on exactly
   * clear water. Deliberately NOT cancelled by painting — on desktop the hero
   * paints on hover, so the first mouse move after the click would abort it.
   * Input is never locked; a stroke made inside the window just drains too.
   *
   * Runs on the wall clock, not the sim's timestep: the loop clamps each step to
   * 1/60s, so a wash counted in steps would take twice as long on a 30fps phone
   * and crawl in a throttled tab. Here 0.4s is 0.4s on any display.
   */
  clear() {
    if (!this.supported || !this.dye) return
    const now = performance.now()
    this.washUntil = now + WASH_SECONDS * 1000
    this.washLast = now
  }

  private wash() {
    if (!this.dye) return
    const now = performance.now()
    if (now >= this.washUntil) {
      this.washUntil = 0
      for (const fbo of [this.dye, this.velocity]) {
        this.clearTarget(fbo.read)
        this.clearTarget(fbo.write)
      }
      return
    }
    const factor = Math.exp((-WASH_RATE * (now - this.washLast)) / 1000)
    this.washLast = now
    this.scaleInPlace(this.dye, factor)
    this.scaleInPlace(this.velocity, factor)
  }

  /** Multiply every channel of a double FBO by `factor` (colour/amount ratio is kept). */
  private scaleInPlace(fbo: DoubleFBO, factor: number) {
    const m = this.materials.clear
    this.setTexel(m, fbo.write)
    m.uniforms.uTexture.value = fbo.read.texture
    m.uniforms.value.value = factor
    this.renderPass(m, fbo.write)
    fbo.swap()
  }

  /** Resampling copy (linear-filtered), used to keep ink across grid sizes. */
  private copyInto(src: THREE.WebGLRenderTarget, dst: THREE.WebGLRenderTarget) {
    const m = this.materials.clear
    this.setTexel(m, dst)
    m.uniforms.uTexture.value = src.texture
    m.uniforms.value.value = 1
    this.renderPass(m, dst)
  }

  private disposeTargets() {
    this.disposeSet({
      velocity: this.velocity,
      dye: this.dye,
      pressure: this.pressure,
      divergence: this.divergence,
      curl: this.curl,
    })
  }

  private disposeSet(t: {
    velocity?: DoubleFBO
    dye?: DoubleFBO
    pressure?: DoubleFBO
    divergence?: THREE.WebGLRenderTarget
    curl?: THREE.WebGLRenderTarget
  }) {
    for (const fbo of [t.velocity, t.dye, t.pressure]) {
      fbo?.read.dispose()
      fbo?.write.dispose()
    }
    t.divergence?.dispose()
    t.curl?.dispose()
  }

  dispose() {
    this.disposeTargets()
    Object.values(this.materials).forEach((m) => m.dispose())
    this.quad.geometry.dispose()
    this.renderer.dispose()
  }
}
