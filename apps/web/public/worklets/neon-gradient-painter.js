/**
 * CSS Houdini Paint Worklet for Neon Gradients
 * This worklet creates dynamic animated gradients for neon UI components
 */

class NeonGradientPainter {
  static get inputProperties() {
    return ['--neon-hue', '--neon-intensity', '--audio-reactive'];
  }

  static get inputArguments() {
    return ['<angle>', '<color>', '<color>', '<color>'];
  }

  static get contextOptions() {
    return { alpha: true };
  }

  paint(ctx, size, properties, args) {
    const width = size.width;
    const height = size.height;

    // Extract CSS properties
    const hue = parseFloat(properties.get('--neon-hue')?.toString()) || 180;
    const intensity = parseFloat(properties.get('--neon-intensity')?.toString()) || 1;
    const audioReactive = parseFloat(properties.get('--audio-reactive')?.toString()) || 0;

    // Parse arguments with fallbacks
    const angle = args[0]?.toString() || '45deg';
    const color1 = args[1]?.toString() || `hsl(${hue}, 70%, 50%)`;
    const color2 = args[2]?.toString() || `hsl(${hue + 60}, 80%, 60%)`;
    const color3 = args[3]?.toString() || `hsl(${hue + 120}, 70%, 50%)`;

    // Convert angle to radians
    const angleRad = this.parseAngle(angle);

    // Calculate gradient direction
    const x1 = Math.cos(angleRad) * width;
    const y1 = Math.sin(angleRad) * height;
    const x2 = width - x1;
    const y2 = height - y1;

    // Create base gradient
    const gradient = ctx.createLinearGradient(0, 0, x1, y1);

    // Add audio-reactive hue shift
    const reactiveHue = hue + audioReactive * 60;

    // Create color stops with dynamic colors
    const dynamicColor1 = `hsl(${reactiveHue}, ${70 + audioReactive * 20}%, ${50 + audioReactive * 10}%)`;
    const dynamicColor2 = `hsl(${reactiveHue + 60}, ${80 + audioReactive * 20}%, ${60 + audioReactive * 10}%)`;
    const dynamicColor3 = `hsl(${reactiveHue + 120}, ${70 + audioReactive * 20}%, ${50 + audioReactive * 10}%)`;

    // Add color stops
    gradient.addColorStop(0, dynamicColor1);
    gradient.addColorStop(0.5, dynamicColor2);
    gradient.addColorStop(1, dynamicColor3);

    // Apply base gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add noise overlay for texture
    this.addNoise(ctx, width, height, intensity, audioReactive);

    // Add animated scanlines
    this.addScanlines(ctx, width, height, hue, audioReactive);

    // Add glow effect
    this.addGlow(ctx, width, height, reactiveHue, intensity);
  }

  parseAngle(angle) {
    const value = parseFloat(angle);
    if (angle.includes('deg')) {
      return (value * Math.PI) / 180;
    } else if (angle.includes('rad')) {
      return value;
    } else if (angle.includes('turn')) {
      return value * 2 * Math.PI;
    }
    return (value * Math.PI) / 180; // Default to degrees
  }

  addNoise(ctx, width, height, intensity, audioReactive) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const noiseIntensity = intensity * 0.1 + audioReactive * 0.05;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * noiseIntensity * 255;
      data[i] = Math.max(0, Math.min(255, data[i] + noise)); // R
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // G
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // B
    }

    ctx.putImageData(imageData, 0, 0);
  }

  addScanlines(ctx, width, height, hue, audioReactive) {
    const time = Date.now() * 0.001;
    const lineSpacing = 4 + audioReactive * 2;
    const opacity = 0.1 + audioReactive * 0.1;

    ctx.globalCompositeOperation = 'overlay';

    for (let y = 0; y < height; y += lineSpacing) {
      const waveOffset = Math.sin(y * 0.1 + time * 2) * 2;
      const alpha = opacity * Math.sin(y * 0.05 + time);

      ctx.strokeStyle = `hsla(${hue}, 70%, 80%, ${Math.abs(alpha)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y + waveOffset);
      ctx.lineTo(width, y + waveOffset);
      ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  addGlow(ctx, width, height, hue, intensity) {
    const glowSize = 20 * intensity;

    // Create radial gradient for glow
    const glowGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    );

    glowGradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.2)`);
    glowGradient.addColorStop(0.3, `hsla(${hue}, 70%, 50%, 0.1)`);
    glowGradient.addColorStop(1, `hsla(${hue}, 70%, 40%, 0)`);

    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  }
}

// Register the paint worklet
registerPaint('neon-gradient', NeonGradientPainter);
