import type {
  HTMLAttributes,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  FormHTMLAttributes,
  ImgHTMLAttributes,
  VideoHTMLAttributes,
  AudioHTMLAttributes,
  IframeHTMLAttributes,
  CanvasHTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  LabelHTMLAttributes,
  OptgroupHTMLAttributes,
  OptionHTMLAttributes,
  ReactSVGAttributes
} from './react-core-types';

// Common HTML Attributes
export interface CommonHTMLAttributes extends HTMLAttributes<HTMLElement> {
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
}

// Button Attributes
export interface ButtonAttributes extends ButtonHTMLAttributes<HTMLButtonElement>, CommonHTMLAttributes {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  name?: string;
  value?: string | number | readonly string[];
  form?: string;
}

// Anchor Attributes
export interface AnchorAttributes extends AnchorHTMLAttributes<HTMLAnchorElement>, CommonHTMLAttributes {
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  download?: any;
}

// Input Attributes
export interface InputAttributes extends InputHTMLAttributes<HTMLInputElement>, CommonHTMLAttributes {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'file' | 'checkbox' | 'radio' | 'range' | 'color' | 'hidden';
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  max?: number | string;
  min?: number | string;
  step?: number | string;
  pattern?: string;
  maxLength?: number;
  minLength?: number;
  accept?: string;
  multiple?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  form?: string;
}

// Textarea Attributes
export interface TextareaAttributes extends TextareaHTMLAttributes<HTMLTextAreaElement>, CommonHTMLAttributes {
  rows?: number;
  cols?: number;
  wrap?: 'soft' | 'hard';
  maxLength?: number;
  minLength?: number;
}

// Select Attributes
export interface SelectAttributes extends SelectHTMLAttributes<HTMLSelectElement>, CommonHTMLAttributes {
  multiple?: boolean;
  size?: number;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
}

// Form Attributes
export interface FormAttributes extends FormHTMLAttributes<HTMLFormElement>, CommonHTMLAttributes {
  action?: string;
  method?: 'get' | 'post';
  encType?: string;
  target?: string;
  noValidate?: boolean;
  autoComplete?: 'on' | 'off';
}

// Image Attributes
export interface ImageAttributes extends ImgHTMLAttributes<HTMLImageElement>, CommonHTMLAttributes {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  loading?: 'eager' | 'lazy';
  decoding?: 'sync' | 'async' | 'auto';
  srcSet?: string;
  sizes?: string;
}

// Video Attributes
export interface VideoAttributes extends VideoHTMLAttributes<HTMLVideoElement>, CommonHTMLAttributes {
  src?: string;
  poster?: string;
  preload?: 'none' | 'metadata' | 'auto';
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

// Audio Attributes
export interface AudioAttributes extends AudioHTMLAttributes<HTMLAudioElement>, CommonHTMLAttributes {
  src?: string;
  preload?: 'none' | 'metadata' | 'auto';
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
}

// Iframe Attributes
export interface IframeAttributes extends IframeHTMLAttributes<HTMLIFrameElement>, CommonHTMLAttributes {
  src?: string;
  srcdoc?: string;
  name?: string;
  sandbox?: string;
  allow?: string;
  allowFullScreen?: boolean;
  loading?: 'eager' | 'lazy';
  referrerPolicy?: string;
}

// Canvas Attributes
export interface CanvasAttributes extends CanvasHTMLAttributes<HTMLCanvasElement>, CommonHTMLAttributes {
  width?: number;
  height?: number;
}

// Table Related Attributes
export interface TableAttributes extends TableHTMLAttributes<HTMLTableElement>, CommonHTMLAttributes {
  summary?: string;
}

export interface ThAttributes extends ThHTMLAttributes<HTMLTableHeaderCellElement>, CommonHTMLAttributes {
  scope?: 'row' | 'col' | 'rowgroup' | 'colgroup';
  abbr?: string;
}

export interface TdAttributes extends TdHTMLAttributes<HTMLTableDataCellElement>, CommonHTMLAttributes {
  headers?: string;
}

// Label Attributes
export interface LabelAttributes extends LabelHTMLAttributes<HTMLLabelElement>, CommonHTMLAttributes {
  htmlFor?: string;
  form?: string;
}

// Option Related Attributes
export interface OptgroupAttributes extends OptgroupHTMLAttributes<HTMLOptGroupElement>, CommonHTMLAttributes {
  disabled?: boolean;
  label: string;
}

export interface OptionAttributes extends OptionHTMLAttributes<HTMLOptionElement>, CommonHTMLAttributes {
  disabled?: boolean;
  label?: string;
  selected?: boolean;
  value?: string | number | readonly string[];
}

// SVG Attributes
export interface SVGAttributes extends ReactSVGAttributes<SVGElement> {
  className?: string;
  style?: React.CSSProperties;
  viewBox?: string;
  preserveAspectRatio?: string;
  xmlns?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  strokeDasharray?: string | number;
  strokeDashoffset?: string | number;
  strokeOpacity?: number;
  fillOpacity?: number;
  opacity?: number;
  transform?: string;
}

// Export all HTML types
export type {
  HTMLAttributes,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  FormHTMLAttributes,
  ImgHTMLAttributes,
  VideoHTMLAttributes,
  AudioHTMLAttributes,
  IframeHTMLAttributes,
  CanvasHTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  LabelHTMLAttributes,
  OptgroupHTMLAttributes,
  OptionHTMLAttributes
};
