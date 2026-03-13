import { useSharedValue } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import {
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";

// slack-catch-up-cards-swipe-animation 🔽

type Params = {
  triggerOffset: number;
  axis: "x" | "y";
};

export const useSingleHapticOnPanGesture = ({ triggerOffset, axis }: Params) => {
  // Gate haptics so we only fire once per threshold crossing
  const isHapticTriggered = useSharedValue(false);

  // Haptics must run on the JS thread; we call via scheduleOnRN from the UI worklet
  const handleHaptics = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isHapticTriggered.set(true);
  };

  // Use in gesture.onChange to emit a single haptic once the drag passes the threshold along the chosen axis
  const singleHapticOnChange = (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>
  ) => {
    "worklet";

    // Project gesture to axis and compare to absolute threshold
    const offset = axis === "x" ? event.translationX : event.translationY;

    // Fire when crossing forward over threshold (once)
    if (Math.abs(offset) > triggerOffset && !isHapticTriggered.value) {
      scheduleOnRN(handleHaptics);
    }

    // Reset when moving back under threshold so a new crossing can haptic again
    if (Math.abs(offset) < triggerOffset && isHapticTriggered.value) {
      isHapticTriggered.set(false);
    }
  };

  return { singleHapticOnChange };
};

// slack-catch-up-cards-swipe-animation 🔼
