/**
 * Pond visuals: koi geometry, animated water surface, ripple rings.
 * Golden-hour garden pond — clear teal water, not abyss-black.
 */
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import type { KoiConfig } from './koiConfig'

/** Koi silhouette: smooth tapered body, flat forked tail, low fins. Faces +Z. */
export function createFishGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = []

  // Body — elongated, gently flattened torpedo that tapers toward the tail.
  const body = new THREE.SphereGeometry(0.2, 24, 16)
  const bp = body.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < bp.count; i++) {
    const z = bp.getZ(i)
    // taper: narrower toward the tail (-z), fuller at the head (+z)
    const taper = THREE.MathUtils.lerp(0.55, 1.0, (z + 0.2) / 0.4)
    bp.setX(i, bp.getX(i) * 0.46 * taper)
    bp.setY(i, bp.getY(i) * 0.34 * taper)
    bp.setZ(i, z * 1.35)
  }
  body.computeVertexNormals()
  parts.push(body)

  // Caudal fin — a flat, forked tail (two thin blades).
  const makeBlade = (rot: number, off: number) => {
    const blade = new THREE.ConeGeometry(0.13, 0.34, 5)
    blade.scale(1.0, 0.22, 1.0) // flatten vertically into a fin
    blade.rotateX(-Math.PI / 2)
    blade.rotateZ(rot)
    blade.translate(off, 0.02, -0.4)
    return blade
  }
  parts.push(makeBlade(0.42, -0.05))
  parts.push(makeBlade(-0.42, 0.05))

  // Dorsal fin — low, soft ridge.
  const dorsal = new THREE.ConeGeometry(0.06, 0.16, 4)
  dorsal.scale(0.5, 1, 1.7)
  dorsal.translate(0, 0.12, 0.0)
  parts.push(dorsal)

  // Pectoral fins — small flat paddles.
  const pec = new THREE.ConeGeometry(0.06, 0.16, 4)
  pec.scale(1, 0.18, 1)
  const pecL = pec.clone()
  pecL.rotateZ(0.5)
  pecL.rotateX(-Math.PI / 2)
  pecL.translate(-0.13, -0.03, 0.08)
  parts.push(pecL)
  const pecR = pec.clone()
  pecR.rotateZ(-0.5)
  pecR.rotateX(-Math.PI / 2)
  pecR.translate(0.13, -0.03, 0.08)
  parts.push(pecR)

  const merged = mergeGeometries(parts, false)
  merged.computeVertexNormals()
  return merged
}

/**
 * Clear pond water: visibly *floating* surface (animated waves → real normals),
 * flowing caustics, a warm golden-hour sky reflection (fresnel) and moving sun
 * glints. Lit from analytic wave normals so it reads as water, never a flat void.
 */
