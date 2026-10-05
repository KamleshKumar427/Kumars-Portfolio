// GLSL (ES 1.0) shaders for the Stable Fluids solver + the ink-in-water composite.
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

// Inject ink (or momentum) along the segment the pointer travelled since its
// last event, laid down the way a brush moving at a steady rate would.
// Across the stroke the profile is Gaussian. Along it, each segment ramps in
// and out with an erf profile — the exact integral of a Gaussian slid along a
// line — so consecutive segments sum to one perfectly even band. (A capsule
// per segment, rounded at both ends, inked every joint twice: a darker knot at
// each pointer event, and faint ribs across slower strokes.)
// A tap (`isPoint`) has no length to integrate over, so it drops a round blob.
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
  uniform vec2 prevPoint;
  uniform float radius;
  uniform float isPoint;

  // GLSL ES 1.0 has no erf. Winitzki's approximation, |error| < 1.3e-4.
  float erfApprox (float x) {
    float x2 = x * x;
    float t = exp(-x2 * (1.2732395 + 0.147 * x2) / (1.0 + 0.147 * x2));
    return sign(x) * sqrt(max(1.0 - t, 0.0));
  }

  void main () {
    // Work in an aspect-corrected space so the stroke is round in pixels.
    vec2 asp = vec2(aspectRatio, 1.0);
    vec2 p = vUv * asp;
    vec2 a = prevPoint * asp;
    vec2 b = point * asp;
    float g;
    float len = length(b - a);
    if (isPoint > 0.5 || len < 1e-6) {
      vec2 d = p - b;
      g = exp(-dot(d, d) / radius);
    } else {
      float sigma = sqrt(radius);
      vec2 u = (b - a) / len;
      vec2 ap = p - a;
      float along = dot(ap, u);
      float across2 = max(dot(ap, ap) - along * along, 0.0);
      g = exp(-across2 / radius)
        * 0.5 * (erfApprox(along / sigma) - erfApprox((along - len) / sigma));
    }
    vec4 base = texture2D(uTarget, vUv);
    gl_FragColor = vec4(base.rgb + g * color, base.a + g * density);
  }
`

// Semi-Lagrangian advection with dissipation (bilinear filtered).
// For the surface ink, `release` is the share per second that starts sinking
// into the water below (see volumeFragment, which receives exactly this), and
// `swirlRelease` adds more where the water spins. Both are 0 for velocity.
export const advectionFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform sampler2D uCurl;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  uniform float release;
  uniform float swirlRelease;
  uniform float swirlRef;

  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    float c = abs(texture2D(uCurl, coord).x);
    float leave = (release + swirlRelease * c / (c + swirlRef)) * dt;
    gl_FragColor = result / decay * exp(-leave);
  }
`

