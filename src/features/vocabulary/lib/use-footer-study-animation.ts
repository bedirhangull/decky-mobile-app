import { useRef, useCallback } from 'react';
import { useWindowDimensions } from 'react-native';
import { runOnJS, useAnimatedReaction, withTiming } from 'react-native-reanimated';
import type { CardResult } from '../types';
import { useStudyAnimation } from './study-animation-context';
import { useCardAnimation } from './card-animation-provider';

const FLY_OFF_DURATION = 220;

type FooterStudyAnimationParams = {
  onCardResult: (index: number, result: CardResult) => void;
};

export function useFooterStudyAnimation({ onCardResult }: FooterStudyAnimationParams) {
  const { width } = useWindowDimensions();
  const {
    isDragging,
    animatedStudyIndex,
    currentStudyIndex,
    prevStudyIndex,
    isKnowPressed,
    isDontKnowPressed,
    total,
    isDone,
  } = useStudyAnimation();
  const { panX, panY } = useCardAnimation();

  const onCardResultRef = useRef(onCardResult);
  onCardResultRef.current = onCardResult;

  const advanceAfterFly = useCallback(
    (completedIdx: number, result: CardResult) => {
      prevStudyIndex.set(completedIdx);
      currentStudyIndex.set(completedIdx + 1);
      panX.set(0);
      panY.set(0);
      animatedStudyIndex.set(completedIdx + 1);
      isKnowPressed.set(false);
      isDontKnowPressed.set(false);
      isDragging.set(false);
      if (completedIdx + 1 >= total) {
        isDone.set(true);
      }
      onCardResultRef.current(completedIdx, result);
    },
    [
      prevStudyIndex,
      currentStudyIndex,
      panX,
      panY,
      animatedStudyIndex,
      isKnowPressed,
      isDontKnowPressed,
      isDragging,
      total,
      isDone,
    ]
  );

  useAnimatedReaction(
    () => ({
      know: isKnowPressed.get(),
      dontKnow: isDontKnowPressed.get(),
    }),
    (curr, prev) => {
      if (curr.know && !prev?.know) {
        const completedIdx = currentStudyIndex.get();
        isDragging.set(true);
        panX.set(
          withTiming(width * 2, { duration: FLY_OFF_DURATION }, (finished) => {
            if (finished) {
              runOnJS(advanceAfterFly)(completedIdx, 'know');
            }
          })
        );
      }
      if (curr.dontKnow && !prev?.dontKnow) {
        const completedIdx = currentStudyIndex.get();
        isDragging.set(true);
        panX.set(
          withTiming(-width * 2, { duration: FLY_OFF_DURATION }, (finished) => {
            if (finished) {
              runOnJS(advanceAfterFly)(completedIdx, 'dont_know');
            }
          })
        );
      }
    }
  );
}
