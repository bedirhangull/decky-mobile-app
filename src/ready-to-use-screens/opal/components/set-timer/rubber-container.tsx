import React, { FC, PropsWithChildren } from "react";
import { ViewProps } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureType } from "react-native-gesture-handler";

// opal-set-timer-slider-animation 🔽

// Spring config for rubber band snap-back when gesture ends outside bounds
// High stiffness (900) creates quick response, moderate damping (60) prevents overshoot
const ON_FINALIZE_SPRING_CONFIG = {
  damping: 60,
  stiffness: 900,
};

interface Props extends ViewProps {
  width: number;
  height: number;
  className?: string;
  animationConfig?: {
    activeScale?: number;
    baseDistance?: number;
    maxScale?: number;
    stretchRatio?: number;
  };
  gestures?: GestureType[];
}

export const RubberContainer: FC<PropsWithChildren<Props>> = ({
  children,
  width,
  height,
  style,
  className,
  animationConfig,
  gestures,
  ...props
}) => {
  // Animation config defaults: subtle press scale, stretch limits, and rubber band elasticity
  const {
    activeScale = 1.03, // Slight scale-up on press for tactile feedback
    baseDistance = 100, // Base unit for calculating max stretch distance
    maxScale = 2.5, // Maximum horizontal stretch multiplier when dragged beyond bounds
    stretchRatio = 2.5, // Multiplier for maxWidth calculation (baseDistance * maxScale * stretchRatio)
  } = animationConfig ?? {};

  // Shared values coordinate gesture state across animated styles
  const isActive = useSharedValue(false); // Tracks if pan gesture is active
  const lastX = useSharedValue(0); // Current X position during pan, used for stretch interpolation
  const transformOrigin = useSharedValue("left"); // Determines which side stretches when dragged beyond bounds

  // Pan gesture handles drag interactions and rubber band effect
  const gesture = Gesture.Pan()
    .onBegin((event) => {
      isActive.set(true);
      lastX.set(event.x); // Initialize position for stretch calculations
    })
    .onChange((event) => {
      const x = event.x;
      lastX.set(x);

      // Dynamic transform origin: drag right half stretches from left, left half from right
      // This creates natural rubber band behavior where the opposite side anchors
      if (x > width / 2) {
        transformOrigin.set("left");
      } else {
        transformOrigin.set("right");
      }
    })
    .onFinalize(() => {
      isActive.set(false);

      // If gesture ended within bounds, no snap-back needed
      if (lastX.get() >= 0 && lastX.get() <= width) {
        return;
      }

      // Snap back to nearest bound with spring animation
      // Callback resets lastX after spring completes to prevent visual glitches
      if (transformOrigin.get() === "left") {
        lastX.set(withSpring(width, ON_FINALIZE_SPRING_CONFIG, () => lastX.set(0)));
      } else {
        lastX.set(withSpring(0, ON_FINALIZE_SPRING_CONFIG));
      }
    });

  // Compose pan gesture with external gestures (e.g., slider's pan) for simultaneous recognition
  const composedGestures = Gesture.Simultaneous(gesture, ...(gestures ?? []));

  // Press scale animation: quick scale-up on press, slower scale-down on release
  // Lower dampingRatio (0.3) on release creates subtle bounce-back effect
  const rOnActiveScaleContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: isActive.get()
            ? withSpring(activeScale, { duration: 600 })
            : withSpring(1, { duration: 1000, dampingRatio: 0.3 }),
        },
      ],
    };
  });

  // Rubber band stretch effect: horizontal and vertical scaling based on drag position
  const rStretchContainerStyle = useAnimatedStyle(() => {
    const maxWidth = baseDistance * maxScale * stretchRatio;

    // Horizontal stretch interpolation:
    // Input range: [-maxWidth, 0, width, width + maxWidth] (extends beyond bounds)
    // Output range: [maxScale, 1, 1, maxScale] (stretches when dragged outside)
    // CLAMP prevents values beyond maxScale, creating resistance feel
    const scaleX = interpolate(
      lastX.get(),
      [-maxWidth, 0, width, width + maxWidth],
      [maxScale, 1, 1, maxScale],
      Extrapolation.CLAMP
    );

    // Vertical compression interpolation:
    // Input range: [-10% width, 0, width, 110% width]
    // Output range: [0.9, 1, 1, 0.9] (slight compression when stretched horizontally)
    // Creates realistic rubber band physics where stretching reduces height
    const scaleY = interpolate(
      lastX.get(),
      [-width * 0.1, 0, width, width + width * 0.1],
      [0.9, 1, 1, 0.9],
      Extrapolation.CLAMP
    );

    return {
      transformOrigin: transformOrigin.get(), // CSS transform-origin for correct stretch anchor point
      transform: [
        {
          scaleY, // Apply vertical compression first
        },
        {
          scaleX, // Then horizontal stretch
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={composedGestures}>
      {/* Outer container handles press scale animation */}
      <Animated.View
        className={className}
        style={[
          {
            width,
            height,
          },
          rOnActiveScaleContainerStyle,
          style,
        ]}
        {...props}
      >
        {/* Inner container handles rubber band stretch effect */}
        <Animated.View className="flex-1" style={rStretchContainerStyle}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

// opal-set-timer-slider-animation 🔼
