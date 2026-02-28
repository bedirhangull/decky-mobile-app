import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { BaseAnimationBuilder, EntryExitAnimationFunction } from 'react-native-reanimated';

export interface DynamicTextItem {
  id: string;
  text: string;
}

export type AnimationPreset = 'fade' | 'slide' | 'scale';
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

export interface TimingConfig {
  interval: number;
  animationDuration: number;
}

export interface DotConfig {
  visible: boolean;
  size: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}

export interface TextConfig {
  fontSize: number;
  fontWeight: string;
  color: string;
  style?: StyleProp<TextStyle>;
}

export interface IDynamicText {
  items: (string | DynamicTextItem)[];
  loop?: boolean;
  loopCount?: number;
  animationPreset?: AnimationPreset;
  animationDirection?: AnimationDirection;
  customEntering?: BaseAnimationBuilder | typeof BaseAnimationBuilder | EntryExitAnimationFunction;
  customExiting?: BaseAnimationBuilder | typeof BaseAnimationBuilder | EntryExitAnimationFunction;
  timing?: Partial<TimingConfig>;
  dot?: Partial<DotConfig>;
  text?: Partial<TextConfig>;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onAnimationComplete?: () => void;
  onIndexChange?: (index: number, item: DynamicTextItem) => void;
  paused?: boolean;
  initialIndex?: number;
  accessibilityLabel?: string;
}
