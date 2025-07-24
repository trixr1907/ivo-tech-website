uniform float time;
uniform vec2 resolution;

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float xPos = uv.x + (sin(uv.y * 10.0 + time * 3.0) * 0.1);
  vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.8), step(0.5, xPos));
  gl_FragColor = vec4(color, 1.0);
}
