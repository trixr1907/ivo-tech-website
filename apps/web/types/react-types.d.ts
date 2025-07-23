import * as React from 'react';

declare module 'react' {
  // Basis React-Typen
  export type ReactNode = React.ReactNode;
  export type ReactElement<P = any, T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>> = React.ReactElement<P, T>;
  export type ReactFragment = React.ReactFragment;
  export type ReactPortal = React.ReactPortal;
  export type RefObject<T> = React.RefObject<T>;
  export type MutableRefObject<T> = React.MutableRefObject<T>;
  export type Ref<T> = React.Ref<T>;
  export type ForwardedRef<T> = React.ForwardedRef<T>;
  export type RefAttributes<T> = React.RefAttributes<T>;
  export type LegacyRef<T> = React.LegacyRef<T>;
  export type PropsWithRef<P> = React.PropsWithRef<P>;
  export type PropsWithChildren<P = unknown> = P & { children?: ReactNode | undefined };
  export type ComponentType<P = {}> = React.ComponentType<P>;
  export type ElementType<P = any> = React.ElementType<P>;
  export type Key = React.Key;
  export type ComponentProps<T extends ElementType> = React.ComponentProps<T>;

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
  export type DragEvent<T = Element> = React.DragEvent<T>;
  export type CompositionEvent<T = Element> = React.CompositionEvent<T>;
  export type ClipboardEvent<T = Element> = React.ClipboardEvent<T>;
  export type PointerEvent<T = Element> = React.PointerEvent<T>;

  // Event Handler Typen
  export type EventHandler<E extends SyntheticEvent<any>> = {
    bivarianceHack(event: E): void;
  }["bivarianceHack"];
  export type ReactEventHandler<T = Element> = EventHandler<SyntheticEvent<T>>;
  export type MouseEventHandler<T = Element> = EventHandler<MouseEvent<T>>;
  export type KeyboardEventHandler<T = Element> = EventHandler<KeyboardEvent<T>>;
  export type TouchEventHandler<T = Element> = EventHandler<TouchEvent<T>>;
  export type WheelEventHandler<T = Element> = EventHandler<WheelEvent<T>>;
  export type AnimationEventHandler<T = Element> = EventHandler<AnimationEvent<T>>;
  export type TransitionEventHandler<T = Element> = EventHandler<TransitionEvent<T>>;
  export type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
  export type ChangeEventHandler<T = Element> = EventHandler<ChangeEvent<T>>;
  export type FocusEventHandler<T = Element> = EventHandler<FocusEvent<T>>;
  export type DragEventHandler<T = Element> = EventHandler<DragEvent<T>>;
  export type CompositionEventHandler<T = Element> = EventHandler<CompositionEvent<T>>;
  export type ClipboardEventHandler<T = Element> = EventHandler<ClipboardEvent<T>>;
  export type PointerEventHandler<T = Element> = EventHandler<PointerEvent<T>>;

  // Component-Typen
  export type FC<P = {}> = React.FC<P>;
  export type VFC<P = {}> = React.VFC<P>;
  export type FunctionComponent<P = {}> = React.FunctionComponent<P>;
  export type VoidFunctionComponent<P = {}> = React.VoidFunctionComponent<P>;
  export type Component<P = {}, S = {}> = React.Component<P, S>;
  export type PureComponent<P = {}, S = {}, SS = any> = React.PureComponent<P, S, SS>;
  export type ComponentClass<P = {}, S = {}> = React.ComponentClass<P, S>;
  export type ClassType<P, T extends Component<P, any>, C extends ComponentClass<P>> = React.ClassType<P, T, C>;

  // Error Boundary Typen
  export interface ErrorInfo {
    /**
     * Captures which component contained the exception, and its ancestors.
     */
    componentStack: string;
  }

  // Context Typen
  export type Context<T> = React.Context<T>;
  export const createContext: typeof React.createContext;
  export const useContext: typeof React.useContext;

  // Hook Typen
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useLayoutEffect: typeof React.useLayoutEffect;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useRef: typeof React.useRef;
  export const useImperativeHandle: typeof React.useImperativeHandle;
  export const useReducer: typeof React.useReducer;
  export const useDebugValue: typeof React.useDebugValue;

  // Style-Typen
  export interface CSSProperties extends React.CSSProperties {
    [key: string]: any;
  }

  // JSX Typen
  export namespace JSX {
    interface Element extends React.JSX.Element {}
    interface ElementClass extends React.JSX.ElementClass {}
    interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}
