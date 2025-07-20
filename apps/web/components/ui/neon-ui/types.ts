import { ReactNode, CSSProperties } from 'react';

export interface NeonContextType {
  is4DMode: boolean;
  audioContext?: AudioContext;
  analyserNode?: AnalyserNode;
  frequencyData?: Uint8Array;
  toggle4DMode: () => void;
}

export interface BaseNeonProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  glowColor?: string;
  intensity?: number;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  '4d'?: boolean;
}

export interface NeonButtonProps extends BaseNeonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  sparkles?: boolean;
  tiltIntensity?: number;
}

export interface NeonCardProps extends BaseNeonProps {
  title?: string;
  subtitle?: string;
  elevation?: number;
  interactive?: boolean;
  hoverOffset?: number;
}

export interface NeonModalProps extends BaseNeonProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showCloseButton?: boolean;
  backdropBlur?: boolean;
}

export interface SparkleProps {
  count?: number;
  size?: number;
  colors?: string[];
  duration?: number;
  trigger?: boolean;
}

export interface AnimatedGradientProps {
  colors: string[];
  speed?: number;
  direction?: number;
  audioReactive?: boolean;
  className?: string;
}

export interface HoudiniPaintProps {
  workletName: string;
  properties?: Record<string, string | number>;
  fallbackStyle?: CSSProperties;
}
