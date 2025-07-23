import type {
  ReactNode,
  MouseEvent,
  FormEvent,
  ErrorInfo,
  RefObject,
  ComponentType,
  CSSProperties,
  HTMLAttributes,
  StyleHTMLAttributes,
  HTMLStyleElement,
  DetailedHTMLProps,
  ReactEventHandler,
  ChangeEvent,
  DragEvent,
  FocusEvent,
  MemoExoticComponent,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
  Component as ReactComponent
} from 'react';

import { Component, useLayoutEffect, useRef } from 'react';

export type {
  ReactNode,
  MouseEvent,
  FormEvent,
  ErrorInfo,
  RefObject,
  ComponentType,
  CSSProperties,
  HTMLAttributes,
  StyleHTMLAttributes,
  HTMLStyleElement,
  DetailedHTMLProps,
  ReactEventHandler,
  ChangeEvent,
  DragEvent,
  FocusEvent,
  MemoExoticComponent,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes
};

export { useLayoutEffect, useRef };

export interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{
    error: Error;
    errorInfo?: ErrorInfo;
    resetError: () => void;
  }>;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export type ExtendedComponent<P = {}, S = {}> = Component<P, S> & {
  state: S;
  props: P;
};

export interface MonitoringProviderProps {
  children: ReactNode;
  settings?: {
    debugMode?: boolean;
    performanceLogging?: boolean;
    errorTracking?: boolean;
  };
}

export interface NavigationHeaderProps {
  onLoginClick: () => void;
  children?: ReactNode;
}

export type MotionSettings = {
  enablePageTransitions: boolean;
  enableCurtainSweep: boolean;
  enableScrollAnimations: boolean;
  enableParallax: boolean;
  transitionDuration: number;
  curtainColor: [number, number, number];
  debugMode: boolean;
};
