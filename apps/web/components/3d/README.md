# AnimatedLogo4D - Enterprise Neon Hologram

Eine hochentwickelte 3D-Logo-Komponente mit 4D-Zeit-Morphing-Effekten, Neon-Tube-Shadern, Partikel-System und holografischen Scan-Lines.

## Features

### ✨ Hauptfunktionen

- **Extrudierte TextGeometry** - 3D-Logo mit "IVO-TECH" Text
- **Custom Neon-Tube Shader** - Animierte Emissive Maps mit Flickering-Effekt
- **Partikel-Emitter (GPU-optimiert)** - 500 Funken in Logo-Farben
- **Holografische Scan-Lines** - Layered transparent planes mit Animation
- **4D Time-Morphing** - Logo pulsiert zwischen Serif & Mono-Style
- **Responsive Design** - `useResizeObserver` für automatische Anpassung

### 🎨 Customization

- **Theme-Colors** - Primary, Secondary, Accent & Glow
- **Performance-Tuning** - FPS-Cap und selektive Feature-Kontrolle
- **Größenanpassung** - Skalierbare Logo-Dimensionen
- **Interaktivität** - onClick-Handler und Hover-Effekte

## Installation & Setup

```bash
# Abhängigkeiten installieren
npm install three @react-three/fiber @react-three/drei

# TypeScript-Definitionen (falls benötigt)
npm install @types/three --save-dev
```

## Basic Usage

```tsx
import { AnimatedLogo4D } from './components/3d/AnimatedLogo4D';

function App() {
  return (
    <div className='h-96 w-full'>
      <AnimatedLogo4D />
    </div>
  );
}
```

## Advanced Configuration

```tsx
<AnimatedLogo4D
  // Größe des Logos
  size={1.2}
  // Custom Theme-Colors
  themeColors={{
    primary: '#00ffff', // Cyan
    secondary: '#ff00ff', // Magenta
    accent: '#ffff00', // Gelb
    glow: '#ffffff', // Weiß
  }}
  // Performance-Optimierung
  fpsLimit={30}
  // Feature-Kontrolle
  enableParticles={true}
  enableScanLines={true}
  enableTimeMorphing={true}
  // Interaktion
  onClick={() => console.log('Logo clicked!')}
  // Responsive Container
  className='h-screen w-full'
/>
```

## Theme Presets

### Enterprise Theme (Standard)

```tsx
const enterpriseTheme = {
  primary: '#00ffff', // Cyan
  secondary: '#ff00ff', // Magenta
  accent: '#ffff00', // Gelb
  glow: '#ffffff', // Weiß
};
```

### Cyberpunk Theme

```tsx
const cyberpunkTheme = {
  primary: '#ff0080', // Pink
  secondary: '#8000ff', // Violett
  accent: '#00ff80', // Grün
  glow: '#80ffff', // Hell-Cyan
};
```

### Corporate Theme

```tsx
const corporateTheme = {
  primary: '#007acc', // Blau
  secondary: '#ff6600', // Orange
  accent: '#00cc44', // Grün
  glow: '#cccccc', // Grau
};
```

## Performance-Optimierungen

### Mobile/Low-End Devices

```tsx
<AnimatedLogo4D size={0.6} fpsLimit={30} enableParticles={false} enableScanLines={false} enableTimeMorphing={false} />
```

### High-Performance Setup

```tsx
<AnimatedLogo4D size={1.5} fpsLimit={60} enableParticles={true} enableScanLines={true} enableTimeMorphing={true} />
```

## Props API

| Prop                 | Type          | Default         | Description                      |
| -------------------- | ------------- | --------------- | -------------------------------- |
| `size`               | `number`      | `1`             | Größe des Logos (Skalierung)     |
| `themeColors`        | `ThemeColors` | Enterprise      | Theme-Farben für Neon-Effekte    |
| `fpsLimit`           | `number`      | `60`            | FPS Cap für Performance          |
| `enableParticles`    | `boolean`     | `true`          | Partikel-Emitter ein/aus         |
| `enableScanLines`    | `boolean`     | `true`          | Holografische Scan-Lines ein/aus |
| `enableTimeMorphing` | `boolean`     | `true`          | Time-Morphing ein/aus            |
| `onClick`            | `() => void`  | -               | Callback für Logo-Interaktion    |
| `className`          | `string`      | `'w-full h-96'` | CSS-Klassen für Container        |

