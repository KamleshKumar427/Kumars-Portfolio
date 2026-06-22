/**
 * Lakeside frame: real lily-pad + lotus GLB (cloned around the front of the
 * pond), with cheap procedural reeds + edge grasses beyond the bank.
 */
/* eslint-disable react-hooks/purity -- procedural scatter intentionally uses
   Math.random() inside useMemo: the random layout is computed once on mount. */
import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF, Clone } from '@react-three/drei'
import type { KoiConfig } from './koiConfig'

const STEM = new THREE.Color('#2f5a3c')
const GRASS = new THREE.Color('#4c9367')

export function PondFoliage({ cfg }: { cfg: KoiConfig }) {
  const lotus = useGLTF('/pond/lotus.glb')

  // Normalize the GLB once: footprint → ~1 unit, and where its base sits.
  const { footprint, minY } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(lotus.scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    return { footprint: Math.max(size.x, size.z, 0.0001), minY: box.min.y }
  }, [lotus])

  // Exactly three lotus: two back "corners" (wide left + right) and one centre,
  // spread across the full-width pond.
  const lilies = useMemo(() => {
    const base = cfg.lotusScale / footprint
    const hw = cfg.swimHalfWidth
    const hd = cfg.swimHalfDepth
    const spots = [
      { x: -hw * 0.85, z: -hd * 0.62, rot: 0.6, s: base * 1.0 }, // back-left accent
      { x: -hw * 0.42, z: -hd * 0.3, rot: 0.3, s: base * 1.0 }, // mid-left accent
      { x: hw * 0.72, z: hd * 0.95, rot: -0.5, s: base * 1.85 }, // prominent → bottom-right foreground
    ]
    return spots.map((p) => ({ ...p, y: 0.04 - minY * p.s }))
  }, [cfg, footprint, minY])

  // Reeds + grasses live on the far shoreline (beyond the water's back edge),
  // never floating in the open water.
  const reeds = useMemo(() => {
    const z0 = -cfg.waterDepth / 2
    return Array.from({ length: 30 }, () => ({
      x: (Math.random() - 0.5) * cfg.waterWidth * 0.95,
      z: z0 - 0.5 - Math.random() * 5,
      h: 0.9 + Math.random() * 1.3,
      tilt: (Math.random() - 0.5) * 0.3,
      rot: Math.random() * Math.PI,
    }))
  }, [cfg])

  const grasses = useMemo(() => {
    const z0 = -cfg.waterDepth / 2
    return Array.from({ length: 46 }, () => ({
      x: (Math.random() - 0.5) * cfg.waterWidth * 1.05,
      z: z0 - 1 - Math.random() * 10,
      h: 0.3 + Math.random() * 0.7,
      rot: Math.random() * Math.PI * 2,
      lean: (Math.random() - 0.5) * 0.5,
    }))
  }, [cfg])

  return (
    <group>
      {lilies.map((p, i) => (
        <Clone
          key={`lily-${i}`}
          object={lotus.scene}
          position={[p.x, p.y, p.z]}
          rotation={[0, p.rot, 0]}
          scale={p.s}
        />
      ))}

      {reeds.map((r, i) => (
        <mesh key={`reed-${i}`} position={[r.x, r.h / 2, r.z]} rotation={[r.tilt, r.rot, r.tilt]}>
          <cylinderGeometry args={[0.012, 0.03, r.h, 5]} />
          <meshStandardMaterial color={STEM} roughness={0.94} />
        </mesh>
      ))}

      {grasses.map((g, i) => (
        <mesh key={`grass-${i}`} position={[g.x, g.h / 2, g.z]} rotation={[g.lean, g.rot, g.lean * 0.5]}>
          <boxGeometry args={[0.026, g.h, 0.008]} />
          <meshStandardMaterial color={GRASS} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}
