# Immersive 3D Portal Hero Section

## Overview

Die neue Hero-Section transformiert die Standard-Landing-Page in ein interaktives 3D-Portal-Erlebnis mit fortgeschrittenen WebGL-Effekten und responsiven Animationen.

## Features Implemented ✅

### 1. Interactive Star-Gate Portal

- **Torus-Knot Geometrie** mit Multi-Ring-Design
- **Portal Shader Material** mit animierten Ringen und Tiefeneffekten
- **Depth-based Displacement** für realistische Wellenanimationen
- Dynamische Farbmischung (Blau → Lila Gradient)

### 2. Camera Dolly-in Scroll Effect

- **ScrollControls** Integration mit `react-three-drei`
- Kamera bewegt sich beim Scrollen in das Portal hinein
- Cinematische Rotationseffekte für dramatische Perspektive
- 3-seitiger Scroll-Bereich für erweiterte Navigation

### 3. Parallax Asteroid Field

- **Instanced Mesh** für performante Darstellung von 150+ Asteroiden
- Individuelle Geschwindigkeiten und Rotationsanimationen
- Automatisches Reset-System wenn Asteroiden die Kamera passieren
- Verschiedene Größen und Bewegungsmuster

### 4. Volumetric Fog Effects

- Transparente Box-Geometrie für Atmosphäreneffekt
- Farbabstimmung mit Portal-Theme (dunkles Blau)
- Niedrige Opazität für subtilen, immersiven Look

### 5. 3D Floating CTA Buttons

- **RoundedBox Geometrie** mit Metallic/Emissive Materials
- **Hover-Tilt Effekte** mit smoothem Lerp-Übergang
- Floating Animation mit Sin-Wave-Bewegung
- Glow-Effekte und Partikel-System bei Hover
- Responsive Click-Animationen

## Technical Implementation

### Components Structure

```
components/3d/
├── ImmersiveHeroSection3D.tsx       # Main container component
├── StarGate.tsx                     # Portal with shader effects
├── ParallaxAsteroidField.tsx        # Instanced asteroid system
├── FloatingCTAButton.tsx            # Interactive 3D buttons
└── HERO_PORTAL_README.md            # This documentation
```

### Key Technologies

- **Three.js** + **React Three Fiber** für 3D-Rendering
- **@react-three/drei** für erweiterte Komponenten
- **GLSL Shader Programming** für Portal-Effekte
- **Instanced Rendering** für Performance-Optimierung
- **ScrollControls** für Scroll-basierte Animationen

### Performance Optimizations

- Dynamic Loading mit Next.js `dynamic()` Import
- Suspense Fallback für SSR-Kompatibilität
- Optimized DPR (Device Pixel Ratio) Handling
- Fog Effects für Distant-Object-Culling

## Usage

### Basic Integration

```tsx
import { ImmersiveHeroSection3D } from '../3d/ImmersiveHeroSection3D';

export function HeroSection() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ImmersiveHeroSection3D />
    </Suspense>
  );
}
```

### Fallback System

Das System bietet eine automatische Fallback-Lösung:

- 3D-Version für WebGL-fähige Browser
- 2D-Version mit Portal-Theme für Kompatibilität
- Toggle-Button zum Wechseln zwischen den Modi

## Browser Compatibility

- **Modern Browsers**: Full 3D experience with all effects
- **Older Browsers**: Graceful fallback to 2D version
- **Mobile Devices**: Optimized performance with reduced particle count
- **No JavaScript**: Static fallback content

## Configuration Options

### StarGate Props

```tsx
interface StarGateProps {
  position?: [number, number, number]; // Default: [0, 0, -5]
  scale?: number; // Default: 1
}
```

### CTA Button Props

```tsx
interface FloatingCTAButtonProps {
  text: string; // Button text
  position?: [number, number, number]; // 3D position
  onClick?: () => void; // Click handler
}
```

## Performance Metrics

- **Initial Load**: ~3-5 seconds
- **60 FPS** on modern devices
- **Asteroid Count**: Dynamically adjustable (150 default)
- **Memory Usage**: Optimized through instancing

## Future Enhancements

- [ ] VR/AR Support mit WebXR
- [ ] Audio-reactive Portal-Animationen
- [ ] Particle Trail-Effekte für Asteroiden
- [ ] Multi-Portal-System für verschiedene Sektionen
- [ ] Procedural Portal-Geometrie-Generation

## Troubleshooting

### Common Issues

1. **Black Screen**: Check WebGL support in browser
2. **Performance Issues**: Reduce asteroid count or disable fog
3. **Loading Problems**: Ensure all drei dependencies are installed
4. **Shader Errors**: Verify GLSL syntax in console

### Debug Mode

Uncomment helper objects in StarGate.tsx for development:

```tsx
// <axesHelper args={[5]} />  // Coordinate system
// <gridHelper args={[20, 20]} />  // Grid reference
```

---

_Entwickelt mit ❤️ und cutting-edge 3D-Technologien für IVO-TECH_
