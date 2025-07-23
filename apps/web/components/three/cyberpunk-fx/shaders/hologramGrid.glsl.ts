/**
 * Hologram Grid Shader - 4D Audio-Reactive Raster-System
 */

export const hologramGridVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uFlowSpeed;
  uniform float uGlitchIntensity;
  
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vNoise;
  varying float vWave;
  
  // 4D Simplex Noise
  vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
  }
  
  float snoise4D(vec4 v) {
    const vec2 C = vec2(0.138196601125010504, 0.309016994374947451);
    vec4 i = floor(v + dot(v, vec4(0.309016994374947451)));
    vec4 x0 = v - i + dot(i, C.xxxx);
    
    vec4 i0;
    vec3 isX = step(x0.yzw, x0.xxx);
    vec3 isYZ = step(x0.zww, x0.yyz);
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;
    
    vec4 i3 = clamp(i0, 0.0, 1.0);
    vec4 i2 = clamp(i0-1.0, 0.0, 1.0);
    vec4 i1 = clamp(i0-2.0, 0.0, 1.0);
    
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + 2.0*C.xxxx;
    vec4 x3 = x0 - i3 + 3.0*C.xxxx;
    vec4 x4 = x0 - 1.0 + 4.0*C.xxxx;
    
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p.xyz,x0.xyz), dot(p.yzw,x1.xyz), dot(p.zwx,x2.xyz), dot(p.wxy,x3.xyz)));
  }
  
  void main() {
    vPosition = position;
    vUv = uv;
    
    // 4D-Noise für Hologramm-Störungen
    vec4 pos4D = vec4(position * 0.5, uTime * uFlowSpeed);
    vNoise = snoise4D(pos4D) * 0.5 + 0.5;
    
    // Hologramm-Wellen
    vWave = sin(position.y * 10.0 + uTime * 5.0) * 0.1;
    
    // Glitch-Verzerrung
    vec3 glitchedPos = position;
    if(uGlitchIntensity > 0.1) {
      glitchedPos.x += sin(uTime * 20.0 + position.y * 15.0) * uGlitchIntensity * 0.02;
      glitchedPos.y += vNoise * uGlitchIntensity * 0.05;
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(glitchedPos, 1.0);
  }
`;

export const hologramGridFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uNeonIntensity;
  uniform float uColorShift;
  uniform float uFlowSpeed;
  
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vNoise;
  varying float vWave;
  
  // Grid-Pattern Generator
  float gridPattern(vec2 uv, float scale, float thickness) {
    vec2 grid = abs(fract(uv * scale) - 0.5) / fwidth(uv * scale);
    float line = min(grid.x, grid.y);
    return 1.0 - min(line, 1.0) * thickness;
  }
  
  // Hologramm-Scanlines
  float scanLines(vec2 uv, float frequency) {
    float scanline = sin(uv.y * frequency + uTime * 10.0);
    return scanline * 0.04 + 0.96;
  }
  
  // HSV zu RGB
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  // Hologramm-Flimmern
  float hologramFlicker(float time, float noise) {
    float flicker = sin(time * 50.0) * 0.02;
    flicker += sin(time * 23.7) * 0.03;
    flicker += noise * 0.1;
    return 1.0 + flicker;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Multi-Scale Grid
    float grid1 = gridPattern(uv, 20.0, 0.8);
    float grid2 = gridPattern(uv, 5.0, 0.5);
    float mainGrid = max(grid1, grid2);
    
    // Bewegendes Detail-Grid
    vec2 flowUv = uv + vec2(sin(uTime * uFlowSpeed), cos(uTime * uFlowSpeed * 0.7)) * 0.1;
    float detailGrid = gridPattern(flowUv, 40.0, 0.3);
    
    // Hologramm-Basis-Farbe
    vec3 hologramColor = vec3(0.1, 1.0, 0.8); // Cyan-Grün
    
    // Audio-reaktive Farbverschiebung
    float hue = uColorShift + uTime * 0.05;
    hologramColor = hsv2rgb(vec3(hue, 0.7, 1.0));
    
    // Scanlines
    float scanline = scanLines(uv, 200.0);
    
    // Hologramm-Flimmern
    float flicker = hologramFlicker(uTime, vNoise);
    
    // Distanz-basierte Transparenz
    float centerDist = length(uv - 0.5);
    float falloff = 1.0 - smoothstep(0.0, 0.7, centerDist);
    
    // Finale Grid-Kombination
    float finalGrid = mainGrid + detailGrid * 0.3;
    
    // Hologramm-Intensität
    float intensity = finalGrid * scanline * flicker * uNeonIntensity * falloff;
    
    // Emission für Bloom
    vec3 finalColor = hologramColor * intensity;
    float alpha = intensity * 0.6 + vNoise * 0.2;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
