/**
 * Neon Wireframe Shader - 4D Audio-Reactive
 */

export const neonWireframeVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uNeonIntensity;
  uniform float uColorShift;
  uniform float uGlitchIntensity;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vGlitch;
  varying float vNoise;
  
  // 4D Noise für Time-Warp Effekte
  float noise4D(vec4 p) {
    return fract(sin(dot(p, vec4(12.9898, 78.233, 45.164, 94.673))) * 43758.5453);
  }
  
  vec3 glitchPosition(vec3 pos, float time, float intensity) {
    vec4 p4d = vec4(pos, time * 0.1);
    float n = noise4D(p4d);
    
    vec3 glitch = vec3(
      sin(time * 10.0 + pos.y * 5.0) * intensity,
      cos(time * 7.0 + pos.x * 3.0) * intensity,
      noise4D(p4d + 100.0) * intensity
    );
    
    return pos + glitch * n;
  }
  
  void main() {
    vPosition = position;
    vNormal = normal;
    
    // Audio-reactive Glitch
    vGlitch = uGlitchIntensity;
    vNoise = noise4D(vec4(position, uTime));
    
    // Position mit 4D-Glitch-Effekt
    vec3 glitchedPos = glitchPosition(position, uTime, uGlitchIntensity * 0.1);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(glitchedPos, 1.0);
  }
`;

export const neonWireframeFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uNeonIntensity;
  uniform float uColorShift;
  uniform float uGlitchIntensity;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying float vGlitch;
  varying float vNoise;
  
  // HSV zu RGB Konvertierung
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  // Neon-Glow Effekt
  float neonGlow(vec3 pos, float intensity) {
    float glow = 1.0 - length(pos * 2.0);
    glow = pow(glow, 3.0) * intensity;
    return glow;
  }
  
  // 4D-basierte Farb-Modulation
  vec3 audioColorShift(vec3 baseColor, float shift, float time) {
    float hue = shift + time * 0.1;
    vec3 hsv = vec3(hue, 0.8, 1.0);
    return hsv2rgb(hsv) * baseColor;
  }
  
  void main() {
    // Basis-Neon-Farbe (Cyan-Magenta)
    vec3 neonColor = vec3(0.0, 1.0, 1.0);
    
    // Audio-reaktive Farbverschiebung
    neonColor = audioColorShift(neonColor, uColorShift, uTime);
    
    // Wireframe-Effekt durch Barycentric Coordinates simulieren
    vec3 wireframe = abs(vNormal);
    float wireStrength = min(min(wireframe.x, wireframe.y), wireframe.z);
    wireStrength = 1.0 - smoothstep(0.0, 0.05, wireStrength);
    
    // Neon-Glow
    float glow = neonGlow(vPosition, uNeonIntensity);
    
    // Glitch-Effekt
    float glitchNoise = vNoise * vGlitch;
    vec3 glitchColor = vec3(1.0, 0.1, 0.8) * glitchNoise;
    
    // Finale Farbe
    vec3 finalColor = neonColor * wireStrength * (1.0 + glow) + glitchColor;
    
    // Emission für Bloom-Effekt
    gl_FragColor = vec4(finalColor, wireStrength * 0.8 + glow * 0.2);
  }
`;