export function makeWaterMaterial(cfg: KoiConfig): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uRadius: { value: cfg.waterWidth * 0.3 },
      uDeep: { value: new THREE.Color(cfg.palette.deep) },
      uShallow: { value: new THREE.Color(cfg.palette.shallow) },
      uSurface: { value: new THREE.Color(cfg.palette.surface) },
      uCaustic: { value: new THREE.Color(cfg.palette.caustic) },
      uHorizon: { value: new THREE.Color(cfg.palette.horizon) },
      uSun: { value: new THREE.Color(cfg.palette.light) },
      uCaustics: { value: cfg.caustics ? 1 : 0 },
    },
    vertexShader: /* glsl */ `
      uniform float uTime;
      varying vec2 vP;
      varying vec3 vWorld;
      varying vec3 vNormalW;

      float waveH(vec2 p, float t) {
        return sin(p.x * 0.7 + t * 0.8) * 0.042
             + sin(p.y * 0.9 - t * 0.65) * 0.034
             + sin((p.x + p.y) * 0.55 + t * 1.1) * 0.024;
      }

      void main() {
        vec3 pos = position;
        float t = uTime;
        pos.z += waveH(pos.xy, t);

        // Analytic surface normal from the wave field → proper lighting.
        float e = 0.18;
        float hx = waveH(pos.xy + vec2(e, 0.0), t) - waveH(pos.xy - vec2(e, 0.0), t);
        float hy = waveH(pos.xy + vec2(0.0, e), t) - waveH(pos.xy - vec2(0.0, e), t);
        vec3 n = normalize(vec3(-hx / (2.0 * e), -hy / (2.0 * e), 1.0));
        vNormalW = normalize(mat3(modelMatrix) * n);

        vec4 wp = modelMatrix * vec4(pos, 1.0);
        vWorld = wp.xyz;
        vP = pos.xy;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform float uRadius;
      uniform vec3 uDeep;
      uniform vec3 uShallow;
      uniform vec3 uSurface;
      uniform vec3 uCaustic;
      uniform vec3 uHorizon;
      uniform vec3 uSun;
      uniform float uCaustics;
      varying vec2 vP;
      varying vec3 vWorld;
      varying vec3 vNormalW;

      float caustic(vec2 p) {
        float t = uTime * 0.3;
        vec2 q = p * 1.9;
        return sin(q.x + t) + sin(q.y - t * 1.05)
             + sin((q.x + q.y) * 0.7 + t * 1.2)
             + sin(length(q) * 1.4 - t);
      }

      void main() {
        vec3 N = normalize(vNormalW);
        vec3 V = normalize(cameraPosition - vWorld);
        vec3 L = normalize(vec3(0.4, 0.9, 0.25));

        float d = length(vP) / max(uRadius, 0.001);
        vec3 water = mix(uShallow, uDeep, smoothstep(0.0, 1.0, d));
        water = mix(water, uSurface, 0.16);

        // Flowing caustic shimmer through the clear water.
        float c = caustic(vP);
        c = smoothstep(0.7, 2.4, c) * uCaustics;
        water += uCaustic * c * 0.16;

        // Fresnel sky reflection — warm golden horizon at grazing angles (subtle,
        // so it doesn't read as drifting yellow blobs).
        float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        vec3 col = mix(water, uHorizon, fres * 0.4);

        // Moving sun glints — gentle surface sparkle.
        vec3 H = normalize(L + V);
        float spec = pow(max(dot(N, H), 0.0), 150.0);
        col += uSun * spec * 0.7;

        // Gentle diffuse shaping so ripples catch light.
        col *= 0.72 + 0.28 * max(dot(N, L), 0.0);

        gl_FragColor = vec4(col, 0.94);
      }
    `,
  })
}

/** Sandy pond floor — visible through the water for depth. */
export function makePondFloorMaterial(cfg: KoiConfig): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: cfg.palette.floor,
    roughness: 0.95,
    metalness: 0,
  })
}

export function createRippleGeometry(maxRipples: number): THREE.InstancedBufferGeometry {
  const ring = new THREE.RingGeometry(0.68, 1.0, 56) // thicker ring → reads stronger
  ring.rotateX(-Math.PI / 2)

  const geo = new THREE.InstancedBufferGeometry()
  geo.index = ring.index
  geo.attributes = ring.attributes
  geo.instanceCount = maxRipples
  geo.setAttribute(
    'aProgress',
    new THREE.InstancedBufferAttribute(new Float32Array(maxRipples).fill(1), 1),
  )
  return geo
}

export function makeRippleMaterial(cfg: KoiConfig): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color(cfg.palette.caustic) },
      uIntensity: { value: cfg.rippleIntensity },
      uMaxRadius: { value: 2.4 },
    },
    vertexShader: /* glsl */ `
      attribute float aProgress;
      uniform float uMaxRadius;
      varying float vAlpha;
      void main() {
        float p = clamp(aProgress, 0.0, 1.0);
        float radius = 0.3 + p * uMaxRadius;
        vec3 pos = position * radius;
        vAlpha = smoothstep(0.0, 0.06, p) * (1.0 - p) * 1.35;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying float vAlpha;
      void main() {
        if (vAlpha <= 0.001) discard;
        gl_FragColor = vec4(uColor, vAlpha * uIntensity);
      }
    `,
  })
}
