import { FC } from "react";
import { View } from "react-native";
import { Stepper } from "./stepper";
import { TimerStep } from "../../lib/types";
import { Slider } from "./slider";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import BlockButton from "./block-button";

// opal-set-timer-slider-animation 🔽

// Shared spring config for presentation transitions: balanced damping/stiffness for smooth motion
const SPRING_CONFIG = {
  damping: 90, // Moderate damping prevents oscillation
  stiffness: 1200, // High stiffness ensures responsive transitions
};

// Timer step data: minutes (0-60 in 5-min increments) + hours (2-24 hours)
const MINUTES: TimerStep[] = Array.from({ length: 13 }, (_, index) => ({
  id: index * 5,
  value: index * 5,
}));

const HOURS: TimerStep[] = Array.from({ length: 23 }, (_, index) => ({
  id: (index + 2) * 60, // Start at 2 hours (120 minutes)
  value: (index + 2) * 60,
}));

const DATA: TimerStep[] = [...MINUTES, ...HOURS];

export const SetTimer: FC = () => {
  // Shared value for timer duration: synchronized across stepper and slider components
  const value = useSharedValue<number>(5);

  // Presentation state: 0 = stepper mode (default), 1 = slider mode (expanded)
  // Toggles between compact stepper UI and full slider UI
  const presentationState = useSharedValue(0);

  // Toggle presentation state: quick timing (180ms) for snappy mode switching
  const onPressHandler = () => {
    const targetValue = presentationState.get() === 0 ? 1 : 0;
    presentationState.set(withTiming(targetValue, { duration: 180 }));
  };

  // Slider appearance animation: fades in and scales up when presentationState transitions to 1
  // Opacity interpolation: starts fading at 0.8 to create smooth reveal before full visibility
  // Scale interpolation: grows from 75% to 100% for subtle zoom-in effect
  // pointerEvents disabled when hidden to prevent touch interception
  const rSliderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(presentationState.get(), [0.8, 1], [0, 1], Extrapolation.CLAMP);
    const scale = withSpring(
      interpolate(presentationState.get(), [0, 1], [0.75, 1], Extrapolation.CLAMP),
      SPRING_CONFIG
    );

    return {
      pointerEvents: opacity === 1 ? "auto" : "none", // Only accept touches when fully visible
      opacity,
      transform: [{ scale }],
    };
  });

  // Block button fade-out animation: opposite of slider, fades out and scales down when slider appears
  // Scale shrinks to 80% during fade for subtle zoom-out effect
  // Inverse interpolation: visible when presentationState is 0, hidden when 1
  const rBlockButtonStyle = useAnimatedStyle(() => {
    const opacity = interpolate(presentationState.get(), [0, 1], [1, 0]);
    const scale = withSpring(interpolate(presentationState.get(), [0, 1], [1, 0.8]), SPRING_CONFIG);
    return {
      pointerEvents: opacity === 1 ? "auto" : "none", // Disable touches when hidden
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <View className="gap-4 flex-row">
      {/* Stepper: always visible, reacts to presentationState for button opacity/position */}
      <Stepper
        data={DATA}
        value={value}
        onPressHandler={onPressHandler}
        presentationState={presentationState}
      />
      {/* Block button: fades out when slider appears, positioned between stepper and slider */}
      <Animated.View className="flex-1" style={rBlockButtonStyle}>
        <BlockButton />
      </Animated.View>
      {/* Slider: absolute positioned, fades in from right when presentationState transitions to 1 */}
      <Animated.View className="absolute right-0 self-center" style={rSliderStyle}>
        <Slider data={DATA} value={value} presentationState={presentationState} />
      </Animated.View>
    </View>
  );
};

// opal-set-timer-slider-animation 🔼
