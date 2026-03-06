import { FC, PropsWithChildren } from "react";
import { View, StyleSheet, Pressable, Platform, Dimensions } from "react-native";
import { TimerStep } from "../../lib/types";
import {
  SharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { BlurView } from "expo-blur";
import { Minus, Plus } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated from "react-native-reanimated";
import { cn } from "@/src/shared/lib/utils/cn";

// opal-set-timer-slider-animation 🔽

// Stepper dimensions: 22% screen width for center button
const WIDTH = Dimensions.get("window").width * 0.22;
const HEIGHT = 40;
// Tap detection thresholds: rapid taps (within 300ms) trigger slider presentation
const TIME_THRESHOLD = 300; // Milliseconds between taps to count as rapid sequence
const CLICKS_THRESHOLD = 3; // Number of rapid taps needed to trigger slider

type StepperButtonProps = {
  onPress: () => void;
};

const StepperButton: FC<PropsWithChildren<StepperButtonProps>> = ({ onPress, children }) => {
  return (
    <Pressable
      className={cn(
        "aspect-square rounded-full border border-neutral-700 items-center justify-center overflow-hidden",
        Platform.OS === "android" && "bg-neutral-900 border-neutral-800"
      )}
      style={{ height: HEIGHT, borderWidth: StyleSheet.hairlineWidth }}
      onPress={onPress}
      onPressIn={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      }}
    >
      {Platform.OS === "ios" && <BlurView style={StyleSheet.absoluteFill} tint="light" />}
      {children}
    </Pressable>
  );
};

type Props = {
  data: TimerStep[];
  value: SharedValue<number>;
  onPressHandler: () => void;
  presentationState: SharedValue<number>;
};

export const Stepper: FC<Props> = ({ data, value, onPressHandler, presentationState }) => {
  // Shared values for button press animation and rapid tap detection
  const pressScale = useSharedValue(1); // Scale animation for center button press feedback
  const tapCount = useSharedValue(0); // Counter for rapid tap detection
  const lastTapTime = useSharedValue(0); // Timestamp of last tap for threshold calculation

  // Format timer value: minutes (< 60) or hours (>= 60) with appropriate suffix
  // useDerivedValue automatically updates when value changes, optimized for worklet thread
  const stringValue = useDerivedValue(() => {
    if (value.get() < 60) return `${value.get()}m`;
    return `${Math.floor(value.get() / 60)}h`;
  });

  // Rapid tap detection: if taps occur within TIME_THRESHOLD, increment counter
  // When CLICKS_THRESHOLD reached, trigger slider presentation
  const handleStepperPress = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime.get();

    // Reset counter if too much time passed since last tap
    if (timeSinceLastTap > TIME_THRESHOLD) {
      tapCount.set(1);
      lastTapTime.set(now);
      return;
    }

    tapCount.set(tapCount.get() + 1);
    lastTapTime.set(now);

    // Trigger slider presentation on rapid tap sequence
    if (tapCount.get() >= CLICKS_THRESHOLD) {
      tapCount.set(0);
      lastTapTime.set(0);
      onPressHandler();
    }
  };

  // Center button press animation: quick scale-down then scale-up for tactile feedback
  // withSequence chains animations: first timing scales down, second scales back up
  const handlePress = () => {
    pressScale.set(
      withSequence(withTiming(0.95, { duration: 100 }), withTiming(1, { duration: 100 }))
    );
    onPressHandler();
  };

  // Stepper buttons fade out as slider appears: opacity inversely tied to presentationState
  // presentationState: 0 = stepper visible, 1 = slider visible
  const rStepperButtonStyle = useAnimatedStyle(() => {
    return {
      opacity: 1 - presentationState.get(),
    };
  });

  // Center button slides left when slider appears: translateX moves by button height + gap
  // High stiffness (1400) ensures quick response, moderate damping (90) prevents overshoot
  // Scale transform applied on top of translation for press feedback
  const rCenterButtonStyle = useAnimatedStyle(() => {
    const targetX = -presentationState.get() * (HEIGHT + 6); // 6px gap between button and slider
    const translateX = withSpring(targetX, {
      damping: 90,
      stiffness: 1400,
    });

    return {
      transform: [{ translateX }, { scale: pressScale.get() }], // Translation first, then scale
    };
  });

  return (
    <View className="flex-row items-center justify-center gap-2">
      <Animated.View style={rStepperButtonStyle}>
        <StepperButton
          onPress={() => {
            handleStepperPress();
            const currentIndex = data.findIndex((item) => item.value === value.get());
            if (currentIndex === 1) return;
            value.set(data[currentIndex - 1].value);
          }}
        >
          <Minus size={16} color="#f5f5f5" />
        </StepperButton>
      </Animated.View>
      <Animated.View style={rCenterButtonStyle}>
        <Pressable
          className="rounded-[16px] items-center justify-center bg-white border-neutral-700"
          style={[
            styles.borderCurve,
            { height: HEIGHT, width: WIDTH, borderWidth: StyleSheet.hairlineWidth },
          ]}
          onPressIn={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            handlePress();
          }}
        >
          {/* ReText: animated text component that updates on worklet thread without bridge crossing */}
          {/* pointerEvents: "none" prevents text from intercepting touch events */}
          <ReText
            text={stringValue}
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: 16,
              lineHeight: 20,
              color: "black",
              fontWeight: "medium",
              pointerEvents: "none",
            }}
          />
        </Pressable>
      </Animated.View>
      <Animated.View style={rStepperButtonStyle}>
        <StepperButton
          onPress={() => {
            handleStepperPress();
            const currentIndex = data.findIndex((item) => item.value === value.get());
            if (currentIndex === data.length - 1) return;
            value.set(data[currentIndex + 1].value);
          }}
        >
          <Plus size={16} color="#f5f5f5" />
        </StepperButton>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

// opal-set-timer-slider-animation 🔼
