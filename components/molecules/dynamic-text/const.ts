import type { TimingConfig, DotConfig, TextConfig } from './types';

export const DEFAULT_TIMING: TimingConfig = {
  interval: 2200,
  animationDuration: 500,
};

export const DEFAULT_DOT: DotConfig = {
  visible: false,
  size: 8,
  color: '#000000',
};

export const DEFAULT_TEXT: TextConfig = {
  fontSize: 16,
  fontWeight: '400',
  color: '#000000',
};
