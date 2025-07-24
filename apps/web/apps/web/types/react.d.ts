import 'react';

declare module 'react' {
  export * from 'react';
  export const useState: any;
  export const useEffect: any;
  export const useCallback: any;
  export const useMemo: any;
  export const useRef: any;
  export const useLayoutEffect: any;
  export const createContext: any;
  export const useContext: any;
  export const Suspense: any;
  export type FC<P = {}> = React.FunctionComponent<P>;
  export type ReactNode = React.ReactNode;
  export type MouseEvent = React.MouseEvent;
  export type RefObject<T> = React.RefObject<T>;
  export type ComponentType<P = {}> = React.ComponentType<P>;
}
