import {
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutUp,
  SlideInDown,
  SlideOutDown,
  SlideInLeft,
  SlideOutLeft,
  SlideInRight,
  SlideOutRight,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
import type { AnimationDirection, AnimationPreset, DynamicTextItem } from './types';

export function getAnimationPreset(
  preset: AnimationPreset,
  direction: AnimationDirection,
  duration: number,
) {
  switch (preset) {
    case 'slide': {
      switch (direction) {
        case 'up':
          return { entering: SlideInUp.duration(duration), exiting: SlideOutUp.duration(duration) };
        case 'down':
          return { entering: SlideInDown.duration(duration), exiting: SlideOutDown.duration(duration) };
        case 'left':
          return { entering: SlideInLeft.duration(duration), exiting: SlideOutLeft.duration(duration) };
        case 'right':
          return { entering: SlideInRight.duration(duration), exiting: SlideOutRight.duration(duration) };
        default:
          return { entering: SlideInUp.duration(duration), exiting: SlideOutUp.duration(duration) };
      }
    }
    case 'scale':
      return { entering: ZoomIn.duration(duration), exiting: ZoomOut.duration(duration) };
    case 'fade':
    default:
      return { entering: FadeIn.duration(duration), exiting: FadeOut.duration(duration) };
  }
}

export function normalizeItems(items: (string | DynamicTextItem)[]): DynamicTextItem[] {
  return items.map((item, index) => {
    if (typeof item === 'string') {
      return { id: String(index), text: item };
    }
    return item;
  });
}
