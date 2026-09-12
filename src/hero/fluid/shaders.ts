// GLSL (ES 1.0) shaders for the Stable Fluids solver + glass composite.
// Each pass is a full-screen quad; the base vertex shader precomputes
// neighbouring texel coordinates for the finite-difference passes.

export const baseVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;

  void main () {
    vUv = uv;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

// Inject a soft Gaussian blob of `color` into `uTarget` at `point`.
// `density` is added to the alpha channel: 1 for ink (so .a tracks how much ink
// is present), 0 for velocity (whose alpha is never read).
export const splatFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform float density;
  uniform vec2 point;
  uniform float radius;

  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    float g = exp(-dot(p, p) / radius);
    vec4 base = texture2D(uTarget, vUv);
    gl_FragColor = vec4(base.rgb + g * color, base.a + g * density);
  }
`

// Semi-Lagrangian advection with dissipation (bilinear filtered).
export const advectionFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;

  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`

export const divergenceFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`

export const curlFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`

export const vorticityFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;

  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;

    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;

    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

export const pressureFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`

export const gradientSubtractFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;

  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

// Decay pass (used to slowly relax pressure between frames).
export const clearFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;

  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`

// Final composite: ink-in-water beneath a glossy, slightly refractive
// glass sheet. Builds a fake surface normal from the dye gradient for
// refraction, Fresnel reflection and a moving specular highlight.
export const displayFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uDye;
  uniform vec2 texelSize;
  uniform vec3 waterColor;
  uniform vec3 glassColor;
  uniform float reflectivity;
  uniform float fresnelPower;
  uniform float sheen;
  uniform float refraction;
  uniform vec2 light;

  // The dye texture stores .rgb = sum of (ink colour x amount) and .a = total
  // amount. So .rgb / .a is the true, averaged ink colour at this point — dark
  // inks stay dark and overlapping inks still blend in proportion. (The old
  // "divide by the brightest channel" trick threw luminance away, which is why
  // Sumi, a near-black, rendered as cream-white.)
  // Both constants below are calibrated so Beni, the default ink, blooms and
  // lifts the glass exactly as it did before.
  const float INK_HEIGHT = 0.16;
  const float INK_COVERAGE = 0.45;

  float height (vec2 uv) {
    return texture2D(uDye, uv).a * INK_HEIGHT;
  }

  void main () {
    // Surface normal from the gradient of ink density (ink "lifts" the surface).
    float lC = height(vUv);
    float lR = height(vUv + vec2(texelSize.x, 0.0));
    float lT = height(vUv + vec2(0.0, texelSize.y));
    float dx = lR - lC;
    float dy = lT - lC;
    vec3 normal = normalize(vec3(-dx, -dy, 0.18));

    // Refraction: sample the ink slightly offset along the surface slope.
    vec2 refr = normal.xy * refraction * 0.12;
    vec4 dye = max(texture2D(uDye, vUv + refr), 0.0);

    // Ink color blends into clear water by accumulated amount.
    float amt = clamp(dye.a * INK_COVERAGE, 0.0, 1.4);
    vec3 inkColor = dye.a > 1e-4 ? clamp(dye.rgb / dye.a, 0.0, 1.0) : vec3(0.0);
    vec3 col = mix(waterColor, inkColor, smoothstep(0.0, 0.55, amt));

    // Glass: Fresnel reflection toward the viewer (z-up normal).
    // NB: clamp the pow base above 0 — pow(0.0, y) is undefined in GLSL and
    // resolves to NaN on some drivers (exp2(y*log2(0))), which would blacken
    // every flat pixel as the NaN propagates through the composite.
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float fresBase = max(1.0 - max(dot(normal, viewDir), 0.0), 1e-4);
    float fres = pow(fresBase, fresnelPower);
    col = mix(col, glassColor, fres * reflectivity);

    // Moving specular highlight (the gloss on the sheet).
    vec3 lightDir = normalize(vec3(light - vUv, 0.55));
    vec3 refl = reflect(-lightDir, normal);
    float spec = pow(max(dot(refl, viewDir), 1e-4), 48.0);
    col += spec * sheen * glassColor;

    // Soft top-down sheen + gentle vignette for depth.
    col += sheen * 0.06 * (1.0 - vUv.y) * glassColor;
    float vig = 1.0 - smoothstep(0.35, 1.25, length(vUv - 0.5));
    col *= mix(0.9, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`