// The water below the surface, as a stack of layers (a 3D texture: one layer
// per depth, surface to paper). Ink released from the surface enters the top
// layer, settles down through the stack, and comes to rest on the paper.
// Run once per layer per step. Three things move it:
// - The flow, fading with depth: the surface drives the water, and deeper
//   water barely feels it — so sunk ink drifts slower than the ink above it.
// - Settling: ink is a little heavier than water, so it sinks on its own.
// - Swirls: a spinning vortex pulls water down its core (a whirlpool's dip is
//   the top of that), so strokes that curl drain into the depth faster.
// Ink moves down one layer at a time (an upwind flux), so it's conserved and
// spreads a little as it goes, the way a sinking cloud of ink does.
export const volumeFragment = /* glsl */ `
  precision highp float;
  precision highp sampler3D;
  varying vec2 vUv;
  uniform sampler3D uVolume;
  uniform sampler2D uSurface;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform vec2 velocityTexel;
  uniform vec2 surfaceTexel;
  uniform float layer;       // this layer's index, 0 = just under the surface
  uniform float layers;
  uniform float thickness;   // of one layer, in hero heights
  uniform float dt;
  uniform float dissipation;
  uniform float drag;        // depth over which the flow fades (e-fold)
  uniform float settle;      // sinking speed on its own, hero heights / s
  uniform float swirlPull;   // extra sinking speed in a full swirl
  uniform float swirlRef;    // swirl strength at which the pull is half its full
  uniform float release;     // must match the surface's advection
  uniform float swirlRelease;

  float swirl (vec2 uv) {
    float c = abs(texture2D(uCurl, uv).x);
    return c / (c + swirlRef);
  }

  // Share of a layer at depth z that moves to the layer below in this step.
  float sinkShare (float z, float s) {
    return clamp((settle + swirlPull * s * exp(-z / drag)) * dt / thickness, 0.0, 0.5);
  }

  void main () {
    float w = (layer + 0.5) / layers;
    float z = (layer + 0.5) * thickness;
    vec2 flow = texture2D(uVelocity, vUv).xy * exp(-z / drag);
    vec2 coord = vUv - dt * flow * velocityTexel;
    float s = swirl(coord);

    vec4 here = texture(uVolume, vec3(coord, w));
    // The bottom layer lies on the paper: what lands there stays.
    float leaving = layer < layers - 1.5 ? sinkShare(z, s) : 0.0;
    vec4 result = here * (1.0 - leaving);

    if (layer > 0.5) {
      float wa = (layer - 0.5) / layers;
      result += texture(uVolume, vec3(coord, wa)) * sinkShare(z - thickness, s);
    } else {
      // The top layer is fed by the surface. It is coarser than the surface
      // ink, so average the patch of surface this texel covers.
      vec2 e = surfaceTexel;
      vec4 surf = 0.25 * (texture2D(uSurface, coord + e * vec2(-1.0, -1.0))
                        + texture2D(uSurface, coord + e * vec2( 1.0, -1.0))
                        + texture2D(uSurface, coord + e * vec2(-1.0,  1.0))
                        + texture2D(uSurface, coord + e * vec2( 1.0,  1.0)));
      float leave = (release + swirlRelease * s) * dt;
      result += surf * (1.0 - exp(-leave));
    }
    gl_FragColor = result / (1.0 + dissipation * dt);
  }
`

