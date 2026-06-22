/**
 * R3F canvas wrapper — the lazy-loaded chunk so Three.js for the pond never
 * blocks first paint. Default export for React.lazy().
 */
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { KoiConfig } from './koiConfig'
import { PondScene } from './PondScene'

// Warm the model cache as soon as this chunk loads (it is itself lazy).
useGLTF.preload('/pond/koi.glb')
useGLTF.preload('/pond/lotus.glb')

type Props = {
  cfg: KoiConfig
  reduced?: boolean
  onFeed?: () => void
}

export default function PondCanvas({ cfg, reduced, onFeed }: Props) {
  const cameraPosition: [number, number, number] =
    cfg.cameraAngle === 'topdown' ? [0, 11, 0.001] : [0, 7.6, 5.6]

  return (
    <Canvas
      className="koi-canvas"
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: cameraPosition, fov: 42, near: 0.1, far: 100 }}
      onCreated={({ camera, scene }) => {
        camera.lookAt(0, 0, 0)
        scene.background = new THREE.Color(cfg.palette.sky)
      }}
    >
      <Suspense fallback={null}>
        <PondScene cfg={cfg} reduced={reduced} onFeed={onFeed} />
      </Suspense>
    </Canvas>
  )
}
