import { MouseEventHandler, FocusEventHandler, FormEventHandler, DragEventHandler, ChangeEventHandler } from 'react';

import type {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
  OptionHTMLAttributes,
  FormHTMLAttributes,
  ImgHTMLAttributes,
  AnchorHTMLAttributes,
  SVGAttributes as ReactSVGAttributes,
  HTMLAttributes,
  StyleHTMLAttributes,
  HTMLStyleElement
} from 'react';

export interface CommonAttributes extends HTMLAttributes<HTMLElement> {}

export interface ButtonAttributes extends ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  title?: string;
}

export interface InputAttributes extends InputHTMLAttributes<HTMLInputElement> {
  type?: 'text' | 'number' | 'password' | 'email' | 'tel' | 'url' | 'search' | 'checkbox' | 'radio' | 'file' | 'hidden' | 'range';
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  checked?: boolean;
  defaultChecked?: boolean;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  pattern?: string;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
}

export interface TextAreaAttributes extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  rows?: number;
  cols?: number;
  wrap?: 'soft' | 'hard';
}

export interface SelectAttributes extends SelectHTMLAttributes<HTMLSelectElement> {
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  name?: string;
  size?: number;
}

export interface OptionAttributes extends CommonAttributes {
  value?: string | number | readonly string[];
  disabled?: boolean;
  selected?: boolean;
  label?: string;
}

export interface FormAttributes extends FormHTMLAttributes<HTMLFormElement> {
  action?: string;
  method?: 'get' | 'post';
  target?: '_self' | '_blank' | '_parent' | '_top';
  encType?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
  noValidate?: boolean;
  autoComplete?: 'on' | 'off';
}

export interface ImageAttributes extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  loading?: 'eager' | 'lazy';
  srcSet?: string;
  sizes?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
}

export interface AnchorAttributes extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  target?: '_self' | '_blank' | '_parent' | '_top';
  rel?: string;
  download?: string;
  hrefLang?: string;
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
}

export interface SVGAttributes extends ReactSVGAttributes<SVGElement> {
  viewBox?: string;
  width?: number | string;
  height?: number | string;
  xmlns?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number | string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'round' | 'bevel';
  points?: string;
  d?: string;
  transform?: string;
  preserveAspectRatio?: string;
  style?: React.CSSProperties;
  ref?: React.RefObject<SVGElement>;
}
