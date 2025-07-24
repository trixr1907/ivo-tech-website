'use client';

import React from 'react';
import { AnimatedLogo4D } from './AnimatedLogo4D';

// Standard Enterprise Theme
const enterpriseTheme = {
  primary: '#00ffff', // Cyan
  secondary: '#ff00ff', // Magenta
  accent: '#ffff00', // Gelb
  glow: '#ffffff', // Weiß
};

// Cyberpunk Theme
const cyberpunkTheme = {
  primary: '#ff0080', // Pink
  secondary: '#8000ff', // Violett
  accent: '#00ff80', // Grün
  glow: '#80ffff', // Hell-Cyan
};

// Corporate Theme
const corporateTheme = {
  primary: '#007acc', // Blau
  secondary: '#ff6600', // Orange
  accent: '#00cc44', // Grün
  glow: '#cccccc', // Grau
};

/**
 * Interaktive Demo-Komponente mit Controls
 */
export function InteractiveLogo4DDemo() {
  const [config, setConfig] = React.useState({
    size: 1,
    fpsLimit: 60,
    enableParticles: true,
    enableScanLines: true,
    enableTimeMorphing: true,
    theme: 'enterprise',
  });

  const themes = {
    enterprise: enterpriseTheme,
    cyberpunk: cyberpunkTheme,
    corporate: corporateTheme,
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-900 p-4 md:grid-cols-3">
        <div>
          <label htmlFor="size" className="mb-2 block text-sm text-white">Größe</label>
          <input
            id="size"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={config.size}
            onChange={e =>
              setConfig(prev => ({ ...prev, size: parseFloat(e.target.value) }))
            }
            className="w-full"
          />
          <span className="text-xs text-gray-400">{config.size}</span>
        </div>

        <div>
          <label htmlFor="fps-limit" className="mb-2 block text-sm text-white">FPS Limit</label>
          <select
            id="fps-limit"
            value={config.fpsLimit}
            onChange={e =>
              setConfig(prev => ({
                ...prev,
                fpsLimit: parseInt(e.target.value),
              }))
            }
            className="w-full rounded bg-gray-800 p-1 text-white"
          >
            <option value={60}>60 FPS</option>
            <option value={30}>30 FPS</option>
            <option value={15}>15 FPS</option>
          </select>
        </div>

        <div>
          <label htmlFor="theme" className="mb-2 block text-sm text-white">Theme</label>
          <select
            id="theme"
            value={config.theme}
            onChange={e =>
              setConfig(prev => ({ ...prev, theme: e.target.value }))
            }
            className="w-full rounded bg-gray-800 p-1 text-white"
          >
            <option value="enterprise">Enterprise</option>
            <option value="cyberpunk">Cyberpunk</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="particles"
            type="checkbox"
            checked={config.enableParticles}
            onChange={e =>
              setConfig(prev => ({
                ...prev,
                enableParticles: e.target.checked,
              }))
            }
            className="mr-2"
          />
          <label htmlFor="particles" className="text-sm text-white">Partikel</label>
        </div>

        <div className="flex items-center">
          <input
            id="scan-lines"
            type="checkbox"
            checked={config.enableScanLines}
            onChange={e =>
              setConfig(prev => ({
                ...prev,
                enableScanLines: e.target.checked,
              }))
            }
            className="mr-2"
          />
          <label htmlFor="scan-lines" className="text-sm text-white">Scan Lines</label>
        </div>

        <div className="flex items-center">
          <input
            id="time-morphing"
            type="checkbox"
            checked={config.enableTimeMorphing}
            onChange={e =>
              setConfig(prev => ({
                ...prev,
                enableTimeMorphing: e.target.checked,
              }))
            }
            className="mr-2"
          />
          <label htmlFor="time-morphing" className="text-sm text-white">Time Morphing</label>
        </div>
      </div>

      {/* Live Preview */}
      <div className="h-96 w-full rounded-lg border border-blue-500">
        <AnimatedLogo4D
          themeColors={themes[config.theme as keyof typeof themes]}
          size={config.size}
          fpsLimit={config.fpsLimit}
          enableParticles={config.enableParticles}
          enableScanLines={config.enableScanLines}
          enableTimeMorphing={config.enableTimeMorphing}
          onClick={() => alert('Interactive logo clicked!')}
          className="h-full w-full"
        />
      </div>

      {/* Code Preview */}
      <details className="rounded-lg bg-gray-900 p-4">
        <summary className="cursor-pointer text-white">
          Code für aktuelle Konfiguration anzeigen
        </summary>
        <pre className="mt-2 overflow-x-auto text-sm text-green-400">
          {`<AnimatedLogo4D 
  themeColors={{
    primary: '${themes[config.theme as keyof typeof themes].primary}',
    secondary: '${themes[config.theme as keyof typeof themes].secondary}',
    accent: '${themes[config.theme as keyof typeof themes].accent}',
    glow: '${themes[config.theme as keyof typeof themes].glow}'
  }}
  size={${config.size}}
  fpsLimit={${config.fpsLimit}}
  enableParticles={${config.enableParticles}}
  enableScanLines={${config.enableScanLines}}
  enableTimeMorphing={${config.enableTimeMorphing}}
  onClick={() => console.log('Logo clicked!')}
  className="w-full h-full"
/>`}
        </pre>
      </details>
    </div>
  );
}

export default InteractiveLogo4DDemo;
