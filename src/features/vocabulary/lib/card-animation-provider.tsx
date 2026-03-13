import { createContext, useCallback, type FC, type PropsWithChildren, useContext } from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  runOnJS,
  useSharedValue,
  withDecay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { SharedValue } from 'react-native-reanimated';
import { useStudyAnimation } from './study-animation-context';
import { useSingleHapticOnPan } from './use-single-haptic-pan';
import type { CardResult } from '../types';

const SPRING_CONFIG = { damping: 60, stiffness: 900 };

export type CardStackGesture = ReturnType<typeof Gesture.Race>;

type CardAnimationContextValue = {
  panX: SharedValue<number>;
  panY: SharedValue<number>;
  absoluteYAnchor: SharedValue<number>;
  panDistance: number;
  gesture: CardStackGesture;
};

const CardAnimationContext = createContext<CardAnimationContextValue | undefined>(undefined);

type CardAnimationProviderProps = PropsWithChildren<{
  onCardResult: (index: number, result: CardResult) => void;
}>;

export const CardAnimationProvider: FC<CardAnimationProviderProps> = ({
  children,
  onCardResult,
}) => {
  const {
    isDragging,
    animatedStudyIndex,
    currentStudyIndex,
    prevStudyIndex,
    isDone,
    total,
  } = useStudyAnimation();

  const { width, height } = useWindowDimensions();
  const panDistance = width / 4;

  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  const absoluteYAnchor = useSharedValue(0);

  const { singleHapticOnChange } = useSingleHapticOnPan({ triggerOffset: panDistance, axis: 'x' });

  const FLY_OFF_DURATION = 220;

  const fireDoneHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const advanceToNextCard = useCallback(
    (completedIdx: number, result: CardResult) => {
      prevStudyIndex.set(completedIdx);
      currentStudyIndex.set(completedIdx + 1);
      panX.set(0);
      panY.set(0);
      animatedStudyIndex.set(completedIdx + 1);
      if (completedIdx + 1 >= total) {
        isDone.set(true);
        fireDoneHaptic();
      }
      onCardResult(completedIdx, result);
    },
    [
      prevStudyIndex,
      currentStudyIndex,
      panX,
      panY,
      animatedStudyIndex,
      total,
      isDone,
      fireDoneHaptic,
      onCardResult,
    ]
  );

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      isDragging.set(true);
      absoluteYAnchor.set(event.absoluteY);
    })
    .onChange((event) => {
      const progress = currentStudyIndex.get() + Math.abs(event.translationX) / panDistance;
      const clamped = Math.min(progress, currentStudyIndex.get() + 1);
      animatedStudyIndex.set(clamped);
      panX.set(event.translationX);
      panY.set(event.translationY);
      singleHapticOnChange(event);
    })
    .onEnd((event) => {
      isDragging.set(false);

      if (Math.abs(event.translationX) > panDistance) {
        const completedIdx = Math.round(currentStudyIndex.get());
        const result: CardResult = event.translationX > 0 ? 'know' : 'dont_know';
        const sign = event.translationX > 0 ? 1 : -1;

        panX.set(
          withTiming(sign * width * 2, { duration: FLY_OFF_DURATION }, (finished) => {
            if (finished) {
              runOnJS(advanceToNextCard)(completedIdx, result);
            }
          })
        );
        panY.set(
          withSequence(
            withDecay({ velocity: event.velocityY }),
            withTiming(0, { duration: 0 })
          )
        );
      } else {
        panX.set(withSpring(0, SPRING_CONFIG));
        panY.set(withSpring(0, SPRING_CONFIG));
        animatedStudyIndex.set(
          withTiming(Math.floor(currentStudyIndex.get()), { duration: 200 })
        );
      }
    });

  const gesture = panGesture;

  const value: CardAnimationContextValue = {
    panX,
    panY,
    absoluteYAnchor,
    panDistance,
    gesture,
  };

  return (
    <CardAnimationContext.Provider value={value}>
      {children}
    </CardAnimationContext.Provider>
  );
};

export function useCardAnimation(): CardAnimationContextValue {
  const ctx = useContext(CardAnimationContext);
  if (ctx === undefined) {
    throw new Error('useCardAnimation must be used within CardAnimationProvider');
  }
  return ctx;
}
