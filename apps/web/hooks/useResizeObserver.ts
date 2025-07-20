import { useEffect, useState, RefObject } from 'react';

interface UseResizeObserverResult {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Custom Hook für Resize-Observer
 * Überwacht Größenänderungen eines DOM-Elements für responsive 3D-Szenen
 */
export function useResizeObserver(ref: RefObject<HTMLElement>): UseResizeObserverResult {
  const [dimensions, setDimensions] = useState<UseResizeObserverResult>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Initiale Größe setzen
    const updateDimensions = () => {
      const rect = element.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
      });
    };

    // ResizeObserver für moderne Browser
    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          setDimensions({ width, height });
        }
      });

      resizeObserver.observe(element);

      return () => {
        resizeObserver.disconnect();
      };
    }

    // Fallback für ältere Browser
    const handleResize = () => updateDimensions();

    // Initiale Größe
    updateDimensions();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return dimensions;
}
