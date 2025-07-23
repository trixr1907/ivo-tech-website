// Diese Datei dient als zentrale Konfiguration für alle Typ-Erweiterungen
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="three" />
/// <reference types="node" />

// Importiere die grundlegenden Typen
import * as React from 'react';
import * as THREE from 'three';

// Exportiere die wichtigsten Typ-Namespaces für globale Verfügbarkeit
export as namespace React;
export as namespace THREE;

// Stelle sicher, dass die DOM-Typen verfügbar sind
declare global {
  export type ReactNode = React.ReactNode;
  export type ReactElement = React.ReactElement;
  export type CSSProperties = React.CSSProperties;
  
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
