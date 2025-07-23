import * as React from 'react';

import * as CSS from 'csstype';

declare module 'react' {
  // React Core Types
  export type ReactNode = string | number | boolean | null | undefined | ReactElement | ReactFragment | ReactPortal | ReactProvider<any> | ReactConsumer<any>;
  export type ReactElement<P = any> = {
    type: string | ComponentType<P>;
    props: P;
    key: string | number | null;
  };
  export type ReactFragment = Iterable<ReactNode>;
  export type ReactPortal = any;
  export type ReactProvider<T> = any;
  export type ReactConsumer<T> = any;
  export type FunctionComponent<P = {}> = (props: P & { children?: ReactNode }) => ReactElement<any, any> | null;
  export type FC<P = {}> = FunctionComponent<P>;
  export type ComponentType<P = any> = FunctionComponent<P> | ClassType<P, any, any>;
  export type ClassType<P, T, S> = { new(props: P, context?: any): T; };
  export type Component<P = {}, S = {}> = { 
    props: P;
    state: S;
    setState(state: Partial<S> | ((prevState: S, props: P) => Partial<S>), callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
  };
  export type CSSProperties = any;
  export type RefObject<T> = { current: T | null };
  export type MutableRefObject<T> = { current: T };
  export type Ref<T> = ((instance: T | null) => void) | RefObject<T> | null;
  export type ForwardedRef<T> = ((instance: T | null) => void) | MutableRefObject<T> | null;
  export type RefAttributes<T> = { ref?: Ref<T> };

  // Event Types
  export interface BaseSyntheticEvent<E = object, C = any, T = any> {
    nativeEvent: E;
    currentTarget: C;
    target: T;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    preventDefault(): void;
    stopPropagation(): void;
    persist(): void;
    timeStamp: number;
    type: string;
  }

  export type SyntheticEvent<T = Element, E = Event> = BaseSyntheticEvent<E, EventTarget & T, EventTarget>;
  export type FormEvent<T = Element> = SyntheticEvent<T, Event>;
  export type MouseEvent<T = Element> = SyntheticEvent<T, MouseEvent> & {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  };
  export type KeyboardEvent<T = Element> = SyntheticEvent<T, KeyboardEvent> & {
    altKey: boolean;
    charCode: number;
    ctrlKey: boolean;
    key: string;
    keyCode: number;
    locale: string;
    location: number;
    metaKey: boolean;
    repeat: boolean;
    shiftKey: boolean;
    which: number;
  };
  export type TouchEvent<T = Element> = SyntheticEvent<T, TouchEvent> & {
    altKey: boolean;
    changedTouches: TouchList;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    targetTouches: TouchList;
    touches: TouchList;
  };
  export type ChangeEvent<T = Element> = SyntheticEvent<T> & {
    target: EventTarget & {
      value?: string | number | boolean;
      checked?: boolean;
      files?: FileList;
      options?: HTMLOptionElement[];
      selectedIndex?: number;
    };
  };
  export type FocusEvent<T = Element> = SyntheticEvent<T> & {
    relatedTarget: EventTarget | null;
  };

  // Error Boundary Types
  export interface ErrorInfo {
    componentStack: string;
  }
  export interface ErrorBoundary<P = any, S = any> extends Component<P, S> {
    componentDidCatch?(error: Error, errorInfo: ErrorInfo): void;
    static getDerivedStateFromError?(error: Error): Partial<S>;    
  }

  // Element Types
  export interface HTMLAttributes<T> extends React.HTMLAttributes<T> {
    key?: string | number;
    ref?: Ref<T>;
    title?: string;
  }

  export interface SVGAttributes<T> extends React.SVGAttributes<T> {
    key?: string | number;
    ref?: Ref<T>;
    strokeWidth?: string | number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'miter' | 'round' | 'bevel';
    strokeMiterlimit?: string | number;
    strokeDasharray?: string | number;
    strokeDashoffset?: string | number;
    strokeOpacity?: string | number;
  }

  // Common Props
  export interface CommonAttributes {
    key?: string | number;
    ref?: Ref<any>;
    className?: string;
    style?: CSSProperties;
    title?: string;
    'aria-label'?: string;
    'aria-hidden'?: boolean;
  }

  // Event Handlers
  export interface EventHandlers {
    onClick?: (event: MouseEvent) => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    onChange?: (event: ChangeEvent) => void;
    onSubmit?: (event: FormEvent) => void;
  }

  // DOM Element Types
  export interface HTMLElementTagNameMap {
    button: HTMLButtonElement & { type?: 'button' | 'submit' | 'reset' };
    input: HTMLInputElement & { type?: string };
    div: HTMLDivElement;
    span: HTMLSpanElement;
    a: HTMLAnchorElement & { href?: string; target?: string; rel?: string };
    canvas: HTMLCanvasElement & { width?: number; height?: number };
  }

  // Component Props
  export interface ComponentProps<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    ref?: React.Ref<T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : T>;
  }
}
