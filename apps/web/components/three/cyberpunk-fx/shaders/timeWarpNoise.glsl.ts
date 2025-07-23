/**
 * Time-Warp Noise Shader - 4D Zeit-Verzerrung mit Audio-Reaktivität
 */

export const timeWarpNoiseVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uFlowSpeed;
  uniform float uGlitchIntensity;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vTimeWarp;
  varying vec4 vNoise4D;
  
  // 4D Simplex Noise Implementation
  vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
  }
  
  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise4D(vec4 v) {
    const vec4 C = vec4(0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
    
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
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;
    
    i = mod289(i);
    vec4 p = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x);
    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p, x0), dot(p, x1), dot(p, x2), dot(p, x3)));
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  // 4D Time-Warp Distortion
  vec3 timeWarpDistortion(vec3 pos, float time, float intensity) {
    // Multi-dimensional noise sampling
    vec4 p1 = vec4(pos * 0.5, time * 0.3);
    vec4 p2 = vec4(pos * 1.2, time * 0.7);
    vec4 p3 = vec4(pos * 2.1, time * 1.1);
    
    float n1 = snoise4D(p1);
    float n2 = snoise4D(p2);
    float n3 = snoise4D(p3);
    
    // Turbulenz-basierte Verzerrung
    vec3 warp = vec3(
      n1 * sin(time + pos.y * 2.0),
      n2 * cos(time * 1.3 + pos.x * 1.8),
      n3 * sin(time * 0.8 + pos.z * 2.5)
    ) * intensity;
    
    return pos + warp;
  }
  
  void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;
    
    // 4D-Noise Sampling für verschiedene Zeit-Dimensionen
    vec4 pos4D = vec4(position, uTime * uFlowSpeed);
    vNoise4D = vec4(
      snoise4D(pos4D),
      snoise4D(pos4D + vec4(100.0, 0.0, 0.0, 0.0)),
      snoise4D(pos4D + vec4(0.0, 100.0, 0.0, 0.0)),
      snoise4D(pos4D + vec4(0.0, 0.0, 100.0, 0.0))
    );
    
    // Time-Warp Parameter
    vTimeWarp = length(vNoise4D.xyz);
    
    // Position mit Time-Warp Distortion
    vec3 warpedPos = timeWarpDistortion(position, uTime, uGlitchIntensity);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(warpedPos, 1.0);
  }
