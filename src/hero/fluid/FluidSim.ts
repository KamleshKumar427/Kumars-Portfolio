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
  private activeColor = new THREE.Color(inkConfig.swatches[0].hex)
  private waterColor = new THREE.Color(inkConfig.tints.dark.water)
  private glassColor = new THREE.Color(inkConfig.tints.dark.glass)

  private width = 1
  private height = 1
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
    this.width = Math.max(1, width)
    this.height = Math.max(1, height)
    this.renderer.setSize(this.width, this.height, false)

    if (!this.supported) return

    const aspect = this.width / this.height
    // Keep sim grid proportioned to the hero so ink isn't stretched.
    const simW = aspect >= 1 ? Math.round(this.simRes * aspect) : this.simRes
    const simH = aspect >= 1 ? this.simRes : Math.round(this.simRes / aspect)
    const dyeW = aspect >= 1 ? Math.round(this.dyeRes * aspect) : this.dyeRes
    const dyeH = aspect >= 1 ? this.dyeRes : Math.round(this.dyeRes / aspect)

    this.disposeTargets()
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
  }

  private clearTarget(target: THREE.WebGLRenderTarget) {
    this.renderer.setRenderTarget(target)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.clear(true, false, false)
    this.renderer.setRenderTarget(null)
  }

  setColor(hex: string) {
    this.activeColor.set(hex)
  }

  setTheme(isDark: boolean) {
    const tint = isDark ? inkConfig.tints.dark : inkConfig.tints.light
    this.waterColor.set(tint.water)
    this.glassColor.set(tint.glass)
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
    const radius = inkConfig.splatRadius / 100

    for (const s of this.splatQueue) {
      // Velocity splat
      const vMat = this.materials.splat
      this.setTexel(vMat, this.velocity.write)
      vMat.uniforms.uTarget.value = this.velocity.read.texture
      vMat.uniforms.aspectRatio.value = aspect
      vMat.uniforms.point.value.set(s.x, s.y)
      ;(vMat.uniforms.color.value as THREE.Vector3).set(
        s.dx * inkConfig.splatForce,
        s.dy * inkConfig.splatForce,
        0,
      )
      vMat.uniforms.radius.value = radius
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
      this.renderPass(dMat, this.dye.write)
      this.dye.swap()
    }
    this.splatQueue.length = 0
  }

  step(dt: number) {
    if (!this.supported) return
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

  private disposeTargets() {
    const fbos = [this.velocity, this.dye, this.pressure]
    for (const fbo of fbos) {
      fbo?.read.dispose()
      fbo?.write.dispose()
    }
    this.divergence?.dispose()
    this.curl?.dispose()
  }

  dispose() {
    this.disposeTargets()
    Object.values(this.materials).forEach((m) => m.dispose())
    this.quad.geometry.dispose()
    this.renderer.dispose()
  }
}
