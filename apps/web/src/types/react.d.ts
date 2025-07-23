declare module 'react' {
  export * from 'react';
  export const useState: <S>(initialState: S | (() => S)) => [S, (state: S | ((prev: S) => S)) => void];
  export const useEffect: (effect: () => void | (() => void), deps?: readonly any[]) => void;
  export const useRef: <T>(initialValue: T) => { current: T };
  export const useCallback: <T extends (...args: any[]) => any>(callback: T, deps: readonly any[]) => T;
  export const useMemo: <T>(factory: () => T, deps: readonly any[]) => T;
  export const useContext: <T>(context: React.Context<T>) => T;
  export const createContext: <T>(defaultValue: T) => React.Context<T>;
  export const forwardRef: <T, P = {}>(render: (props: P, ref: React.Ref<T>) => React.ReactElement | null) => (props: P & React.RefAttributes<T>) => React.ReactElement | null;
  export const memo: <P extends object>(Component: React.ComponentType<P>, propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean) => React.MemoExoticComponent<React.ComponentType<P>>;
  export const Suspense: React.ComponentType<{ fallback?: React.ReactNode; children?: React.ReactNode }>;
  export const lazy: <T extends React.ComponentType<any>>(factory: () => Promise<{ default: T }>) => T;
}
