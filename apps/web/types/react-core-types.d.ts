import type {
  ReactNode,
  ReactElement,
  ComponentType,
  Component,
  RefObject,
  Ref,
  MouseEvent,
  FormEvent,
  CSSProperties,
  ErrorInfo,
  useLayoutEffect,
  FC,
  PropsWithChildren,
  HTMLAttributes,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  FormHTMLAttributes,
  SVGAttributes as ReactSVGAttributes
} from 'react';

// Re-export React types for consistent usage across the application
export type {
  ReactNode,
  ReactElement,
  ComponentType,
  Component,
  RefObject,
  Ref,
  MouseEvent,
  FormEvent,
  CSSProperties,
  ErrorInfo,
  useLayoutEffect,
  FC,
  PropsWithChildren,
  HTMLAttributes,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  FormHTMLAttributes,
  ReactSVGAttributes
};


// Base component type that includes common React props
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  key?: string | number;
}

// Type for components that can handle events
export interface EventHandlerProps {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onChange?: (event: FormEvent<HTMLElement>) => void;
}

// Type for components that need ref forwarding
export interface RefProps<T = any> {
  ref?: Ref<T>;
}

// Type for components that handle form events
export interface FormProps extends BaseComponentProps, EventHandlerProps {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  method?: 'get' | 'post';
  action?: string;
  encType?: string;
  noValidate?: boolean;
}

// Type for components that handle input events
export interface InputProps extends BaseComponentProps, EventHandlerProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'file' | 'checkbox' | 'radio' | 'range';
  value?: string | number | readonly string[] | undefined;
  defaultValue?: string | number | readonly string[] | undefined;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  pattern?: string;
  accept?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
}

// Type for error boundary components
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{
    error: Error;
    errorInfo: ErrorInfo;
  }>;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Type for components that need to extend Component
export class ExtendedComponent<P = {}, S = {}> extends Component<P, S> {
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }
}

// Type for dynamic components
export interface DynamicComponentProps<T = any> {
  component: ComponentType<T>;
  props?: T;
  fallback?: ReactNode;
}

// Type for layout components
export interface LayoutProps extends BaseComponentProps {
  header?: ReactNode;
  footer?: ReactNode;
  sidebar?: ReactNode;
  main?: ReactNode;
}

// Type for modal components
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  footer?: ReactNode;
}

// Type for portal components
export interface PortalProps extends BaseComponentProps {
  container?: Element | null;
}

// SSR safe useLayoutEffect
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useLayoutEffect;

// Helper type for components that need to handle async operations
export interface AsyncComponentProps<T = any> extends BaseComponentProps {
  isLoading?: boolean;
  error?: Error | null;
  data?: T;
  onRetry?: () => void;
}

// Helper type for conditional rendering
export type ConditionalWrap<P> = {
  condition: boolean;
  wrapper: (children: ReactElement<P>) => ReactElement;
  children: ReactElement<P>;
};
