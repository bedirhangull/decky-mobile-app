import { FC } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { RubberContainer } from "./rubber-container";
import { cn } from "@/src/shared/lib/utils/cn";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { scheduleOnRN } from "react-native-worklets";
import { TimerStep } from "../../lib/types";

// opal-set-timer-slider-animation 🔽

// Slider dimensions: 71% of screen width for optimal touch target and visual balance
const SLIDER_WIDTH = Dimensions.get("window").width * 0.71;
const SLIDER_HEIGHT = 40;

type Props = {
  data: TimerStep[];
  value: SharedValue<number>;
  presentationState: SharedValue<number>;
};

export const Slider: FC<Props> = ({ data, value, presentationState }) => {
  const totalSteps = data.length;
  const stepWidth = SLIDER_WIDTH / totalSteps; // Width per step for discrete snapping

  // Shared values coordinate slider state across gesture and animation
  const progress = useSharedValue(stepWidth); // Current progress bar width (starts at first step)

  const stepValues = useSharedValue<number[]>(data.map((d) => d.value)); // Cached step values for value lookup
  const startX = useSharedValue(0); // Initial touch position (currently unused but reserved for future use)
  const lastStepCount = useSharedValue(0); // Tracks last step index to detect step changes for haptics

  // Pan gesture handles slider interaction with discrete step snapping
  const gesture = Gesture.Pan()
    .onBegin((event) => {
      const tapX = event.x;

      // Calculate which step was tapped: Math.ceil ensures tapping anywhere in step selects it
      // Clamp to [1, totalSteps-1] to prevent selecting first/last step (edge cases)
      const tappedStepIndex = Math.ceil(tapX / stepWidth);
      const clampedStepIndex = Math.max(1, Math.min(tappedStepIndex, totalSteps - 1));

      // Calculate progress width: last step uses full width, others use step index * stepWidth
      const newProgress =
        clampedStepIndex === totalSteps - 1
          ? SLIDER_WIDTH
          : Math.max(0, Math.min(clampedStepIndex * stepWidth, SLIDER_WIDTH));
      progress.set(newProgress);

      const newValue = data[clampedStepIndex].value;

      value.set(newValue); // Update shared value that other components react to

      startX.set(event.x);
      lastStepCount.set(clampedStepIndex); // Initialize step tracking
    })
    .onChange((event) => {
      const currentX = event.x;

      // Recalculate step index during drag
      const currentStepIndex = Math.ceil(currentX / stepWidth);
      const clampedStepIndex = Math.max(1, Math.min(currentStepIndex, totalSteps - 1));

      // Only update when step changes to avoid unnecessary calculations and haptics
      if (clampedStepIndex !== lastStepCount.get()) {
        lastStepCount.set(clampedStepIndex);

        const newProgress =
          clampedStepIndex === totalSteps - 1
            ? SLIDER_WIDTH
            : Math.max(0, Math.min(clampedStepIndex * stepWidth, SLIDER_WIDTH));
        progress.set(newProgress);

        const newValue = data[clampedStepIndex].value;
        value.set(newValue);
      }
    });

  // Haptic feedback function: must be called from React Native thread, not worklet thread
  const fireHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // React to progress changes: fire haptic on iOS when step changes
  // scheduleOnRN bridges worklet thread to RN thread for haptic API access
  useAnimatedReaction(
    () => progress.get(),
    () => {
      if (Platform.OS === "android") return; // Android haptics handled differently if needed
      scheduleOnRN(fireHaptic);
    }
  );

  // Sync slider progress when value changes externally (e.g., from stepper buttons)
  // Only updates when slider is visible (presentationState !== 1) to prevent conflicts
  useAnimatedReaction(
    () => value.get(),
    (newValue) => {
      if (presentationState.get() === 1) return; // Skip if slider is hidden

      // Find step index for new value and update progress accordingly
      const tappedStepIndex = stepValues.get().findIndex((v) => v === newValue);
      const clampedStepIndex = Math.max(1, Math.min(tappedStepIndex, totalSteps - 1));

      if (tappedStepIndex !== -1) {
        const newProgress =
          clampedStepIndex === totalSteps - 1
            ? SLIDER_WIDTH
            : Math.max(0, Math.min(clampedStepIndex * stepWidth, SLIDER_WIDTH));
        progress.set(newProgress);
        lastStepCount.set(clampedStepIndex);
      }
    }
  );

  // Progress bar width animation: high stiffness (1600) for snappy response, moderate damping (140) for smooth motion
  // Spring animation creates natural feel when progress updates from gestures or external value changes
  const rProgressStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(progress.get(), { damping: 140, stiffness: 1600 }),
    };
  });

  // RubberContainer wraps slider to add rubber band stretch effect on drag
  return (
    <RubberContainer width={SLIDER_WIDTH} height={SLIDER_HEIGHT} gestures={[gesture]}>
      <View
        style={styles.container}
        className={cn(
          "flex-1 border-neutral-700 rounded-2xl overflow-hidden py-2.5",
          Platform.OS === "android" && "bg-neutral-900 border-neutral-800"
        )}
      >
        {/* iOS blur effect: BlurView only works on iOS, Android uses solid background */}
        {Platform.OS === "ios" && <BlurView style={StyleSheet.absoluteFill} tint="light" />}
        {/* Step markers: alternating full/half height for visual rhythm, first marker hidden */}
        <View className="flex-1 flex-row">
          {data.map((item, index) => (
            <View
              key={item.value}
              className="items-start justify-center"
              style={{ width: stepWidth }}
            >
              <View
                className={cn(
                  "bg-neutral-700 w-[2px] rounded-full",
                  index === 0 ? "h-full opacity-0" : index % 2 === 0 ? "h-full" : "h-1/2 opacity-70"
                )}
              />
            </View>
          ))}
        </View>
        {/* Animated progress bar: absolute positioned overlay that grows from left */}
        <Animated.View className="absolute left-0 top-0 bottom-0 bg-white" style={rProgressStyle} />
      </View>
    </RubberContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
  },
});

// opal-set-timer-slider-animation 🔼
