# NeonUI Library - 3D/4D Micro-Interactions

Eine fortschrittliche UI-Library, die CSS mit `@react-three/fiber` portals kombiniert, um einen gänzlichen 3D-DOM-Hybrid zu erstellen. Die Library bietet Buttons, Cards und Modals als layered planes mit umfangreichen Micro-Interactions.

## 🌟 Features

### 3D/4D Hybrid-Architektur

- **Layered Planes**: Komponenten bestehen aus mehreren 3D-Ebenen im CSS + React Three Fiber
- **DOM-Integration**: Nahtlose Verbindung zwischen DOM-Elementen und 3D-Szenen
- **4D-Modus**: Audio-reaktive Effekte mit Web Audio API

### Micro-Interactions

- **Hover-Effekte**: Depth-translation & dynamisches Tilt
- **Click-Animationen**: Spring-Scale mit Framer Motion + Sparkle-Partikel
- **Animierte Gradienten**: CSS Houdini Paint-API mit Fallback-Support

### Audio-Reaktivität

- **Frequenz-Analyse**: Echtzeit-Audio-Datenverarbeitung
- **Hue-Shift**: Farbwechsel basierend auf Audio-Input
- **Dynamic Intensity**: Effekt-Intensität reagiert auf Lautstärke

## 📦 Komponenten

### NeonButton

```tsx
<NeonButton
  variant="primary"
  size="lg"
  sparkles={true}
  tiltIntensity={15}
  4d={true}
  onClick={() => console.log('Clicked!')}
>
  3D Button
</NeonButton>
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'accent' | 'ghost'
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `sparkles`: boolean - Aktiviert Partikeleffekte
- `tiltIntensity`: number - Stärke des Hover-Tilt-Effekts
- `4d`: boolean - Aktiviert 3D-Layering

### NeonCard

```tsx
<NeonCard
  title="Interaktive Karte"
  subtitle="Mit 3D-Effekten"
  variant="primary"
  elevation={3}
  interactive={true}
  hoverOffset={25}
  4d={true}
>
  <p>Karteninhalt hier...</p>
</NeonCard>
```

**Props:**

- `elevation`: number - Schatten-Intensität
- `interactive`: boolean - Aktiviert Hover-Interaktionen
- `hoverOffset`: number - Pixel-Offset beim Hover
- `tilt`: boolean - Mouse-Tracking für Tilt-Effekt

### NeonModal

```tsx
<NeonModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="3D Modal"
  variant="primary"
  4d={true}
  backdropBlur={true}
>
  <p>Modal-Inhalt...</p>
</NeonModal>
```

**Props:**

- `backdropBlur`: boolean - Hintergrund-Unschärfe
- `showCloseButton`: boolean - Schließen-Button anzeigen

## 🎨 Effekte-System

### Sparkles

3D-Partikelsystem für Click-Interaktionen:

```tsx
<Sparkles
  count={30}
  size={0.03}
  colors={['#00ff00', '#0080ff', '#ff00ff']}
  duration={800}
  trigger={sparklesTrigger}
/>
```

### AnimatedGradient

CSS Houdini Paint API mit Audio-Reaktivität:

```tsx
<AnimatedGradient
  colors={['#00ff00', '#0080ff', '#00ffff']}
  speed={1.5}
  direction={Math.PI / 4}
  audioReactive={true}
/>
```

## 🔧 Setup & Installation

### 1. Provider einrichten

```tsx
import { NeonProvider } from './components/ui/neon-ui';

function App() {
  return (
    <NeonProvider enableAudio={true}>{/* Your app content */}</NeonProvider>
  );
}
```

### 2. CSS Houdini Worklet laden

Das Worklet wird automatisch geladen, aber stellen Sie sicher, dass die Datei öffentlich zugänglich ist:

```
public/worklets/gradient-worklet.js
```

### 3. Dependencies

Die Library verwendet folgende Dependencies:

- `@react-three/fiber` - 3D-Rendering
- `@react-three/drei` - 3D-Hilfsfunktionen
- `framer-motion` - Animationen
- `three` - 3D-Engine
- `react` & `typescript` - Basis

## 🎵 Audio-System (4D-Modus)

### Audio-Context Aktivierung

```tsx
const { toggle4DMode, is4DMode } = useNeonContext();

// 4D-Modus aktivieren (erfordert Benutzer-Interaktion)
toggle4DMode();
```

### Funktionsweise

1. **Mikrofon-Zugriff**: Web Audio API für Echtzeit-Audio
2. **Frequenz-Analyse**: FFT-basierte Datenextraktion
3. **Visual Mapping**: Audio-Daten → visuelle Effekte
4. **Hue-Shifting**: Farbwechsel basierend auf Frequenzen

## 🌐 Browser-Kompatibilität

### CSS Houdini Paint API

- **Chrome/Edge**: Vollständig unterstützt
- **Firefox**: Experimentell (über Flag)
- **Safari**: In Entwicklung
- **Fallback**: CSS-Gradienten mit JavaScript-Animation

### Web Audio API

- **Alle modernen Browser**: Unterstützt
- **Erfordert**: HTTPS oder localhost
- **Benutzer-Interaktion**: Für Audio-Context-Aktivierung

## 🚀 Performance-Optimierungen

### 3D-Rendering

- **Frustum Culling**: Außerhalb sichtbarer Bereich
- **LOD System**: Detail-Level basierend auf Distanz
- **Instance Rendering**: Für Partikel-Effekte

### Audio-Processing

- **RequestAnimationFrame**: Synchrone Updates
- **Buffer Management**: Optimierte Speichernutzung
- **Conditional Rendering**: Nur bei Audio-Input

## 📝 Beispiel-Implementation

```tsx
import {
  NeonProvider,
  NeonButton,
  NeonCard,
  NeonModal
} from './components/ui/neon-ui';

function NeonUIShowcase() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <NeonProvider enableAudio={true}>
      <div className="min-h-screen bg-black p-8">
        <NeonCard
          title="Futuristische UI"
          subtitle="Mit 3D/4D Effekten"
          variant="primary"
          4d={true}
        >
          <NeonButton
            variant="accent"
            size="lg"
            sparkles={true}
            onClick={() => setModalOpen(true)}
          >
            Modal öffnen
          </NeonButton>
        </NeonCard>

        <NeonModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="3D Modal Demo"
          4d={true}
        >
          <p>Interaktive 3D-Benutzeroberfläche!</p>
        </NeonModal>
      </div>
    </NeonProvider>
  );
}
```

## 🔮 Erweiterte Features

### Custom Variants

Eigene Farbschemata definieren:

```tsx
const customVariant = {
  colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
  glowColor: '#ff6b6b',
  intensity: 1.5,
};
```

### Audio-Visualizer Integration

```tsx
// Frequenz-Daten für eigene Visualisierungen
const { frequencyData } = useNeonContext();
```

### Performance Monitoring

```tsx
// 3D-Performance überwachen
const { fps, drawCalls } = useNeonPerformance();
```

---

## 🛠️ Development

### TypeScript Support

Vollständige TypeScript-Unterstützung mit strikten Typen.

### Testing

Unit Tests für alle Komponenten und Effekte.

### Storybook Integration

Interaktive Komponenten-Dokumentation.

---

_NeonUI Library - Die Zukunft der Web-UI ist 3D! 🚀_
