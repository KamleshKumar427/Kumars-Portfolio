/**
 * The pond scene: boids sim loop + instanced fish/pellets/ripples + click-to-feed.
 * Food only disappears when a fish actually eats a pellet — not on proximity alone.
 */
/* eslint-disable react-hooks/immutability -- This is an R3F simulation: per-frame
   mutation of memoized instance buffers (pellets, ripples, boids, food) inside
   useFrame/handlers is the required, performant pattern — instance matrices cannot
   be driven through React state. */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { KoiConfig } from './koiConfig'
import { createBoids, stepBoids, type FoodPoint } from './boids'
import { PondFoliage } from './foliage'
import {
  createFishGeometry,
  createRippleGeometry,
  makePondFloorMaterial,
  makeRippleMaterial,
  makeWaterMaterial,
} from './visuals'

type Props = {
  cfg: KoiConfig
  reduced?: boolean
  onFeed?: () => void
}

const dummy = new THREE.Object3D()
const tmpColor = new THREE.Color()
const RIPPLE_DURATION = 1.6

export function PondScene({ cfg, reduced = false, onFeed }: Props) {
  const fishRef = useRef<THREE.InstancedMesh>(null)
  const pelletRef = useRef<THREE.InstancedMesh>(null)
  const rippleRef = useRef<THREE.InstancedMesh>(null)

  const fishGeo = useMemo(() => createFishGeometry(), [])
  const waterMat = useMemo(() => makeWaterMaterial(cfg), [cfg])
  const floorMat = useMemo(() => makePondFloorMaterial(cfg), [cfg])
  const rippleGeo = useMemo(() => createRippleGeometry(cfg.limits.maxRipples), [cfg])
  const rippleMat = useMemo(() => makeRippleMaterial(cfg), [cfg])

  // Food pellet geometry + material as real objects passed via args — the same
  // pattern the (rendering) fish and ripples use. The undefined-args + JSX-child
  // form did not render reliably for this InstancedMesh.
  const pelletGeo = useMemo(() => new THREE.SphereGeometry(1, 14, 12), [])
  const pelletMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffd24a',
        roughness: 0.4,
        emissive: '#e8920f',
        emissiveIntensity: 0.65,
        toneMapped: false, // keep the food vivid against the teal water
      }),
    [],
  )

  // ── Optimized koi GLB → one normalized geometry + material for instancing ──
  const koiGltf = useGLTF('/pond/koi.glb')
  const proceduralFishMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        roughness: 0.3,
        metalness: 0.04,
        clearcoat: 0.6,
        clearcoatRoughness: 0.22,
        envMapIntensity: 0.7,
      }),
    [],
  )
  const koiModel = useMemo(() => {
    let geo: THREE.BufferGeometry | null = null
    let mat: THREE.Material | null = null
    koiGltf.scene.traverse((o) => {
      const m = o as THREE.Mesh
      if (m.isMesh && !geo) {
        m.updateWorldMatrix(true, false)
        geo = m.geometry.clone()
        geo.applyMatrix4(m.matrixWorld) // bake the node transform into the verts
        mat = Array.isArray(m.material) ? m.material[0] : m.material
      }
    })
    if (!geo || !mat) return null
    const g: THREE.BufferGeometry = geo
    g.center()
    const size = new THREE.Vector3()
    g.computeBoundingBox()
    g.boundingBox!.getSize(size)
    // Lay the fish flat if authored vertical, then orient its length down +Z
    // (boids treat +Z as "forward"). koiYawOffset flips it if the head's wrong.
    if (size.y > size.x && size.y > size.z) {
      g.rotateX(-Math.PI / 2)
      g.computeBoundingBox()
      g.boundingBox!.getSize(size)
    }
    if (size.x > size.z) {
      g.rotateY(Math.PI / 2)
      g.computeBoundingBox()
      g.boundingBox!.getSize(size)
    }
    const s = cfg.koiLength / Math.max(size.z, 0.0001)
    g.scale(s, s, s)
    if (cfg.koiYawOffset) g.rotateY(cfg.koiYawOffset)
    if (mat) {
      const mp = mat as THREE.MeshStandardMaterial
      mp.metalness = Math.min(mp.metalness ?? 0, 0.2) // tame any chrome-y look
      mp.roughness = Math.max(mp.roughness ?? 0.5, 0.35)
      mp.envMapIntensity = 0.6
    }
    return { geometry: g, material: mat }
  }, [koiGltf, cfg.koiLength, cfg.koiYawOffset])

  const useKoiModel = cfg.useModels && koiModel !== null
  const instGeo = useKoiModel ? koiModel!.geometry : fishGeo
  const instMat = useKoiModel ? koiModel!.material : proceduralFishMat

  // Dispose the GPU resources we built imperatively (R3F only auto-disposes JSX
  // primitives) on unmount or when cfg swaps them — avoids a leak across route
  // changes. The koi *material* is owned by the useGLTF cache, so leave it alone.
  useEffect(() => {
    return () => {
      waterMat.dispose()
      floorMat.dispose()
      rippleMat.dispose()
      rippleGeo.dispose()
      pelletGeo.dispose()
      pelletMat.dispose()
      proceduralFishMat.dispose()
      fishGeo.dispose()
      koiModel?.geometry.dispose()
    }
  }, [waterMat, floorMat, rippleMat, rippleGeo, pelletGeo, pelletMat, proceduralFishMat, fishGeo, koiModel])

  const boids = useMemo(() => createBoids(cfg), [cfg])
  const food = useRef<FoodPoint[]>([])

  const pellets = useMemo(() => {
    const n = cfg.limits.maxPellets
    return {
      pos: Array.from({ length: n }, () => new THREE.Vector3()),
      vel: Array.from({ length: n }, () => new THREE.Vector3()),
      active: new Uint8Array(n),
      landed: new Uint8Array(n),
      // mass: 1 when fresh, drains toward 0 only while a fish is nibbling it.
      mass: new Float32Array(n),
      landedAt: new Float32Array(n),
      spawnAt: new Float32Array(n),
      next: 0,
    }
  }, [cfg])

  const ripples = useMemo(() => {
    const n = cfg.limits.maxRipples
    return {
      pos: Array.from({ length: n }, () => new THREE.Vector3()),
      progress: new Float32Array(n).fill(1),
      next: 0,
    }
  }, [cfg])

  // Park every pellet out of view (mutates the shared pellet buffers).
  function hideAllPellets() {
    const pm = pelletRef.current
    if (!pm) return
    dummy.position.set(0, -100, 0)
    dummy.scale.setScalar(0.0001)
    dummy.updateMatrix()
    for (let i = 0; i < cfg.limits.maxPellets; i++) {
      pellets.active[i] = 0
      pellets.mass[i] = 0
      pm.setMatrixAt(i, dummy.matrix)
    }
    pm.instanceMatrix.needsUpdate = true
  }

  useEffect(() => {
    const fish = fishRef.current
    // Per-fish tints only for the procedural koi; the GLB carries its own livery.
    if (fish && !cfg.useModels) {
      for (let i = 0; i < boids.length; i++) {
        tmpColor.set(cfg.koiColors[boids[i].colorIndex % cfg.koiColors.length])
        fish.setColorAt(i, tmpColor)
      }
      if (fish.instanceColor) fish.instanceColor.needsUpdate = true
    }
    hideAllPellets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boids, cfg])

  function spawnRipple(x: number, z: number) {
    const n = cfg.limits.maxRipples
    let idx = -1
    for (let i = 0; i < n; i++) {
      if (ripples.progress[i] >= 1) {
        idx = i
        break
      }
    }
    if (idx < 0) {
      idx = ripples.next % n
      ripples.next++
    }
    ripples.pos[idx].set(x, 0.05, z)
    ripples.progress[idx] = 0
  }

  function feed(x: number, z: number) {
    // Clamp the feed point into the elliptical swim area.
    const e = Math.hypot(x / cfg.swimHalfWidth, z / cfg.swimHalfDepth)
    if (e > 0.9) {
      x = (x / e) * 0.9
      z = (z / e) * 0.9
    }

    const now = performance.now()
    if (food.current.length >= cfg.limits.maxFoodPoints) food.current.shift()
    food.current.push({
      pos: new THREE.Vector3(x, 0, z),
      amount: 1,
      bornAt: now,
    })

    const count = Math.min(cfg.pelletsPerClick, cfg.limits.maxPellets)
    for (let i = 0; i < count; i++) {
      const idx = pellets.next % cfg.limits.maxPellets
      pellets.next++
      const a = Math.random() * Math.PI * 2
      const rr = Math.random() * 0.55
      pellets.pos[idx].set(x + Math.cos(a) * rr, 0.85 + Math.random() * 0.45, z + Math.sin(a) * rr)
      pellets.vel[idx].set((Math.random() - 0.5) * 0.25, -1.1 - Math.random() * 0.5, (Math.random() - 0.5) * 0.25)
      pellets.active[idx] = 1
      pellets.landed[idx] = 0
      pellets.mass[idx] = 1
      pellets.spawnAt[idx] = now
      pellets.landedAt[idx] = 0
    }
    spawnRipple(x, z)
    onFeed?.()
  }

  function handlePointer(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    feed(e.point.x, e.point.z)
  }

  // An attractor lives as long as edible pellet *mass* remains near it; its
  // pull weakens as the food is eaten. Proximity alone never depletes it.
  function syncFoodAttractors(now: number) {
    const fl = cfg.foodLifespanMs
    food.current = food.current.filter((f) => {
      let massHere = 0
      for (let i = 0; i < cfg.limits.maxPellets; i++) {
        if (!pellets.active[i]) continue
        // Horizontal (x/z) distance only — airborne pellets still falling above
        // the food point must count, or the attractor is culled before they land.
        const dx = pellets.pos[i].x - f.pos.x
        const dz = pellets.pos[i].z - f.pos.z
        if (dx * dx + dz * dz < 0.7 * 0.7) massHere += pellets.mass[i]
      }
      f.amount = massHere
      return massHere > 0.02 && now - f.bornAt <= fl
    })
  }

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const now = performance.now()
    waterMat.uniforms.uTime.value = t

    syncFoodAttractors(now)

    stepBoids(boids, food.current, reduced ? dt * 0.5 : dt, cfg)

    const fish = fishRef.current
    if (fish) {
      for (let i = 0; i < boids.length; i++) {
        const b = boids[i]
        const speed = b.vel.length()
        const heading = Math.atan2(b.vel.x, b.vel.z)
        const sway = Math.sin(t * 6 + b.phase) * 0.14 * Math.min(speed / cfg.swimSpeed, 1.5)
        dummy.position.set(b.pos.x, 0.1 + Math.sin(t * 1.3 + b.bobPhase) * 0.03, b.pos.z)
        dummy.rotation.set(0, heading + sway, Math.sin(t * 3 + b.phase) * 0.04)
        dummy.scale.setScalar(b.size)
        dummy.updateMatrix()
        fish.setMatrixAt(i, dummy.matrix)
      }
      fish.instanceMatrix.needsUpdate = true
    }

    const pm = pelletRef.current
    if (pm) {
      const maxFloatMs = cfg.foodLifespanMs
      for (let i = 0; i < cfg.limits.maxPellets; i++) {
        if (!pellets.active[i]) {
          dummy.position.set(0, -100, 0)
          dummy.scale.setScalar(0.0001)
          dummy.updateMatrix()
          pm.setMatrixAt(i, dummy.matrix)
          continue
        }

        const p = pellets.pos[i]
        if (!pellets.landed[i]) {
          pellets.vel[i].y -= 2.6 * dt
          p.addScaledVector(pellets.vel[i], dt)
          if (p.y <= 0.12) {
            p.y = 0.12
            pellets.landed[i] = 1
            pellets.landedAt[i] = now
            spawnRipple(p.x, p.z)
          }
        } else {
          p.y = 0.12 + Math.sin(t * 2.2 + i * 0.7) * 0.014

          // Gradual nibbling: a pellet shrinks ONLY while a fish is actually on
          // it (within eat radius) — never on mere proximity. Crowding fish eat
          // it a little faster, but it still takes a beat, so food lingers.
          let nibblers = 0
          for (let fi = 0; fi < boids.length && nibblers < 2; fi++) {
            if (boids[fi].pos.distanceTo(p) <= cfg.radii.eat) nibblers++
          }
          if (nibblers > 0) {
            pellets.mass[i] -= cfg.eatRatePerSec * (1 + 0.6 * (nibblers - 1)) * dt
            if (pellets.mass[i] <= 0) {
              pellets.mass[i] = 0
              pellets.active[i] = 0
              spawnRipple(p.x, p.z)
            }
          }
          if (now - pellets.landedAt[i] > maxFloatMs) pellets.active[i] = 0
        }

        // Visible shrink as it is eaten; full size while drifting unbothered.
        const bite = pellets.landed[i] ? 0.35 + 0.65 * pellets.mass[i] : 1
        const scale = (pellets.landed[i] ? cfg.pelletSize : cfg.pelletSize * 0.82) * bite
        dummy.position.copy(p)
        dummy.rotation.set(0, 0, 0)
        dummy.scale.setScalar(Math.max(scale, 0.0001))
        dummy.updateMatrix()
        pm.setMatrixAt(i, dummy.matrix)
      }
      pm.instanceMatrix.needsUpdate = true
    }

    const rm = rippleRef.current
    if (rm) {
      const attr = rippleGeo.getAttribute('aProgress') as THREE.InstancedBufferAttribute
      const step = dt / RIPPLE_DURATION
      for (let i = 0; i < cfg.limits.maxRipples; i++) {
        if (ripples.progress[i] < 1) {
          ripples.progress[i] = Math.min(1, ripples.progress[i] + step)
          dummy.position.copy(ripples.pos[i])
          dummy.rotation.set(0, 0, 0)
          dummy.scale.setScalar(1)
          dummy.updateMatrix()
          rm.setMatrixAt(i, dummy.matrix)
        }
        attr.setX(i, ripples.progress[i])
      }
      rm.instanceMatrix.needsUpdate = true
      attr.needsUpdate = true
    }
  })

  return (
    <>
      <fog attach="fog" args={[cfg.palette.sky, 16, 36]} />
      <ambientLight intensity={0.7} color="#dff2f6" />
      <directionalLight position={[6, 11, 5]} intensity={1.5} color={cfg.palette.light} />
      <directionalLight position={[-6, 5, -5]} intensity={0.4} color="#bfe6f0" />
      <hemisphereLight args={['#dff4fb', cfg.palette.bank, 0.6]} />

      {/* Inline golden-hour environment → wet, realistic reflections on the koi,
          pads and pellets. Built from Lightformers, so no network/asset needed. */}
      <Environment resolution={128} frames={1}>
        <color attach="background" args={[cfg.palette.sky]} />
        <Lightformer intensity={2.4} color={cfg.palette.light} position={[0, 6, 2]} scale={[12, 12, 1]} />
        <Lightformer intensity={1.1} color={cfg.palette.horizon} position={[4, 2, 4]} scale={[6, 6, 1]} />
        <Lightformer intensity={0.8} color="#bfe6f0" position={[-5, 3, -3]} scale={[6, 6, 1]} />
      </Environment>

      {/* Mossy garden bank behind/around the water — the far shoreline. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]}>
        <planeGeometry args={[260, 220]} />
        <meshStandardMaterial color={cfg.palette.bank} roughness={1} metalness={0} />
      </mesh>

      {/* Sandy floor — visible through clear water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[cfg.waterWidth * 1.04, cfg.waterDepth * 1.04]} />
        <primitive object={floorMat} attach="material" />
      </mesh>

      {/* Full-width water surface — a wide plane that runs off both screen edges. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} onPointerDown={handlePointer}>
        <planeGeometry args={[cfg.waterWidth, cfg.waterDepth, cfg.waterSegments[0], cfg.waterSegments[1]]} />
        <primitive object={waterMat} attach="material" />
      </mesh>

      {/* frustumCulled=false: instance matrices are driven per-frame, so the
          auto-computed bounding sphere goes stale and wrongly culls the whole
          mesh (this hid the food entirely — pellets are parked off-screen until
          fed, which baked a bounding sphere at y=-100). */}
      <instancedMesh ref={fishRef} args={[instGeo, instMat, cfg.fishCount]} frustumCulled={false} />

      <instancedMesh ref={pelletRef} args={[pelletGeo, pelletMat, cfg.limits.maxPellets]} frustumCulled={false} />

      <instancedMesh ref={rippleRef} args={[rippleGeo, rippleMat, cfg.limits.maxRipples]} frustumCulled={false} />

      <PondFoliage cfg={cfg} />
    </>
  )
}