`;

export const timeWarpNoiseFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uNeonIntensity;
  uniform float uColorShift;
  uniform float uFlowSpeed;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vTimeWarp;
  varying vec4 vNoise4D;
  
  // HSV zu RGB Konvertierung
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  // 4D-basierte Zeit-Farb-Modulation
  vec3 timeBasedColor(float time, vec4 noise4D, float colorShift) {
    // Mehrere Zeit-Dimensionen für Farbberechnung
    float timeHue1 = fract(time * 0.1 + noise4D.x);
    float timeHue2 = fract(time * 0.07 + noise4D.y);
    float timeHue3 = fract(time * 0.13 + noise4D.z);
    
    // Grundfarben-Mix
    vec3 color1 = hsv2rgb(vec3(timeHue1 + colorShift, 0.8, 1.0));
    vec3 color2 = hsv2rgb(vec3(timeHue2 + colorShift + 0.3, 0.9, 0.8));
    vec3 color3 = hsv2rgb(vec3(timeHue3 + colorShift + 0.6, 0.7, 0.9));
    
    // Noise-basiertes Blending
    float blend1 = noise4D.x * 0.5 + 0.5;
    float blend2 = noise4D.y * 0.5 + 0.5;
    
    vec3 mixedColor = mix(color1, color2, blend1);
    mixedColor = mix(mixedColor, color3, blend2);
    
    return mixedColor;
  }
  
  // Time-Warp Glow-Effekt
  float timeWarpGlow(float warpIntensity, float time) {
    float pulse = sin(time * 5.0) * 0.3 + 0.7;
    float warpGlow = pow(warpIntensity, 2.0) * pulse;
    return warpGlow;
  }
  
  // Fraktale Noise-Pattern
  float fractalPattern(vec2 uv, vec4 noise4D, float time) {
    float pattern = 0.0;
    float amplitude = 1.0;
    vec2 pos = uv;
    
    for(int i = 0; i < 4; i++) {
      pattern += sin(pos.x * 10.0 + time + noise4D.x * 6.28) * amplitude;
      pattern += cos(pos.y * 12.0 + time * 1.3 + noise4D.y * 6.28) * amplitude;
      pos *= 2.0;
      amplitude *= 0.5;
    }
    
    return pattern * 0.1;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Zeit-basierte Farbberechnung
    vec3 timeColor = timeBasedColor(uTime, vNoise4D, uColorShift);
    
    // Time-Warp Glow
    float glow = timeWarpGlow(vTimeWarp, uTime);
    
    // Fraktales Pattern
    float pattern = fractalPattern(uv, vNoise4D, uTime);
    
    // Noise-basierte Intensitäts-Modulation
    float noiseIntensity = length(vNoise4D.xyz) * 0.577; // Normalisierung für RGB
    
    // Finale Farbe
    vec3 finalColor = timeColor * (1.0 + glow) * uNeonIntensity;
    finalColor += pattern * 0.5;
    finalColor *= (0.7 + noiseIntensity * 0.6);
    
    // Zeit-basierte Alpha-Modulation
    float alpha = 0.8 + vTimeWarp * 0.4 + pattern * 0.2;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

/**
 * Audio-Reactive Color Shift Shader - Frequenz-basierte Farbverschiebung
 */

export const audioColorShiftVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFlowSpeed;
  
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vAudioReactive;
  
  void main() {
    vPosition = position;
    vUv = uv;
    
    // Audio-Reaktive Basis-Parameter
    vAudioReactive = sin(position.y * 5.0 + uTime * uFlowSpeed);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const audioColorShiftFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uNeonIntensity;
  uniform float uColorShift;
  
  // Audio-Daten Uniforms (werden vom SceneContext bereitgestellt)
  uniform float uAudioAmplitude;
  uniform float uAudioBass;
  uniform float uAudioMid;
  uniform float uAudioHigh;
  uniform sampler2D uAudioFrequency;
  
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vAudioReactive;
  
  // HSV zu RGB
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  // Frequenz-basierte Farbberechnung
  vec3 frequencyColor(vec2 uv, float bass, float mid, float high) {
    // Bass → Rot-Töne
    float bassHue = 0.0 + bass * 0.1;
    vec3 bassColor = hsv2rgb(vec3(bassHue, 0.9, bass + 0.3));
    
    // Mid → Grün-Töne  
    float midHue = 0.33 + mid * 0.1;
    vec3 midColor = hsv2rgb(vec3(midHue, 0.8, mid + 0.4));
    
    // High → Blau-Töne
    float highHue = 0.66 + high * 0.1;
    vec3 highColor = hsv2rgb(vec3(highHue, 0.7, high + 0.5));
    
    // Räumliche Mischung basierend auf UV-Koordinaten
    float bassWeight = smoothstep(0.0, 0.3, uv.y);
    float midWeight = smoothstep(0.3, 0.7, uv.y) * (1.0 - smoothstep(0.7, 1.0, uv.y));
    float highWeight = smoothstep(0.7, 1.0, uv.y);
    
    return bassColor * bassWeight + midColor * midWeight + highColor * highWeight;
  }
  
  // Spektrum-Visualisierung
  float audioSpectrum(vec2 uv, float frequency) {
    // Simuliere Spektrum-Display
    float spectrumX = uv.x;
    float spectrumHeight = frequency * 0.8;
    
    float spectrum = 1.0 - smoothstep(spectrumHeight - 0.02, spectrumHeight, uv.y);
    spectrum *= smoothstep(0.0, 0.02, uv.y);
    
    return spectrum;
  }
  
  // Beat-Detection Pulse
  float beatPulse(float amplitude, float time) {
    float beat = smoothstep(0.3, 0.8, amplitude);
    float pulse = sin(time * 20.0) * beat * 0.2 + 1.0;
    return pulse;
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Audio-Frequenz sampling (simuliert, da wir keine echte Textur haben)
    float bassFreq = uAudioBass;
    float midFreq = uAudioMid;
    float highFreq = uAudioHigh;
    
    // Frequenz-basierte Farbe
    vec3 audioColor = frequencyColor(uv, bassFreq, midFreq, highFreq);
    
    // Color-Shift anwenden
    float totalShift = uColorShift + uAudioAmplitude * 0.5;
    float hue = fract(totalShift);
    audioColor = hsv2rgb(vec3(hue, 0.8, 1.0)) * 0.3 + audioColor * 0.7;
    
    // Spektrum-Visualisierung
    float spectrum = audioSpectrum(uv, bassFreq + midFreq + highFreq);
    
    // Beat-Pulse
    float pulse = beatPulse(uAudioAmplitude, uTime);
    
    // Finale Farbe
    vec3 finalColor = audioColor * pulse * uNeonIntensity;
    finalColor += spectrum * vec3(1.0, 1.0, 0.5) * 0.5;
    
    // Audio-reaktive Alpha
    float alpha = 0.7 + uAudioAmplitude * 0.4 + spectrum * 0.3;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
