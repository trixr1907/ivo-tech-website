import { useEffect, useState } from 'react';

export function useMotionSupport() {
  const [supportsMotion, setSupportsMotion] = useState(true);

  useEffect(() => {
    const checkMotionSupport = () => {
      // Überprüfe Bewegungssensor-Support
      const hasMotionSensor = 'DeviceMotionEvent' in window;
      
      // Überprüfe Performance-API
      const hasPerformanceAPI = 'performance' in window;
      
      // Überprüfe requestAnimationFrame
      const hasRAF = 'requestAnimationFrame' in window;
      
      // Überprüfe Browser-Leistung
      const isHighPerformance = hasPerformanceAPI && performance.memory ? 
        performance.memory.jsHeapSizeLimit > 512 * 1024 * 1024 : true;
      
      // Überprüfe Batteriestatus (falls verfügbar)
      if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
          const isCharging = battery.charging;
          const level = battery.level;
          
          // Deaktiviere aufwendige Animationen bei niedrigem Akkustand
          if (!isCharging && level < 0.2) {
            setSupportsMotion(false);
            return;
          }
        });
      }
      
      // Setze Support basierend auf Gerätefähigkeiten
      setSupportsMotion(
        hasMotionSensor && 
        hasRAF && 
        isHighPerformance &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };

    checkMotionSupport();

    // Überwache Systemeinstellungen für reduzierte Bewegung
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setSupportsMotion(!mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return supportsMotion;
}
