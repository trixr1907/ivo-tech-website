import type {
  ReactNode,
  ReactElement,
  ComponentType,
  RefObject,
  MouseEvent,
  FormEvent,
  ChangeEvent,
  FocusEvent
} from 'react';

// Basis-Komponenten-Props
export interface BaseProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Event-Handler-Props
export interface EventHandlerProps {
  onClick?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onChange?: (event: ChangeEvent) => void;
  onSubmit?: (event: FormEvent) => void;
}

// Ref-Props
export interface RefProps<T = HTMLElement> {
  ref?: RefObject<T>;
}

// Layout-Props
export interface LayoutProps extends BaseProps {
  onLoginClick?: () => void;
}

// Error-Boundary-Props
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactElement | ((error: Error) => ReactElement);
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Dynamische Import Props
export interface DynamicImportProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  loading?: ComponentType;
}

// Performance-Monitoring-Props
export interface MonitoringProviderProps extends BaseProps {
  enableMetrics?: boolean;
  sampleRate?: number;
}

// Navigation-Props
export interface NavigationProps extends BaseProps {
  onLoginClick: () => void;
  isAuthenticated?: boolean;
  userName?: string;
}

// Form-Props
export interface FormFieldProps extends BaseProps, EventHandlerProps {
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// Button-Props
export interface ButtonProps extends BaseProps, EventHandlerProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}
