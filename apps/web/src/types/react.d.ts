declare module 'react' {
  export = React;
  export as namespace React;
  
  namespace React {
    interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
      type: T;
      props: P;
      key: Key | null;
    }
    
    type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null) | (new (props: P) => Component<any, any>);
    
    interface Component<P = {}, S = {}, SS = any> extends ComponentLifecycle<P, S, SS> {}
    
    interface ComponentLifecycle<P, S, SS = any> {}
    
    type Key = string | number;
    
    // React Core
    function createElement<P extends {}>(
      type: ComponentType<P> | string,
      props?: P | null,
      ...children: ReactNode[]
    ): ReactElement<P>;
    
    function createContext<T>(defaultValue: T): Context<T>;
    
    interface Context<T> {
      Provider: ComponentType<{ value: T; children?: ReactNode }>;
      Consumer: ComponentType<{ children: (value: T) => ReactNode }>;
    }
    
    // React Hooks
    function useRef<T>(initialValue: T): { current: T };
    function useRef<T>(initialValue: T | null): { current: T | null };
    function useRef<T = undefined>(): { current: T | undefined };
    
    function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
    function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
    
    function useEffect(effect: EffectCallback, deps?: DependencyList): void;
    
    function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T;
    
    function useMemo<T>(factory: () => T, deps: DependencyList | undefined): T;
    
    function useContext<T>(context: Context<T>): T;
    
    // React Lazy Loading
    function lazy<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>): T;
    
    // React Suspense
    const Suspense: ComponentType<{ children: ReactNode; fallback?: ReactNode }>;
    
    // React Types
    type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNodeArray;
    interface ReactNodeArray extends Array<ReactNode> {}
    
    type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
    type ComponentClass<P = {}, S = ComponentState> = new (props: P) => Component<P, S>;
    type FunctionComponent<P = {}> = (props: P) => ReactElement | null;
    
    interface ErrorInfo {
      componentStack: string;
    }
    
    type EffectCallback = () => (void | (() => void | undefined));
    type DependencyList = ReadonlyArray<any>;
    type Dispatch<A> = (value: A) => void;
    type SetStateAction<S> = S | ((prevState: S) => S);
    type ComponentState = any;
  }
}

declare module '@react-three/fiber' {
  export const Canvas: React.ComponentType<any>;
  export const useFrame: (callback: (state: any, delta: number) => void) => void;
  export const useLoader: (loader: any, url: string) => any;
  export const useThree: () => any;
  
  export interface ThreeElements {
    mesh: any;
    group: any;
    sphereGeometry: any;
    meshStandardMaterial: any;
    meshBasicMaterial: any;
    shaderMaterial: any;
    boxGeometry: any;
    coneGeometry: any;
  }
} 