declare module 'react' {
  export type FC<P = {}> = React.FunctionComponent<P>;
  export type ReactNode = React.ReactNode;
  export type MouseEvent = React.MouseEvent;
  export type RefObject<T> = React.RefObject<T>;
  
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useRef: typeof React.useRef;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useContext: typeof React.useContext;
  export const createContext: typeof React.createContext;
  export const Suspense: typeof React.Suspense;
  export const useLayoutEffect: typeof React.useLayoutEffect;
}
