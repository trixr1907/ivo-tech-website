import 'react';

declare module 'react' {
  export type FC<P = {}> = FunctionComponent<P>;
  export type ReactNode = ReactNode;
  export type RefObject<T> = { current: T | null };
  export type MouseEvent<T = Element> = Event & {
    currentTarget: T;
    target: T;
  };
  export type FormEvent<T = Element> = Event & {
    currentTarget: T;
    target: T;
  };

  export interface FunctionComponent<P = {}> {
    (props: P): JSX.Element | null;
    displayName?: string;
  }

  export interface ReactElement<P = any> {
    type: string | FunctionComponent<P>;
    props: P;
    key: string | number | null;
  }

  export const useState: <T>(initialState: T | (() => T)) => [T, (value: T | ((prev: T) => T)) => void];
  export const useEffect: (effect: () => void | (() => void), deps?: readonly any[]) => void;
  export const useRef: <T>(initialValue: T) => { current: T };
  export const useCallback: <T extends Function>(callback: T, deps: readonly any[]) => T;
  export const useMemo: <T>(factory: () => T, deps: readonly any[]) => T;
  export const useContext: <T>(context: Context<T>) => T;
  export const createContext: <T>(defaultValue: T) => Context<T>;
  export const useLayoutEffect: (effect: () => void | (() => void), deps?: readonly any[]) => void;
}

declare namespace JSX
  interface Element {
    type: any;
    props: any;
    key: string | number | null;
  }
}

declare module 'react' {
  // Types
  export interface FC<P = {}> {
    (props: P): JSX.Element | null;
    displayName?: string;
  }

  export type FunctionComponent<P = {}> = FC<P>;

  export interface ComponentType<P = {}> {
    (props: P): JSX.Element | null;
  }

  export type ReactNode =
    | string
    | number
    | boolean
    | null
    | undefined
    | ReactElement
    | ReactFragment
    | ReactPortal
    | Iterable<ReactNode>;

  export interface ReactElement<P = any> {
    type: ComponentType<P>;
    props: P;
    key: string | number | null;
  }

  export type ReactFragment = {} | Iterable<ReactNode>;
  export interface ReactPortal extends ReactElement {
    key: string | number | null;
    children: ReactNode;
  }

  // Event types
  export interface MouseEvent<T = Element> extends UIEvent {
    readonly target: T;
  }

  export interface FormEvent<T = Element> extends Event {
    readonly target: T;
  }

  interface ReactDefault {
    useState: typeof useState;
    useEffect: typeof useEffect;
    useRef: typeof useRef;
    useCallback: typeof useCallback;
    useMemo: typeof useMemo;
    useContext: typeof useContext;
    createContext: typeof createContext;
    useLayoutEffect: typeof useLayoutEffect;
    Suspense: typeof Suspense;
    FC: typeof FC;
    type ComponentType<P = {}> = ComponentType<P>;
    type ReactNode = ReactNode;
    type ReactElement<P = any> = ReactElement<P>;
    type MouseEvent<T = Element> = MouseEvent<T>;
    type FormEvent<T = Element> = FormEvent<T>;
  }

  // Hooks
  export function useState<T>(initialState: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useRef<T>(initialValue: T): { current: T };
  export function useCallback<T extends Function>(callback: T, deps: readonly any[]): T;
  export function useMemo<T>(factory: () => T, deps: readonly any[]): T;
  export function useContext<T>(context: Context<T>): T;
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useLayoutEffect(effect: () => void | (() => void), deps?: readonly any[]): void;

// Context
  export interface Context<T> {
    Provider: ComponentType<{ value: T }>;
    Consumer: ComponentType<{ children: (value: T) => ReactNode }>;
    displayName?: string;
  }

  // Component Types
  export interface FC<P = {}> {
    (props: P): Element | null;
    displayName?: string;
  }

  export interface FunctionComponent<P = {}> extends FC<P> {}

  export interface Component<P = {}, S = {}> {
    render(): Element | null;
    readonly props: Readonly<P>;
    state: Readonly<S>;
    setState(state: S | ((prevState: Readonly<S>, props: Readonly<P>) => S | null)): void;
    forceUpdate(callback?: () => void): void;
  }

  export interface ComponentClass<P = {}> {
    new(props: P): Component<P>;
    displayName?: string;
  }

  // Suspense
  export const Suspense: ComponentType<{ fallback?: ReactNode }>;

  const React: ReactDefault;
  export default React;
}