// Copy (and scale) one layer of the water — for fades, the clear-colour wash,
// and carrying the sunk ink across a resize.
export const layerCopyFragment = /* glsl */ `
  precision highp float;
  precision highp sampler3D;
  varying vec2 vUv;
  uniform sampler3D uVolume;
  uniform float w;
  uniform float value;

  void main () {
    gl_FragColor = value * texture(uVolume, vec3(vUv, w));
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

// Final composite. The scene it draws: ink floating at the surface of clear
// water, more ink sinking through the water below it, and the paper lying at
// the bottom.
//
// Each pixel is a point on the water surface. A ray from a virtual eye above
// the hero passes through that point, bends as it enters the water (bending
// more where the moving surface tilts), and travels down to the paper. That is
// the patch of paper you see through the ink — so the paper sits visibly
// deeper, and when the eye moves (pointer, scroll) the paper and the shadows
// on it slide against the ink above, the way the bottom of a pond does when
// you move your head.
//
// Light mode: light from the upper left enters the surface, passes down
// through whatever ink it crosses, and lands on the paper. So the ink casts a
// soft coloured shadow — offset, blurred, and displaced as the eye moves,
// because it really is falling a depth away — and that light is reflected back
// up to the eye through the ink over this pixel. That double pass is what
// makes ink read as FLOATING: the shadow shows the gap between ink and paper.
// Sunk ink is found the same way: the view ray crosses every layer of the
// water on its way down, and picks up the ink in each where it crosses it. So
// ink that has sunk sits closer to the vanishing point, drifts less as the eye
// moves, and hazes into the water with depth; its shadow draws in under it as
// it nears the paper.
// Dark mode: the water is dark, so ink is seen by the light it scatters back
// rather than what it blocks; it is drawn as its own colour over the water,
// with the same Beer-Lambert falloff for how solid it looks. A faint glow of
// that scattered light reaches the paper below, and does the shadow's job.
export const displayFragment = /* glsl */ `
  precision highp float;
  precision highp sampler3D;
  varying vec2 vUv;
  uniform sampler2D uDye;
  uniform vec3 waterColor;
  uniform float aspectRatio;
  uniform float darkMode;
  uniform float inkDepth;
  uniform float thicknessCap;
  uniform vec2 faintInk;
  uniform float shadowBlur;
  uniform float shadowStrength;
  uniform float shadowNeutral;
  uniform float shadowFill;
  uniform float darkCoverage;
  uniform float darkGlow;
  uniform sampler2D uPressure;
  uniform vec2 pressureTexel;
  uniform float surfaceHeight;
  uniform float refraction;
  uniform float wobble;
  uniform float caustics;
  uniform float glint;
  uniform vec3 glintColor;
  // Depth — lengths in hero heights.
  uniform vec3 eye;          // xy: over which point of the hero (uv); z: height
  uniform float floorDepth;  // water surface to paper
  uniform vec3 keyLight;     // unit vector toward the light
  // The water below the surface: LAYERS layers, surface to paper.
  uniform sampler3D uVolume;
  uniform float haze;        // how fast sunk ink fades into the water, per hero height
  uniform float sunkCover;   // dark mode: how solid sunk ink looks, vs surface ink

  vec3 toLinear (vec3 c) { return pow(max(c, 0.0), vec3(2.2)); }
  vec3 toSRGB (vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }

  // Rays that look in from the edge of the hero read the water beyond it,
  // which holds no ink. A plain texture read there would repeat the edge's
  // ink outward instead (clamp-to-edge) and draw it as a hard-edged block.
  float within (vec2 uv, float soft) {
    vec2 d = min(uv, 1.0 - uv);
    return smoothstep(-soft, soft, min(d.x, d.y));
  }

  // Optical depth at uv, with thick cores capped so they stay rich, not black.
  // The faintest ink — the soft Gaussian tail of every drop — is faded out
  // entirely. Rendered as dye it would show as a pink haze around each stroke,
  // widening it and filling the hero far faster than the ink actually spreads.
  float presence (float a) { return smoothstep(faintInk.x, faintInk.y, a); }

  vec3 opticalDepth (vec2 uv) {
    vec4 d = max(texture2D(uDye, uv), 0.0) * within(uv, 0.002);
    float cap = d.a > thicknessCap ? thicknessCap / d.a : 1.0;
    return d.rgb * inkDepth * cap * presence(d.a);
  }

  // Ink as seen on dark water: its own colour, as solid as its thickness.
  vec4 darkInk (vec2 uv) {
    vec4 d = max(texture2D(uDye, uv), 0.0) * within(uv, 0.002);
    vec3 ink = d.a > 1e-4 ? exp(-d.rgb / d.a) : vec3(0.0);
    float cover = (1.0 - exp(-min(d.a, thicknessCap) * darkCoverage)) * presence(d.a);
    return vec4(ink, cover);
  }

  // The same two readings for one layer of sunk ink. No faint-ink cutoff: sunk
  // ink is meant to be soft, and it's spread thin across layers. Near the sides
  // it fades out rather than stopping at a line: deep ink that has drifted to
  // the edge of the hero is seen at a slant, and a hard cut showed as a seam.
  vec4 sunkAt (vec2 uv, float w) { return max(texture(uVolume, vec3(uv, w)), 0.0) * within(uv, 0.03); }
  vec3 sunkDepth (vec4 d) {
    return d.rgb * inkDepth * (d.a > thicknessCap ? thicknessCap / d.a : 1.0);
  }
  vec4 sunkInk (vec4 d) {
    vec3 ink = d.a > 1e-4 ? exp(-d.rgb / d.a) : vec3(0.0);
    return vec4(ink, 1.0 - exp(-min(d.a, thicknessCap) * darkCoverage * sunkCover));
  }

  // The shadow is soft because the ink is a depth above the paper: average
  // the ink over a disc around the point the light came through.
  vec3 shadowDepth (vec2 uv) {
    vec2 r = vec2(shadowBlur / aspectRatio, shadowBlur);
    vec3 sum = opticalDepth(uv) * 0.2;
    sum += opticalDepth(uv + r * vec2( 1.0,  0.0)) * 0.1;
    sum += opticalDepth(uv + r * vec2(-1.0,  0.0)) * 0.1;
    sum += opticalDepth(uv + r * vec2( 0.0,  1.0)) * 0.1;
    sum += opticalDepth(uv + r * vec2( 0.0, -1.0)) * 0.1;
    sum += opticalDepth(uv + r * vec2( 0.7,  0.7)) * 0.1;
    sum += opticalDepth(uv + r * vec2(-0.7,  0.7)) * 0.1;
    sum += opticalDepth(uv + r * vec2( 0.7, -0.7)) * 0.1;
    sum += opticalDepth(uv + r * vec2(-0.7, -0.7)) * 0.1;
    return sum;
  }

  // Dark mode's counterpart: the ink's coloured light, spread the same way.
  vec3 glowLight (vec2 uv) {
    vec2 r = vec2(shadowBlur / aspectRatio, shadowBlur) * 1.6;
    vec4 c = darkInk(uv);
    vec3 sum = c.rgb * c.a * 0.2;
    c = darkInk(uv + r * vec2( 1.0,  0.0)); sum += c.rgb * c.a * 0.1;
    c = darkInk(uv + r * vec2(-1.0,  0.0)); sum += c.rgb * c.a * 0.1;
    c = darkInk(uv + r * vec2( 0.0,  1.0)); sum += c.rgb * c.a * 0.1;
    c = darkInk(uv + r * vec2( 0.0, -1.0)); sum += c.rgb * c.a * 0.1;
    c = darkInk(uv + r * vec2( 0.7,  0.7)); sum += c.rgb * c.a * 0.1;
    c = darkInk(uv + r * vec2(-0.7,  0.7)); sum += c.rgb * c.a * 0.1;
    c = darkInk(uv + r * vec2( 0.7, -0.7)); sum += c.rgb * c.a * 0.1;
    c = darkInk(uv + r * vec2(-0.7, -0.7)); sum += c.rgb * c.a * 0.1;
    return sum;
  }

  // The water surface. Its height follows the flow's pressure: a spinning
  // vortex has low pressure at its core, so the surface dips there like a real
  // whirlpool. Still water has no pressure gradient, so the surface stays flat
  // and the calm page is untouched — only motion reveals the water.
  float surface (vec2 uv) { return texture2D(uPressure, uv).x * surfaceHeight; }

  // Curvature of the surface: a dip focuses the light passing through it onto
  // the paper (bright caustic), a crest spreads it. Positive = dip.
  float curvature (vec2 uv) {
    vec2 e = pressureTexel;
    return surface(uv - vec2(e.x, 0.0)) + surface(uv + vec2(e.x, 0.0))
         + surface(uv - vec2(0.0, e.y)) + surface(uv + vec2(0.0, e.y))
         - 4.0 * surface(uv);
  }

  // Real caustics concentrate light into bright lines and only slightly dim
  // the wide areas between them. A symmetric model painted grey smudges around
  // every wake, which read as dirty paper rather than moving water.
  float causticLight (float focus) {
    float bright = caustics * max(focus, 0.0);
    float dim = caustics * 0.3 * max(-focus, 0.0);
    return clamp(1.0 + bright - dim, 0.92, 1.4);
  }

  void main () {
    vec2 asp = vec2(aspectRatio, 1.0);

    // The surface at this pixel: its tilt bends the view and throws glints.
    vec2 e = pressureTexel;
    float hL = surface(vUv - vec2(e.x, 0.0));
    float hR = surface(vUv + vec2(e.x, 0.0));
    float hB = surface(vUv - vec2(0.0, e.y));
    float hT = surface(vUv + vec2(0.0, e.y));
    vec3 n = normalize(vec3(hL - hR, hB - hT, 1.0));

    // Follow the view down through the water to the paper. P is on the
    // surface, E is the eye, Q is the patch of paper seen through P.
    vec3 P = vec3(vUv * asp, 0.0);
    vec3 E = vec3(eye.xy * asp, eye.z);
    vec3 I = normalize(P - E);
    vec3 T = refract(I, normalize(vec3(n.xy * wobble, 1.0)), 0.75);
    vec2 Q = P.xy + T.xy * (floorDepth / max(-T.z, 1e-4));

    // The light that lands on Q entered the water at X, up the light ray.
    // Whatever ink it crossed there shades Q; the surface's curve there
    // focuses it into caustics.
    vec2 lightSlope = keyLight.xy / keyLight.z;
    vec2 uvX = (Q + lightSlope * floorDepth) / asp;
    float focusLight = causticLight(curvature(uvX));

    vec3 water = toLinear(waterColor);
    vec2 uvInk = vUv + n.xy * refraction;
    vec3 col;

    // Sunk ink, read where the view ray crosses each layer (what you see
    // through the water), then where the light crossed the layers on its way
    // down to Q (what shades the paper there).
    vec2 viewSlope = T.xy / max(-T.z, 1e-4);
    vec3 viewDepth = vec3(0.0);  // light mode: optical depth along the view
    vec3 lightDepth = vec3(0.0); // ... and along the light
    vec3 seen = vec3(0.0);       // dark mode: sunk ink's colour, front to back
    float open = 1.0;            // dark mode: share still showing through
    vec3 sunkGlow = vec3(0.0);   // dark mode: its light reaching the paper
    for (int k = 0; k < LAYERS; k++) {
      float w = (float(k) + 0.5) / float(LAYERS);
      float z = w * floorDepth;
      float fog = exp(-haze * z);
      vec4 v = sunkAt((P.xy + viewSlope * z) / asp, w);
      if (darkMode < 0.5) {
        viewDepth += sunkDepth(v) * fog;
      } else {
        vec4 a = sunkInk(v);
        seen += open * a.a * mix(water, a.rgb, fog);
        open *= 1.0 - a.a;
      }
    }
    // The light's path only makes a soft shadow, so it reads the layers two at
    // a time: a read halfway between two layers returns their average.
    for (int k = 0; k < LAYERS; k += 2) {
      float w = (float(k) + 1.0) / float(LAYERS);
      vec4 l = sunkAt((Q + lightSlope * (floorDepth - w * floorDepth)) / asp, w) * 2.0;
      if (darkMode < 0.5) {
        lightDepth += sunkDepth(l);
      } else {
        vec4 b = sunkInk(l);
        sunkGlow += b.rgb * b.a;
      }
    }

    if (darkMode < 0.5) {
      vec3 shade = (shadowDepth(uvX) + lightDepth) * shadowStrength;
      // A shadow tinted exactly like the ink beside it reads as MORE INK, not
      // as a shadow — on red it just thickens the stroke. Real shadows under
      // suspended dye are mostly grey with a hint of colour, and that grey
      // offset is what the eye takes as the gap between ink and paper.
      float grey = (shade.r + shade.g + shade.b) / 3.0;
      vec3 through = mix(exp(-shade), vec3(exp(-grey)), shadowNeutral);
      // Only the direct light is blocked; light from the rest of the sky still
      // reaches the paper, so even thick ink never throws a black shadow — a
      // dark one a depth away read as a blurry second stroke.
      vec3 paper = water * mix(through, vec3(1.0), shadowFill) * focusLight;
      col = paper * exp(-viewDepth) * exp(-opticalDepth(uvInk));
    } else {
      vec3 paper = water * focusLight + darkGlow * (glowLight(uvX) + sunkGlow);
      vec4 ink = darkInk(uvInk);
      col = mix(seen + open * paper, ink.rgb, ink.a);
    }

    // Glint: the light reflecting off the surface toward the viewer. The light
    // sits low enough that a FLAT surface reflects it away from you — only a
    // tilted ripple catches it, so glints appear where the water moves. (Taken
    // as seen from straight above: from the leaning eye, still water mirrored
    // the light as a pale smudge in one corner.)
    vec3 L = normalize(vec3(-0.45, 0.55, 0.7));
    float spec = pow(max(reflect(-L, n).z, 0.0), 90.0);
    col += glint * spec * toLinear(glintColor);

    gl_FragColor = vec4(toSRGB(col), 1.0);
  }
`
