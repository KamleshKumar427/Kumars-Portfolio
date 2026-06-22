/**
 * ════════════════════════════════════════════════════════════════
 *  BOIDS · emergent koi schooling (CPU, 2D on the water plane).
 *
 *  Each fish sums weighted steering forces, clamps to maxForce, then
 *  integrates. Behavior is driven by weights only — no keyframed tracks:
 *    · separation — avoid crowding neighbours (→ nudging at the food)
 *    · cohesion   — drift toward the local group centre (loose school)
 *    · alignment  — match neighbours' heading (believable schooling)
 *    · wander     — smoothly-steered randomness (dominant when idle)
 *    · seek+arrive— accelerate toward food, ease in on arrival (when fed)
 *    · bounds     — soft containment inside the pond circle
 *
 *  Per-fish randomized maxSpeed/phase keeps it alive & slightly chaotic.
 *  n ≤ 6 → the O(n²) neighbour loop is free; this stays at 60fps.
 * ════════════════════════════════════════════════════════════════
 */
import * as THREE from 'three'
import type { KoiConfig } from './koiConfig'

export type Boid = {
  pos: THREE.Vector3
  vel: THREE.Vector3
  maxSpeed: number
  phase: number
  bobPhase: number
  wanderAngle: number
  size: number
  colorIndex: number
}

export type FoodPoint = {
  pos: THREE.Vector3
  amount: number
  bornAt: number
}

const MAX_FORCE = 1.4
const MIN_SPEED = 0.12

// Module-scope scratch vectors — zero per-frame allocations.
const sep = new THREE.Vector3()
const coh = new THREE.Vector3()
const ali = new THREE.Vector3()
const wan = new THREE.Vector3()
const bnd = new THREE.Vector3()
const seek = new THREE.Vector3()
const acc = new THREE.Vector3()
const diff = new THREE.Vector3()
const center = new THREE.Vector3()

function limit(v: THREE.Vector3, max: number) {
  const len = v.length()
  if (len > max && len > 0) v.multiplyScalar(max / len)
}

export function createBoids(cfg: KoiConfig): Boid[] {
  const boids: Boid[] = []
  const hw = cfg.swimHalfWidth * 0.7
  const hd = cfg.swimHalfDepth * 0.7
  for (let i = 0; i < cfg.fishCount; i++) {
    const a = Math.random() * Math.PI * 2
    const d = Math.sqrt(Math.random())
    const heading = Math.random() * Math.PI * 2
    boids.push({
      pos: new THREE.Vector3(Math.cos(a) * d * hw, 0, Math.sin(a) * d * hd),
      vel: new THREE.Vector3(Math.cos(heading), 0, Math.sin(heading)).multiplyScalar(
        cfg.swimSpeed * 0.5,
      ),
      maxSpeed: cfg.swimSpeed * (0.82 + Math.random() * 0.36),
      phase: Math.random() * Math.PI * 2,
      bobPhase: Math.random() * Math.PI * 2,
      wanderAngle: heading,
      size: 0.85 + Math.random() * 0.4,
      colorIndex: i % cfg.koiColors.length,
    })
  }
  return boids
}

/** Pick the most "attractive" active food: nearest, scaled by remaining amount. */
function bestFood(boid: Boid, food: FoodPoint[]): FoodPoint | null {
  let best: FoodPoint | null = null
  let bestScore = -Infinity
  for (const f of food) {
    if (f.amount <= 0) continue
    const dist = boid.pos.distanceTo(f.pos) + 0.001
    const score = f.amount / dist
    if (score > bestScore) {
      bestScore = score
      best = f
    }
  }
  return best
}

/** Advance the whole school one step (mutates boids in place). */
export function stepBoids(
  boids: Boid[],
  food: FoodPoint[],
  dt: number,
  cfg: KoiConfig,
) {
  const { weights: w, radii: r } = cfg

  for (const b of boids) {
    sep.set(0, 0, 0)
    coh.set(0, 0, 0)
    ali.set(0, 0, 0)
    let sepCount = 0
    let cohCount = 0
    let aliCount = 0

    for (const o of boids) {
      if (o === b) continue
      const dist = b.pos.distanceTo(o.pos)
      if (dist < r.separation && dist > 0) {
        diff.copy(b.pos).sub(o.pos).divideScalar(dist * dist)
        sep.add(diff)
        sepCount++
      }
      if (dist < r.cohesion) {
        coh.add(o.pos)
        cohCount++
      }
      if (dist < r.alignment) {
        ali.add(o.vel)
        aliCount++
      }
    }

    if (sepCount > 0) sep.divideScalar(sepCount)
    if (cohCount > 0) coh.divideScalar(cohCount).sub(b.pos)
    if (aliCount > 0) ali.divideScalar(aliCount)
    sep.y = 0
    coh.y = 0
    ali.y = 0

    // Wander: rotate the heading by a little noise, project a forward target.
    b.wanderAngle += (Math.random() - 0.5) * 1.6 * dt
    wan.set(Math.cos(b.wanderAngle), 0, Math.sin(b.wanderAngle))

    // Soft bounds: steer back toward centre as fish near the elliptical rim.
    bnd.set(0, 0, 0)
    const nx = b.pos.x / cfg.swimHalfWidth
    const nz = b.pos.z / cfg.swimHalfDepth
    const e = Math.hypot(nx, nz)
    if (e > 0.82) {
      center.copy(b.pos).multiplyScalar(-1)
      if (center.lengthSq() > 0) center.normalize()
      bnd.copy(center).multiplyScalar((e - 0.82) / 0.18)
    }

    // Seek + arrival toward food (the "fed" drive).
    seek.set(0, 0, 0)
    const target = bestFood(b, food)
    const fed = target !== null
    if (target) {
      diff.copy(target.pos).sub(b.pos)
      diff.y = 0
      const d = diff.length()
      diff.normalize()
      // Arrival: ease the pull within arrive radius so they crowd, not overshoot.
      const arriveScale = d < r.arrive ? Math.max(d / r.arrive, 0.25) : 1
      seek.copy(diff).multiplyScalar(arriveScale)
    }

    // Weighted blend. When fed, wander/cohesion relax so the school converges.
    acc.set(0, 0, 0)
    acc.addScaledVector(sep, w.separation)
    acc.addScaledVector(coh, w.cohesion * (fed ? 0.4 : 1))
    acc.addScaledVector(ali, w.alignment * (fed ? 0.35 : 1))
    acc.addScaledVector(wan, w.wander * (fed ? 0.18 : 1))
    acc.addScaledVector(bnd, w.bounds)
    if (fed) acc.addScaledVector(seek, cfg.foodAttraction)
    acc.y = 0

    limit(acc, MAX_FORCE)

    const maxSpeed = b.maxSpeed * (fed ? cfg.fedSpeedBoost : 1)
    b.vel.addScaledVector(acc, dt * 3)
    b.vel.y = 0
    limit(b.vel, maxSpeed)

    // Never fully stall — koi always glide a little.
    const speed = b.vel.length()
    if (speed < MIN_SPEED) {
      if (speed > 0) b.vel.multiplyScalar(MIN_SPEED / speed)
      else b.vel.set(Math.cos(b.wanderAngle), 0, Math.sin(b.wanderAngle)).multiplyScalar(MIN_SPEED)
    }

    b.pos.addScaledVector(b.vel, dt)
    b.pos.y = 0
  }
}
