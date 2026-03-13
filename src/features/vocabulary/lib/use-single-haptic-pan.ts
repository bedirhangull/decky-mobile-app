import { useCallback, useEffect } from 'react';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { GestureUpdateEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import type { PanGestureChangeEventPayload } from 'react-native-gesture-handler';

type Params = {
  triggerOffset: number;
  axis: 'x' | 'y';
};

export function useSingleHapticOnPan(params: Params) {
  const isHapticTriggered = useSharedValue(false);
  const triggerOffsetSv = useSharedValue(params.triggerOffset);
  const axisIsX = useSharedValue(params.axis === 'x' ? 1 : 0);

  useEffect(() => {
    triggerOffsetSv.value = params.triggerOffset;
    axisIsX.value = params.axis === 'x' ? 1 : 0;
  }, [params.triggerOffset, params.axis, triggerOffsetSv, axisIsX]);

  const fireHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isHapticTriggered.value = true;
  }, [isHapticTriggered]);

  const singleHapticOnChange = (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>
  ) => {
    'worklet';
    const offset = axisIsX.get() === 1 ? event.translationX : event.translationY;
    const threshold = triggerOffsetSv.get();
    if (Math.abs(offset) > threshold && !isHapticTriggered.get()) {
      isHapticTriggered.set(true);
      runOnJS(fireHaptic)();
    }
    if (Math.abs(offset) < threshold && isHapticTriggered.get()) {
      isHapticTriggered.set(false);
    }
  };

  return { singleHapticOnChange };
}
