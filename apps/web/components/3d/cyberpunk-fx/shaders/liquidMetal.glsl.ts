/**
 * Liquid Metal Shader - 4D Flüssiges Metall mit Audio-Reaktivität
 */

export const liquidMetalVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uFlowSpeed;
  uniform float uGlitchIntensity;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vNoise;
  varying vec3 vWorldPosition;
  
  // 4D FBM (Fractal Brownian Motion)
  float noise4D(vec4 p) {
    return fract(sin(dot(p, vec4(12.9898, 78.233, 45.164, 94.673))) * 43758.5453);
  }
  
  float fbm4D(vec4 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 6; i++) {
      value += amplitude * noise4D(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  vec3 liquidDistortion(vec3 pos, float time, float speed) {
    vec4 p4d = vec4(pos * 0.3, time * speed);
    
    float distortionX = fbm4D(p4d) * 0.2;
    float distortionY = fbm4D(p4d + vec4(100.0, 0.0, 0.0, 0.0)) * 0.2;
    float distortionZ = fbm4D(p4d + vec4(0.0, 100.0, 0.0, 0.0)) * 0.2;
    
    return pos + vec3(distortionX, distortionY, distortionZ);
  }
  
  void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    
    // 4D-Noise für Metallic-Flow
    vec4 pos4D = vec4(position, uTime * uFlowSpeed);
    vNoise = fbm4D(pos4D);
    
    // Liquid-Distortion
    vec3 distortedPos = liquidDistortion(position, uTime, uFlowSpeed);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(distortedPos, 1.0);
  }
`;

export const liquidMetalFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uNeonIntensity;
  uniform float uColorShift;
  uniform float uFlowSpeed;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vNoise;
  varying vec3 vWorldPosition;
  
  // Fresnel Reflektanz
  float fresnel(vec3 viewDirection, vec3 normal, float power) {
    return pow(1.0 - max(0.0, dot(viewDirection, normal)), power);
  }
  
  // Metallic Reflection Simulation
  vec3 metallicReflection(vec3 normal, vec3 viewDir, float roughness) {
    vec3 reflected = reflect(viewDir, normal);
    
    // Simuliere Environment Reflection
    float u = atan(reflected.z, reflected.x) / (2.0 * 3.14159) + 0.5;
    float v = acos(reflected.y) / 3.14159;
    
    // Cyberpunk Environment Colors
    vec3 envColor1 = vec3(1.0, 0.1, 0.8); // Magenta
    vec3 envColor2 = vec3(0.0, 1.0, 1.0); // Cyan
    vec3 envColor3 = vec3(1.0, 1.0, 0.0); // Gelb
    
    float blend = sin(u * 6.28) * 0.5 + 0.5;
    vec3 envColor = mix(envColor1, envColor2, blend);
    envColor = mix(envColor, envColor3, v);
    
    return envColor * (1.0 - roughness);
  }
  
  // HSV zu RGB
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  // Liquid Flow Pattern
  float liquidFlow(vec2 uv, float time, float speed) {
    vec2 flow1 = uv + vec2(sin(time * speed), cos(time * speed * 0.7)) * 0.1;
    vec2 flow2 = uv + vec2(cos(time * speed * 1.3), sin(time * speed * 0.9)) * 0.05;
    
    float pattern1 = sin(flow1.x * 20.0) * sin(flow1.y * 15.0);
    float pattern2 = cos(flow2.x * 30.0) * cos(flow2.y * 25.0);
    
    return (pattern1 + pattern2) * 0.5;
  }
  
  void main() {
    vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
    vec3 normal = normalize(vNormal);
    
    // Fresnel-Effekt
    float fresnelTerm = fresnel(-viewDirection, normal, 2.0);
    
    // Liquid Metal Basis-Farbe
    vec3 metalColor = vec3(0.7, 0.8, 1.0); // Silber-Blau
    
    // Audio-reaktive Farbverschiebung
    float hue = uColorShift + vNoise * 0.2;
    vec3 shiftedColor = hsv2rgb(vec3(hue, 0.6, 1.0));
    metalColor = mix(metalColor, shiftedColor, 0.4);
    
    // Metallic Reflection
    float roughness = 0.1 + vNoise * 0.3;
    vec3 reflectedColor = metallicReflection(normal, viewDirection, roughness);
    
    // Liquid Flow Pattern
    float flowPattern = liquidFlow(vUv, uTime, uFlowSpeed);
    
    // Iridescence (Schillernde Farben)
    float iridescence = sin(fresnelTerm * 10.0 + uTime * 2.0) * 0.3 + 0.7;
    vec3 iridColor = vec3(
      sin(iridescence * 2.0) * 0.5 + 0.5,
      sin(iridescence * 2.0 + 2.0) * 0.5 + 0.5,
      sin(iridescence * 2.0 + 4.0) * 0.5 + 0.5
    );
    
    // Finale Farbmischung
    vec3 finalColor = mix(metalColor, reflectedColor, fresnelTerm);
    finalColor = mix(finalColor, iridColor, 0.3);
    finalColor += flowPattern * 0.2 * uNeonIntensity;
    
    // Metallic Glanz
    float metallic = 0.9;
    finalColor *= (1.0 + fresnelTerm * metallic);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

/**
 * Datastream Flow Shader - Matrix-Style Datenströme
 */

export const datastreamFlowVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uFlowSpeed;
  
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vFlow;
  
  void main() {
    vPosition = position;
    vUv = uv;
    
    // Datastream Flow-Parameter
    vFlow = uTime * uFlowSpeed + position.y * 5.0;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const datastreamFlowFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uNeonIntensity;
  uniform float uColorShift;
  uniform float uFlowSpeed;
  
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vFlow;
  
  // Digital Noise
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Matrix Rain Effect
  float matrixRain(vec2 uv, float time) {
    vec2 id = floor(uv * vec2(20.0, 50.0));
    vec2 gv = fract(uv * vec2(20.0, 50.0));
    
    float offset = hash(id) * 6.28;
    float rainSpeed = 2.0 + hash(id) * 3.0;
    float rainY = fract(time * rainSpeed + offset);
    
    float rain = smoothstep(0.8, 0.9, rainY);
    rain *= smoothstep(0.1, 0.0, abs(gv.x - 0.5));
    
    return rain;
  }
  
  // Binary Data Stream
  float binaryStream(vec2 uv, float time) {
    vec2 streamUv = uv * vec2(30.0, 100.0);
    streamUv.y += time * 10.0;
    
    vec2 id = floor(streamUv);
    float binary = step(0.5, hash(id + floor(time * 2.0)));
    
    return binary * smoothstep(0.4, 0.6, fract(streamUv.y));
  }
  
  // HSV zu RGB
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Matrix Rain
    float rain = matrixRain(uv, vFlow);
    
    // Binary Stream
    float binary = binaryStream(uv, vFlow);
    
    // Datastream Basis-Farbe
    vec3 streamColor = vec3(0.0, 1.0, 0.2); // Matrix-Grün
    
    // Audio-reaktive Farbverschiebung
    float hue = uColorShift + uv.y * 0.1;
    vec3 shiftedColor = hsv2rgb(vec3(hue, 0.8, 1.0));
    streamColor = mix(streamColor, shiftedColor, 0.3);
    
    // Flow-Intensität
    float flowIntensity = max(rain, binary * 0.5) * uNeonIntensity;
    
    // Finale Farbe
    vec3 finalColor = streamColor * flowIntensity;
    
    // Glow-Effekt
    float glow = flowIntensity * 0.5;
    finalColor += vec3(glow) * 0.2;
    
    gl_FragColor = vec4(finalColor, flowIntensity * 0.8);
  }
`;
