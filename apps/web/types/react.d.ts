import * as React from 'react';

declare module 'react' {
  import { Component, ReactNode, ErrorInfo } from 'react';

  export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
  }

  export interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
  }

  export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState;
    props: ErrorBoundaryProps;
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): ReactNode;
  }
  export * from 'react';
  export {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
    useLayoutEffect,
    Suspense,
    lazy,
    createContext,
    useContext,
    Component,
    ReactNode,
    CSSProperties,
    FC,
    RefObject,
    MouseEvent,
    FormEvent,
    ComponentType,
    ErrorInfo,
    forwardRef,
    memo,
    useImperativeHandle,
    createElement,
    Ref,
    FunctionComponent,
  } from 'react';

  export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
  }

  export interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
  }

  export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): ReactNode;
  }
}
