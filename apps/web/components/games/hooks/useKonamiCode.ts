import { useEffect, useCallback, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useKonamiCode() {
  const [isKonamiCodeActive, setIsKonamiCodeActive] = useState(false);
  const [keysPressed, setKeysPressed] = useState<string[]>([]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();

    setKeysPressed(prev => {
      const newKeys = [...prev, event.key];

      // Beschränke die Länge auf die des Konami Codes
      if (newKeys.length > KONAMI_CODE.length) {
        newKeys.shift();
      }

      // Prüfe, ob der Konami Code eingegeben wurde
      if (newKeys.join(',') === KONAMI_CODE.join(',')) {
        setIsKonamiCodeActive(true);
        return [];
      }

      // Prüfe, ob die aktuelle Sequenz noch gültig sein könnte
      const isValidSequence = KONAMI_CODE.join(',').startsWith(
        newKeys.join(',')
      );
      if (!isValidSequence) {
        return [];
      }

      return newKeys;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const resetKonamiCode = useCallback(() => {
    setIsKonamiCodeActive(false);
    setKeysPressed([]);
  }, []);

  return {
    isKonamiCodeActive,
    resetKonamiCode,
    progress: keysPressed.length / KONAMI_CODE.length,
  };
}
