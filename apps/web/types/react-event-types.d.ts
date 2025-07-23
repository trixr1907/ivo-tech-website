import { ReactNode, RefObject, MouseEvent, FormEvent, CSSProperties } from 'react';

export interface ReactEventProps {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onChange?: (event: FormEvent<HTMLInputElement>) => void;
}

export interface StyleProps {
  style?: CSSProperties;
  className?: string;
}

export interface RefProps<T = any> {
  ref?: RefObject<T>;
}

export interface ChildrenProps {
  children?: ReactNode;
}

export interface BaseComponentProps extends ReactEventProps, StyleProps, RefProps, ChildrenProps {
  id?: string;
  key?: string | number;
  title?: string;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  hidden?: boolean;
}

// Layout Component Props
export interface LayoutProps extends BaseComponentProps {
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  display?: 'block' | 'inline' | 'flex' | 'grid' | 'none';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  margin?: string | number;
}

// Form Component Props
export interface FormProps extends BaseComponentProps {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  method?: 'get' | 'post';
  action?: string;
  encType?: string;
  autoComplete?: 'on' | 'off';
  noValidate?: boolean;
}

export interface InputProps extends BaseComponentProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'file';
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  onChange?: (event: FormEvent<HTMLInputElement>) => void;
}

// Animation Props
export interface AnimationProps extends BaseComponentProps {
  animate?: boolean | object;
  initial?: object;
  exit?: object;
  transition?: object;
  variants?: {
    [key: string]: object;
  };
}

// useLayoutEffect type with SSR support
export const useIsomorphicLayoutEffect: typeof React.useLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

// Common event handler types
export type MouseEventHandler = (event: MouseEvent<HTMLElement>) => void;
export type FormEventHandler = (event: FormEvent<HTMLElement>) => void;

// Utility type for components with dynamic props
export type DynamicProps<T> = T & {
  [key: string]: any;
};
