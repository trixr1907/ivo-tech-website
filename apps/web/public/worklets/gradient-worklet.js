// CSS Houdini Paint Worklet für NeonUI
class NeonGradientPainter {
  static get inputProperties() {
    return [
      '--neon-colors',
      '--neon-speed',
      '--neon-time',
      '--neon-direction',
      '--neon-frequency-data',
    ];
  }

  paint(ctx, size, properties) {
    const colors = properties.get('--neon-colors').toString().split(',') || [
      '#00ff00',
      '#0080ff',
    ];
    const speed = parseFloat(properties.get('--neon-speed').toString()) || 1;
    const time = parseFloat(properties.get('--neon-time').toString()) || 0;
    const direction =
      parseFloat(properties.get('--neon-direction').toString()) || 0;
    const frequencyData = properties.get('--neon-frequency-data').toString();

    const width = size.width;
    const height = size.height;

    // Audio-reaktive Modifikation
    let audioIntensity = 1;
    if (frequencyData) {
      try {
        const data = JSON.parse(frequencyData);
        const average = data.reduce((a, b) => a + b, 0) / data.length;
        audioIntensity = 1 + (average / 255) * 0.5;
      } catch (e) {
        // Fallback ohne Audio
      }
    }

    // Animierter Gradient mit Zeitbasierung
    const gradient = ctx.createLinearGradient(
      0,
      0,
      Math.cos(direction) * width,
      Math.sin(direction) * height
    );

    const animatedTime = time * speed * audioIntensity;

    colors.forEach((color, index) => {
      const stop =
        (index / (colors.length - 1) + Math.sin(animatedTime + index) * 0.1) %
        1;
      gradient.addColorStop(Math.max(0, Math.min(1, stop)), color.trim());
    });

    // Zusätzliche Neon-Effekte
    const glowGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      Math.max(width, height) / 2
    );

    glowGradient.addColorStop(0, `rgba(0, 255, 255, ${0.3 * audioIntensity})`);
    glowGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

    // Basis-Gradient zeichnen
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Glow-Overlay
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'source-over';
  }
}

registerPaint('neon-gradient', NeonGradientPainter);
