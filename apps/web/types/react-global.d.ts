import 'react';

/// <reference types="react" />

declare module 'react' {
  // Core React Types
  export type ReactNode = React.ReactNode;
  export type ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> =
    React.ReactElement<P, T>;
  export type ComponentType<P = {}> = React.ComponentType<P>;
  export type ReactFragment = React.ReactFragment;
  export type ReactPortal = React.ReactPortal;
  export type Key = React.Key;

  // Ref Types
  export type Ref<T> = React.Ref<T>;
  export type RefObject<T> = { current: T | null };
  export type MutableRefObject<T> = { current: T };
  export type LegacyRef<T> = string | Ref<T>;
  export type RefCallback<T> = (instance: T | null) => void;

  // Component Types
  export type FC<P = {}> = React.FC<P>;
  export type FunctionComponent<P = {}> = React.FunctionComponent<P>;
  export type Component<P = {}, S = {}> = React.Component<P, S>;
  export type PureComponent<P = {}, S = {}> = React.PureComponent<P, S>;
  export type ComponentClass<P = {}, S = {}> = React.ComponentClass<P, S>;

  // Props Types
  export type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
  export type PropsWithRef<P> = P & { ref?: Ref<any> };
  export type HTMLAttributes<T> = React.HTMLAttributes<T>;
  export type SVGAttributes<T> = React.SVGAttributes<T>;
  export type CSSProperties = React.CSSProperties;

  // Event Types
  export type SyntheticEvent<T = Element, E = Event> = React.SyntheticEvent<T, E>;
  export type MouseEvent<T = Element> = React.MouseEvent<T>;
  export type KeyboardEvent<T = Element> = React.KeyboardEvent<T>;
  export type TouchEvent<T = Element> = React.TouchEvent<T>;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type FocusEvent<T = Element> = React.FocusEvent<T>;
  export type AnimationEvent<T = Element> = React.AnimationEvent<T>;
  export type TransitionEvent<T = Element> = React.TransitionEvent<T>;
  export type ClipboardEvent<T = Element> = React.ClipboardEvent<T>;
  export type CompositionEvent<T = Element> = React.CompositionEvent<T>;
  export type DragEvent<T = Element> = React.DragEvent<T>;
  export type PointerEvent<T = Element> = React.PointerEvent<T>;
  export type WheelEvent<T = Element> = React.WheelEvent<T>;

  // Event Handler Types
  export interface EventHandler<E extends SyntheticEvent<any>> {
    (event: E): void;
  }
  export type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
  export type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
  export type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
  export type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
  export type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
  export type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;

  // Error Boundary Types
  export interface ErrorInfo {
    componentStack: string;
  }
  
  export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
  }

  export interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
  }

  // Hook Types
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useContext: typeof React.useContext;
  export const useReducer: typeof React.useReducer;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useRef: typeof React.useRef;
  export const useLayoutEffect: typeof React.useLayoutEffect;
  export const useImperativeHandle: typeof React.useImperativeHandle;
  export const useDebugValue: typeof React.useDebugValue;

  // DOM Types
  export interface DOMAttributes<T> {
    children?: ReactNode;
    dangerouslySetInnerHTML?: {
      __html: string;
    };
    ref?: LegacyRef<T>;
    key?: Key;
    suppressContentEditableWarning?: boolean;
    suppressHydrationWarning?: boolean;
  }

  // Style Types
  export interface CSSProperties extends React.CSSProperties {
    [key: string]: React.CSSProperties[keyof React.CSSProperties] | undefined;
  }

  // JSX Types
  export namespace JSX {
    interface Element extends React.JSX.Element {}
    interface ElementClass extends React.JSX.ElementClass {}
    interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {}
    
    interface IntrinsicElements {
      div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
      span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
      a: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
      p: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
      button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
      input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
      img: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;
      form: React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
      select: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
      textarea: React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;
      svg: React.SVGProps<SVGSVGElement>;
      path: React.SVGProps<SVGPathElement>;
      circle: React.SVGProps<SVGCircleElement>;
      rect: React.SVGProps<SVGRectElement>;
      line: React.SVGProps<SVGLineElement>;
      g: React.SVGProps<SVGGElement>;
      defs: React.SVGProps<SVGDefsElement>;
      linearGradient: React.SVGProps<SVGLinearGradientElement>;
      radialGradient: React.SVGProps<SVGRadialGradientElement>;
      stop: React.SVGProps<SVGStopElement>;
      clipPath: React.SVGProps<SVGClipPathElement>;
      mask: React.SVGProps<SVGMaskElement>;
      pattern: React.SVGProps<SVGPatternElement>;
      filter: React.SVGProps<SVGFilterElement>;
    }
  }
  // Core React types
  export type ReactNode = import('react').ReactNode;
  export type ReactElement = import('react').ReactElement;
  export type RefObject<T> = import('react').RefObject<T>;
  export type MutableRefObject<T> = import('react').MutableRefObject<T>;
  export type Ref<T> = import('react').Ref<T>;
  export type ForwardedRef<T> = import('react').ForwardedRef<T>;
  export type RefAttributes<T> = import('react').RefAttributes<T>;
  export type ErrorInfo = import('react').ErrorInfo;
  export type Component<P = {}, S = {}> = import('react').Component<P, S>;
  export type FC<P = {}> = import('react').FC<P>;
  export type CSSProperties = import('react').CSSProperties;
  export const cache: any;
  export const useLayoutEffect: typeof import('react').useLayoutEffect;

  // Event types
  export type FormEvent<T = Element> = import('react').FormEvent<T>;
  export type MouseEvent<T = Element> = import('react').MouseEvent<T>;
  export type TouchEvent<T = Element> = import('react').TouchEvent<T>;
  export type ChangeEvent<T = Element> = import('react').ChangeEvent<T>;
  export type KeyboardEvent<T = Element> = import('react').KeyboardEvent<T>;

  // Props types
  export interface CommonAttributes {
    key?: string | number;
    ref?: Ref<any>;
    className?: string;
    style?: CSSProperties;
    title?: string;
    id?: string;
    role?: string;
    tabIndex?: number;
    children?: ReactNode;
  }

  export interface EventHandlers {
    onClick?: (event: MouseEvent) => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onTouchStart?: (event: TouchEvent) => void;
    onTouchEnd?: (event: TouchEvent) => void;
    onSubmit?: (event: FormEvent) => void;
    onChange?: (event: ChangeEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
  }

  // Add missing JSX types
  declare global {
    namespace JSX {
      interface IntrinsicElements {
        div: CommonAttributes & EventHandlers & {
          dangerouslySetInnerHTML?: { __html: string };
        };
        button: CommonAttributes & EventHandlers & {
          type?: "button" | "submit" | "reset";
          disabled?: boolean;
        };
        a: CommonAttributes & EventHandlers & {
          href?: string;
          target?: "_self" | "_blank" | "_parent" | "_top";
          rel?: string;
        };
        input: CommonAttributes & EventHandlers & {
          type?: "text" | "number" | "password" | "email" | "checkbox" | "radio" | "range";
          value?: string | number;
          checked?: boolean;
          placeholder?: string;
          disabled?: boolean;
        };
      }
    }
  }
}