### ThemeColors Interface

```tsx
interface ThemeColors {
  primary: string; // Hauptfarbe (Hex)
  secondary: string; // Sekundärfarbe (Hex)
  accent: string; // Akzentfarbe (Hex)
  glow: string; // Glow-Farbe (Hex)
}
```

## Technische Details

### Shader-System

- **Vertex Shader**: 4D-Noise für Time-Morphing zwischen Serif/Mono-Style
- **Fragment Shader**: Neon-Tube Simulation mit Fresnel-Effekt und Flickering
- **Uniforms**: Zeit, Farben, Intensitäten und Morphing-Faktoren

### Partikel-System

- **GPU-optimiert**: BufferGeometry mit Float32Arrays
- **Lifecycle-Management**: Automatisches Reset nach Lebensdauer
- **Performance**: 500 Partikel mit AdditivBlending

### Responsive Design

- **useResizeObserver**: Echzeit-Dimensionserkennung
- **Canvas-Skalierung**: Automatische DPR-Anpassung
- **Performance-Debouncing**: 200ms Verzögerung

## Entwicklung

### Lokales Setup

```bash
# Repository klonen
git clone <repo-url>

# Abhängigkeiten installieren
npm install

# Development Server starten
npm run dev
```

### Tests ausführen

```bash
# Unit Tests
npm test

# Coverage Report
npm run test:coverage
```

### Beispiele anzeigen

```bash
# Showcase-Komponente
npm run dev
# Navigate zu /components/3d/showcase
```

## Browser-Kompatibilität

| Browser | Version | WebGL | Performance |
| ------- | ------- | ----- | ----------- |
| Chrome  | 80+     | ✅    | Optimal     |
| Firefox | 75+     | ✅    | Gut         |
| Safari  | 13+     | ✅    | Gut         |
| Edge    | 80+     | ✅    | Optimal     |

### Fallback-Verhalten

- **Kein WebGL**: Minimales 2D-Fallback
- **Schwache GPU**: Automatische Qualitätsreduzierung
- **Mobile**: Reduzierte Partikelanzahl

## Troubleshooting

### Häufige Probleme

#### Logo wird nicht angezeigt

```tsx
// Prüfe Container-Dimensionen
<div style={{ width: '100%', height: '400px' }}>
  <AnimatedLogo4D />
</div>
```

#### Performance-Issues

```tsx
// Reduziere Effekte für bessere Performance
<AnimatedLogo4D fpsLimit={30} enableParticles={false} />
```

#### Typescript-Fehler

```bash
# Installiere Type-Definitionen
npm install @types/three --save-dev
```

### Debug-Modus

```tsx
// Canvas mit Debug-Informationen
<AnimatedLogo4D
  onClick={() => {
    console.log('Performance:', performance.now());
    console.log('WebGL Context:', gl.getParameter(gl.VERSION));
  }}
/>
```

## Roadmap

### Version 2.0

- [ ] Audio-reactive Features
- [ ] VR/AR Support
- [ ] Advanced Post-Processing
- [ ] Custom Font Loader
- [ ] Multi-Language Support

### Performance-Verbesserungen

- [ ] InstancedMesh für Partikel
- [ ] WebGL2-Features
- [ ] Occlusion Culling
- [ ] LOD-System

## Contributing

1. Fork das Repository
2. Erstelle Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Commit Changes (`git commit -m 'Add amazing feature'`)
4. Push Branch (`git push origin feature/amazing-feature`)
5. Erstelle Pull Request

## License

MIT License - siehe [LICENSE](LICENSE) für Details.

---

**Erstellt mit ❤️ für das IVO-TECH Enterprise-Ecosystem**
