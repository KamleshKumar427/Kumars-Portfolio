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
  layerCopyFragment,
  pressureFragment,
  splatFragment,
  volumeFragment,
  vorticityFragment,
} from './shaders'

type DoubleFBO = {
  read: THREE.WebGLRenderTarget
  write: THREE.WebGLRenderTarget
  swap: () => void
}

/** The water below the surface: one layer per depth (see volumeFragment). */
type Volume = {
  read: THREE.WebGL3DRenderTarget
  write: THREE.WebGL3DRenderTarget
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
  /** the ink's absorbance per unit amount — see setColor */
  absorb: THREE.Vector3
  /** a tap (round blob) rather than a stroke segment */
  point: boolean
}

/** sRGB component → linear light (the same curve the display pass inverts). */
const toLinear = (c: number) => Math.pow(Math.max(c, 0), 2.2)

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
  private volume!: Volume
  private layers = inkConfig.volume.layers
  /** False if this device can't draw into the water's layers — see resize. */
  private volumeOk = true

  private materials: Record<string, THREE.ShaderMaterial> = {}
  private splatQueue: Splat[] = []
  /** Wall-clock end of a running wash in ms, or 0 when none (see clear). */
  private washUntil = 0
  private washLast = 0
  private activeColor = new THREE.Color(inkConfig.swatches[0].hex)
  private activeAbsorb = new THREE.Vector3()
  private waterColor = new THREE.Color(inkConfig.tints.dark.water)
  private glassColor = new THREE.Color(inkConfig.tints.dark.glass)
  /** Where the viewer's eye is over the hero, in uv — see setEye. */
  private eye = new THREE.Vector2(0.5, 0.5)

  private width = 1
  private height = 1
  /** Aspect the current grid was built for, rounded — see resize(). */
  private aspectBucket = 0
  private reducedMotion = false

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
    this.setColor(inkConfig.swatches[0].hex)
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

  private makeVolume(w: number, h: number): Volume {
    const make = () =>
      new THREE.WebGL3DRenderTarget(w, h, this.layers, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
        wrapR: THREE.ClampToEdgeWrapping,
        depthBuffer: false,
        stencilBuffer: false,
      })
    return {
      read: make(),
      write: make(),
      swap() {
        const tmp = this.read
        this.read = this.write
        this.write = tmp
      },
    }
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
      prevPoint: { value: new THREE.Vector2() },
      radius: { value: 1 },
      isPoint: { value: 0 },
    })
    this.materials.advection = mat(advectionFragment, {
      uVelocity: { value: null },
      uSource: { value: null },
      uCurl: { value: null },
      dt: { value: 0 },
      dissipation: { value: 0 },
      release: { value: 0 },
      swirlRelease: { value: 0 },
      swirlRef: { value: 1 },
    })
    this.materials.volume = mat(volumeFragment, {
      uVolume: { value: null },
      uSurface: { value: null },
      uVelocity: { value: null },
      uCurl: { value: null },
      velocityTexel: { value: new THREE.Vector2() },
      surfaceTexel: { value: new THREE.Vector2() },
      layer: { value: 0 },
      layers: { value: this.layers },
      thickness: { value: 0.1 },
      dt: { value: 0 },
      dissipation: { value: 0 },
      drag: { value: 1 },
      settle: { value: 0 },
      swirlPull: { value: 0 },
      swirlRef: { value: 1 },
      release: { value: 0 },
      swirlRelease: { value: 0 },
    })
    this.materials.layerCopy = mat(layerCopyFragment, {
      uVolume: { value: null },
      w: { value: 0 },
      value: { value: 1 },
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
      aspectRatio: { value: 1 },
      darkMode: { value: 1 },
      inkDepth: { value: inkConfig.inkDepth },
      thicknessCap: { value: inkConfig.thicknessCap },
      faintInk: { value: new THREE.Vector2() },
      shadowBlur: { value: inkConfig.shadow.blur * inkConfig.depth.floor },
      shadowStrength: { value: inkConfig.shadow.strength },
      shadowNeutral: { value: inkConfig.shadow.neutral },
      shadowFill: { value: inkConfig.shadow.fill },
      darkCoverage: { value: inkConfig.darkCoverage },
      darkGlow: { value: inkConfig.shadow.glow },
      uPressure: { value: null },
      pressureTexel: { value: new THREE.Vector2() },
      surfaceHeight: { value: inkConfig.surface.height },
      refraction: { value: inkConfig.surface.refraction },
      wobble: { value: inkConfig.surface.wobble },
      caustics: { value: inkConfig.surface.caustics },
      glint: { value: inkConfig.surface.glint.light },
      glintColor: { value: new THREE.Vector3() },
      eye: { value: new THREE.Vector3(0.5, 0.5, inkConfig.depth.eyeHeight) },
      floorDepth: { value: inkConfig.depth.floor },
      keyLight: { value: new THREE.Vector3(0, 0, 1) },
      uVolume: { value: null },
      haze: { value: 0 },
      sunkCover: { value: 1 },
    })
    // The sunk-ink loop is unrolled at compile time.
    this.materials.display.defines = { LAYERS: this.layers }
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

    // Sunk ink is soft, so its layers are coarser than the surface ink.
    const scale = inkConfig.volume.scale
    const volW = Math.max(8, Math.round(dyeW * scale))
    const volH = Math.max(8, Math.round(dyeH * scale))

    const prev = {
      velocity: this.velocity,
      dye: this.dye,
      pressure: this.pressure,
      divergence: this.divergence,
      curl: this.curl,
      volume: this.volume,
    }
    this.velocity = this.makeDoubleFBO(simW, simH)
    this.dye = this.makeDoubleFBO(dyeW, dyeH)
    this.divergence = this.makeRT(simW, simH)
    this.curl = this.makeRT(simW, simH)
    this.pressure = this.makeDoubleFBO(simW, simH)
    this.volume = this.makeVolume(volW, volH)

    // Render targets start with undefined contents — zero them so the dye
    // field begins as clear water rather than GPU garbage.
    for (const fbo of [this.velocity, this.dye, this.pressure]) {
      this.clearTarget(fbo.read)
      this.clearTarget(fbo.write)
    }
    this.clearTarget(this.divergence)
    this.clearTarget(this.curl)
    // The water's layers are the one part of the sim that isn't a plain 2D
    // render target. WebGL2 allows drawing into them, but if a driver refuses,
    // ink simply stays on the surface — the hero as it was before the water
    // had depth — rather than draining into a buffer that can't hold it.
    this.volumeOk = this.canDrawInto(this.volume.read)
    this.clearVolume(this.volume.read)
    this.clearVolume(this.volume.write)

    // Carry the painted ink onto the new grid — a window resize, or the canvas
    // moving to the other page's hero, must not wipe it. (Velocity restarts
    // still; the ink simply stops drifting for a moment.)
    if (prev.dye) this.copyInto(prev.dye.read, this.dye.read)
    if (prev.volume && this.volumeOk) this.copyVolume(prev.volume.read, this.volume.read, 1)
    this.disposeSet(prev)
  }

  private clearTarget(target: THREE.WebGLRenderTarget) {
    this.renderer.setRenderTarget(target)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.clear(true, false, false)
    this.renderer.setRenderTarget(null)
  }

  private canDrawInto(target: THREE.WebGL3DRenderTarget) {
    const gl = this.renderer.getContext()
    this.renderer.setRenderTarget(target, 0)
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
    this.renderer.setRenderTarget(null)
    return ok
  }

  private clearVolume(target: THREE.WebGL3DRenderTarget) {
    if (!this.volumeOk) return
    this.renderer.setClearColor(0x000000, 0)
    for (let k = 0; k < this.layers; k++) {
      this.renderer.setRenderTarget(target, k)
      this.renderer.clear(true, false, false)
    }
    this.renderer.setRenderTarget(null)
  }

  /** Copy every layer of `src` into `dst` (resampled), scaled by `value`. */
  private copyVolume(src: THREE.WebGL3DRenderTarget, dst: THREE.WebGL3DRenderTarget, value: number) {
    const m = this.materials.layerCopy
    m.uniforms.uVolume.value = src.texture
    m.uniforms.value.value = value
    for (let k = 0; k < this.layers; k++) {
      m.uniforms.w.value = (k + 0.5) / this.layers
      this.renderPass(m, dst, k)
    }
  }

  /** Depth of the paper below the surface, in hero heights (shallower on
   *  phone-sized heroes — see inkConfig.compact.shadowScale). */
  private floorDepth() {
    const compact = this.width <= inkConfig.compact.maxWidth
    return inkConfig.depth.floor * (compact ? inkConfig.compact.shadowScale : 1)
  }

  setColor(hex: string) {
    // Keep the swatch's own sRGB components. The display pass writes straight
    // to the canvas with no colour-space conversion, so THREE.Color's default
    // (convert to linear) would shift every ink away from the swatch it came
    // from. Reading the hex "as linear" leaves the components untouched.
    this.activeColor.setStyle(hex, THREE.LinearSRGBColorSpace)
    // Real dye doesn't paint a colour on top — it absorbs part of the light
    // passing through it. Store each channel's absorbance, -ln(transmittance),
    // with the swatch defining what one unit of ink lets through. The dye field
    // then holds optical depth: thin ink is a pale tint, thick ink is deep, and
    // overlapping inks ADD absorbance, so red over blue darkens toward violet-
    // black the way real ink does instead of averaging to a flat purple.
    const a = (c: number) => -Math.log(Math.max(toLinear(c), 0.004))
    this.activeAbsorb.set(a(this.activeColor.r), a(this.activeColor.g), a(this.activeColor.b))
  }

  setTheme(isDark: boolean) {
    const tint = isDark ? inkConfig.tints.dark : inkConfig.tints.light
    this.waterColor.set(tint.water)
    this.glassColor.set(tint.glass)
    this.materials.display.uniforms.darkMode.value = isDark ? 1 : 0
  }

  /**
   * Where the viewer's eye is over the hero, in uv (0.5, 0.5 = straight above
   * the middle; y up). The paper below the water is seen from here.
   */
  setEye(x: number, y: number) {
    this.eye.set(x, y)
  }

  /**
   * Queue ink. dx/dy are pointer deltas in normalized [0,1] space; the stroke
   * segment runs from (x - dx, y - dy) to (x, y). `point` marks a tap or a
   * seeded bloom — a round drop rather than a length of stroke.
   */
  addSplat(x: number, y: number, dx: number, dy: number, point = false) {
    this.splatQueue.push({ x, y, dx, dy, absorb: this.activeAbsorb.clone(), point })
  }

  private renderPass(
    material: THREE.ShaderMaterial,
    target: THREE.WebGLRenderTarget | null,
    layer = 0,
  ) {
    this.quad.material = material
    this.renderer.setRenderTarget(target, layer)
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
      vMat.uniforms.prevPoint.value.set(s.x - s.dx, s.y - s.dy)
      vMat.uniforms.isPoint.value = s.point ? 1 : 0
      // The solver measures velocity in velocity-grid texels per second, so the
      // pointer's motion (a fraction of the canvas) is converted per axis. The
      // old code applied one factor to both fractions, and since the grid has
      // more texels across than down on a wide screen, horizontal strokes
      // pushed the water a different distance from vertical ones — isotropic
      // water it was not. Now a stroke pushes the same way in any direction.
      ;(vMat.uniforms.color.value as THREE.Vector3).set(
        s.dx * this.velocity.read.width * force,
        s.dy * this.velocity.read.height * force,
        0,
      )
      // The push can be wider than the ink band (radius is a variance, so
      // width x k means radius x k^2). This is how the brush got thinner without
      // changing the water: the push still moves as much water as the wider
      // brush it was tuned with, so strokes curl and flow exactly as they did.
      vMat.uniforms.radius.value = radius * inkConfig.pushSpread * inkConfig.pushSpread
      vMat.uniforms.density.value = 0
      this.renderPass(vMat, this.velocity.write)
      this.velocity.swap()

      // Dye splat (selected ink color)
      const dMat = this.materials.splat
      this.setTexel(dMat, this.dye.write)
      dMat.uniforms.uTarget.value = this.dye.read.texture
      dMat.uniforms.aspectRatio.value = aspect
      dMat.uniforms.point.value.set(s.x, s.y)
      dMat.uniforms.prevPoint.value.set(s.x - s.dx, s.y - s.dy)
      dMat.uniforms.isPoint.value = s.point ? 1 : 0
      // absorbance x amount, so .rgb / .a stays the ink's own absorbance.
      // A drop (tap / welcome bloom) has its own amount: inkAmount is ink per
      // LENGTH of stroke, which has no meaning for a single round drop.
      const amount = s.point ? inkConfig.dropAmount : inkConfig.inkAmount
      ;(dMat.uniforms.color.value as THREE.Vector3).copy(s.absorb).multiplyScalar(amount)
      dMat.uniforms.radius.value = radius
      dMat.uniforms.density.value = amount // .a accumulates ink amount (see displayFragment)
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
    advMat.uniforms.uCurl.value = this.curl.texture
    advMat.uniforms.dt.value = clamped
    advMat.uniforms.dissipation.value = inkConfig.velocityDissipation
    advMat.uniforms.release.value = 0
    advMat.uniforms.swirlRelease.value = 0
    this.renderPass(advMat, this.velocity.write)
    this.velocity.swap()

    // The water below: ink released from the surface sinks through its
    // layers. Reads the surface ink BEFORE this step's advection, which is
    // what that advection releases — so no ink is made or lost on the way down.
    const vol = inkConfig.volume
    const floor = this.floorDepth()
    const volMat = this.materials.volume
    const vu = volMat.uniforms
    vu.uVolume.value = this.volume.read.texture
    vu.uSurface.value = this.dye.read.texture
    vu.uVelocity.value = this.velocity.read.texture
    vu.uCurl.value = this.curl.texture
    ;(vu.velocityTexel.value as THREE.Vector2).set(1 / this.velocity.read.width, 1 / this.velocity.read.height)
    ;(vu.surfaceTexel.value as THREE.Vector2).set(1 / this.dye.read.width, 1 / this.dye.read.height)
    vu.layers.value = this.layers
    vu.thickness.value = floor / this.layers
    vu.dt.value = clamped
    vu.dissipation.value = vol.fade
    // Speeds and the flow's reach are set as shares of the depth, so a deeper
    // paper doesn't change how long ink takes to reach it.
    vu.drag.value = vol.drag * floor
    vu.settle.value = vol.settle * floor
    vu.swirlPull.value = vol.swirlPull * floor
    vu.swirlRef.value = vol.swirlRef
    vu.release.value = vol.release
    vu.swirlRelease.value = vol.swirlRelease
    if (this.volumeOk) {
      for (let k = 0; k < this.layers; k++) {
        vu.layer.value = k
        this.renderPass(volMat, this.volume.write, k)
      }
      this.volume.swap()
    }

    // Advect dye (ink) — never cleared, so colors accumulate.
    // The backtrace converts velocity (velocity-grid texels/s) to a distance,
    // so it must use the VELOCITY grid's texel size even though the dye lives
    // on a finer grid. This used to set the dye's texel size here, which made
    // every backtrace 8x too short (dye 1024 / velocity 128; 5.3x on phones):
    // the water moved and the ink lagged behind it like syrup, which is most of
    // why the hero read as paint rather than ink carried by water.
    this.setTexel(advMat, this.velocity.read)
    advMat.uniforms.uVelocity.value = this.velocity.read.texture
    advMat.uniforms.uSource.value = this.dye.read.texture
    advMat.uniforms.dissipation.value = inkConfig.densityDissipation
    // Without the water's layers there is nowhere to sink to: nothing leaves.
    advMat.uniforms.release.value = this.volumeOk ? vol.release : 0
    advMat.uniforms.swirlRelease.value = this.volumeOk ? vol.swirlRelease : 0
    advMat.uniforms.swirlRef.value = vol.swirlRef
    this.renderPass(advMat, this.dye.write)
    this.dye.swap()

    // Inject queued pointer ink
    this.applySplats()
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
    // Tunables are read every frame so they can be adjusted live.
    const u = disp.uniforms
    u.aspectRatio.value = this.width / this.height
    u.inkDepth.value = inkConfig.inkDepth
    u.thicknessCap.value = inkConfig.thicknessCap
    ;(u.faintInk.value as THREE.Vector2).set(inkConfig.faintInk.from, inkConfig.faintInk.to)
    const depth = inkConfig.depth
    const floor = this.floorDepth()
    const { x, y, slope } = depth.light
    ;(u.keyLight.value as THREE.Vector3).set(x * slope, y * slope, 1).normalize()
    u.floorDepth.value = floor
    ;(u.eye.value as THREE.Vector3).set(this.eye.x, this.eye.y, depth.eyeHeight)
    // The further the shadow falls, the softer it lands.
    u.shadowBlur.value = inkConfig.shadow.blur * floor
    u.uVolume.value = this.volume.read.texture
    // haze is the share of contrast lost by ink lying on the paper.
    u.haze.value = -Math.log(1 - Math.min(inkConfig.volume.haze, 0.99)) / floor
    u.sunkCover.value = inkConfig.volume.darkCover
    u.shadowStrength.value = inkConfig.shadow.strength
    u.shadowNeutral.value = inkConfig.shadow.neutral
    u.shadowFill.value = inkConfig.shadow.fill
    u.darkCoverage.value = inkConfig.darkCoverage
    u.darkGlow.value = inkConfig.shadow.glow
    u.uPressure.value = this.pressure.read.texture
    ;(u.pressureTexel.value as THREE.Vector2).set(1 / this.pressure.read.width, 1 / this.pressure.read.height)
    u.surfaceHeight.value = inkConfig.surface.height
    u.refraction.value = inkConfig.surface.refraction
    u.wobble.value = inkConfig.surface.wobble
    u.caustics.value = inkConfig.surface.caustics
    u.glint.value = u.darkMode.value > 0.5 ? inkConfig.surface.glint.dark : inkConfig.surface.glint.light
    ;(u.glintColor.value as THREE.Vector3).set(this.glassColor.r, this.glassColor.g, this.glassColor.b)
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
    this.scaleVolume(Math.exp(-inkConfig.volume.fade * seconds))
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
      this.clearVolume(this.volume.read)
      this.clearVolume(this.volume.write)
      return
    }
    const factor = Math.exp((-WASH_RATE * (now - this.washLast)) / 1000)
    this.washLast = now
    this.scaleInPlace(this.dye, factor)
    this.scaleVolume(factor)
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

  /** The same for the sunk ink: every layer of the water. */
  private scaleVolume(factor: number) {
    if (!this.volumeOk) return
    this.copyVolume(this.volume.read, this.volume.write, factor)
    this.volume.swap()
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
      volume: this.volume,
    })
  }

  private disposeSet(t: {
    velocity?: DoubleFBO
    dye?: DoubleFBO
    pressure?: DoubleFBO
    divergence?: THREE.WebGLRenderTarget
    curl?: THREE.WebGLRenderTarget
    volume?: Volume
  }) {
    for (const fbo of [t.velocity, t.dye, t.pressure]) {
      fbo?.read.dispose()
      fbo?.write.dispose()
    }
    t.divergence?.dispose()
    t.curl?.dispose()
    t.volume?.read.dispose()
    t.volume?.write.dispose()
  }

  dispose() {
    this.disposeTargets()
    Object.values(this.materials).forEach((m) => m.dispose())
    this.quad.geometry.dispose()
    this.renderer.dispose()
  }
}
