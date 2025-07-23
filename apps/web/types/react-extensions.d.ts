import * as React from 'react';

declare module 'react' {
  // Basis React-Typen
  export type ReactNode = React.ReactNode;
  export type ReactElement<P = any, T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>> = React.ReactElement<P, T>;
  export type ReactFragment = React.ReactFragment;
  export type ReactPortal = React.ReactPortal;
  export type ReactInstance = React.ReactInstance;

  // Component-Typen
  export type ComponentType<P = any> = React.ComponentType<P>;
  export type FunctionComponent<P = {}> = React.FunctionComponent<P>;
  export type FC<P = {}> = React.FC<P>;
  export type Component<P = {}, S = {}> = React.Component<P, S>;
  export type PureComponent<P = {}, S = {}> = React.PureComponent<P, S>;

  // Ref-Typen
  export type Ref<T> = React.Ref<T>;
  export type RefObject<T> = React.RefObject<T>;
  export type MutableRefObject<T> = React.MutableRefObject<T>;
  export type ForwardedRef<T> = React.ForwardedRef<T>;
  export type RefAttributes<T> = React.RefAttributes<T>;

  // Event-Typen
  export type SyntheticEvent<T = Element, E = Event> = React.SyntheticEvent<T, E>;
  export type MouseEvent<T = Element> = React.MouseEvent<T>;
  export type KeyboardEvent<T = Element> = React.KeyboardEvent<T>;
  export type TouchEvent<T = Element> = React.TouchEvent<T>;
  export type WheelEvent<T = Element> = React.WheelEvent<T>;
  export type AnimationEvent<T = Element> = React.AnimationEvent<T>;
  export type TransitionEvent<T = Element> = React.TransitionEvent<T>;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type FocusEvent<T = Element> = React.FocusEvent<T>;

  // Style-Typen
  export type CSSProperties = React.CSSProperties;
  export type StyleHTMLAttributes<T> = React.StyleHTMLAttributes<T>;

  // Error Boundary Typen
  export interface ErrorInfo {
    componentStack: string;
  }

  // Utility Typen
  export type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
  export type PropsWithRef<P> = P & { ref?: Ref<any> | undefined };
  export type Attributes = React.Attributes;
  export type ClassAttributes<T> = React.ClassAttributes<T>;

  // HTML/SVG Attribute Typen
  export interface HTMLAttributes<T> extends React.HTMLAttributes<T> {
    key?: string | number;
    ref?: Ref<T>;
    title?: string;
    role?: string;
    tabIndex?: number;
    style?: CSSProperties;
    className?: string;
    id?: string;
    'data-testid'?: string;
    'aria-label'?: string;
    'aria-hidden'?: boolean;
  }

  export interface SVGAttributes<T> extends React.SVGAttributes<T> {
    key?: string | number;
    ref?: Ref<T>;
    className?: string;
    style?: CSSProperties;
    fill?: string;
    stroke?: string;
    strokeWidth?: string | number;
    strokeLinecap?: 'butt' | 'round' | 'square';
    strokeLinejoin?: 'miter' | 'round' | 'bevel';
    strokeDasharray?: string | number;
    strokeDashoffset?: string | number;
    strokeMiterlimit?: string | number;
    strokeOpacity?: number;
    fillOpacity?: number;
    opacity?: number;
    points?: string;
    d?: string;
    rx?: string | number;
    ry?: string | number;
    transform?: string;
    filter?: string;
  }

  // Event Handler Typen
  export interface EventHandler<E extends SyntheticEvent<any>> {
    (event: E): void;
  }

  export interface MouseEventHandler<T = Element> {
    (event: MouseEvent<T>): void;
  }

  export interface TouchEventHandler<T = Element> {
    (event: TouchEvent<T>): void;
  }

  export interface KeyboardEventHandler<T = Element> {
    (event: KeyboardEvent<T>): void;
  }

  export interface FocusEventHandler<T = Element> {
    (event: FocusEvent<T>): void;
  }

  export interface FormEventHandler<T = Element> {
    (event: FormEvent<T>): void;
  }

  // Component Props
  export interface ComponentProps<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> {
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    ref?: React.Ref<T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : T>;
  }

  // Hooks
  export const useLayoutEffect: typeof React.useLayoutEffect;
  export const useImperativeHandle: typeof React.useImperativeHandle;
  export const createElement: typeof React.createElement;
}
