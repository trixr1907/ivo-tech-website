import { type ClassValue, clsx } from 'clsx';

/**
 * Utility-Funktion zum Zusammenfügen von CSS-Klassen
 * Kombiniert clsx mit Tailwind CSS für bessere Klassenverarbeitung
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Debounce-Funktion für Performance-Optimierung
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle-Funktion für Performance-Optimierung
 */
export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Prüft ob der Browser schwache Hardware hat
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === 'undefined') return false;

  // Prüfe CPU-Kerne (< 4 = schwach)
  const cores = (navigator as any).hardwareConcurrency || 4;

  // Prüfe RAM (< 4GB = schwach)
  const memory = (navigator as any).deviceMemory || 8;

  // Prüfe Connection-Speed
  const connection = (navigator as any).connection;
  const isSlowConnection =
    connection &&
    (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.effectiveType === '3g');

  return cores < 4 || memory < 4 || isSlowConnection;
}

/**
 * Media Query Helper für Responsive Design
 */
export function createMediaQuery(query: string): MediaQueryList | null {
  if (typeof window === 'undefined') return null;
  return window.matchMedia(query);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  const mq = createMediaQuery('(prefers-reduced-motion: reduce)');
  return mq ? mq.matches : false;
}

/**
 * Performance Budget Helper
 */
export function getPerformanceBudget() {
  const isLowEnd = isLowEndDevice();
  const prefersReduced = prefersReducedMotion();

  return {
    maxParticles: isLowEnd ? 100 : prefersReduced ? 200 : 500,
    targetFPS: isLowEnd ? 30 : prefersReduced ? 45 : 60,
    enablePostProcessing: !isLowEnd && !prefersReduced,
    enableShadows: !isLowEnd,
    textureQuality: isLowEnd ? 'low' : 'high',
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}
