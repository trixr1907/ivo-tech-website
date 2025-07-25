export const ArcadeVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const ArcadeFragmentShader = `
  uniform float time;
  uniform vec3 color;
  uniform float glowIntensity;
  uniform float scanlineIntensity;
  
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    // Scanline effect
    float scanline = sin(vUv.y * 200.0 + time) * 0.1 * scanlineIntensity;
    
    // Screen flicker
    float flicker = sin(time * 10.0) * 0.03 + 0.97;
    
    // Edge glow
    float fresnel = pow(1.0 + dot(normalize(vViewPosition), vNormal), 3.0);
    vec3 glow = color * glowIntensity * fresnel;
    
    // Combine effects
    vec3 finalColor = color * (1.0 + scanline) * flicker + glow;
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const CRTVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const CRTFragmentShader = `
  uniform float time;
  uniform sampler2D tDiffuse;
  varying vec2 vUv;

  void main() {
    // CRT curvature
    vec2 curvature = vec2(6.0, 4.0);
    vec2 uv = vUv * 2.0 - 1.0;
    vec2 offset = uv.xy / curvature;
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    
    // RGB split
    float shift = 0.002;
    vec4 tex = texture2D(tDiffuse, uv);
    vec4 texR = texture2D(tDiffuse, uv + vec2(shift, 0.0));
    vec4 texB = texture2D(tDiffuse, uv - vec2(shift, 0.0));
    
    // Vignette
    float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
    vignette = pow(vignette * 15.0, 0.25);
    
    // Static noise
    float noise = fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453);
    noise = noise * 0.05;
    
    // Combine effects
    vec4 finalColor;
    finalColor.r = texR.r;
    finalColor.g = tex.g;
    finalColor.b = texB.b;
    finalColor *= vignette;
    finalColor += noise;
    
    gl_FragColor = finalColor;
  }
`;
