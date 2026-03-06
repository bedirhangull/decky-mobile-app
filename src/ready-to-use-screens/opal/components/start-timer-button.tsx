import { View, Text, StyleSheet, Platform, Dimensions, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import {
  Blur,
  Canvas,
  Path,
  processTransform3d,
  Skia,
  usePathValue,
} from "@shopify/react-native-skia";
import Animated, {
  Easing,
  FadeInDown,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { memo, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { colorKit } from "reanimated-color-picker";
import * as Haptics from "expo-haptics";
import { cn } from "@/src/shared/lib/utils/cn";
import { easeGradient } from "@/src/shared/lib/utils/ease-gradient";
import Shimmer from "@/src/shared/components/shimmer";

// opal-start-timer-button-animation 🔽

// Animated.createAnimatedComponent wraps native Pressable so Reanimated can drive
// entering transitions and animated styles on this host view.
// Ref: https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Button geometry
// - BUTTON_WIDTH: full-width minus horizontal margins
// - BUTTON_HEIGHT: fixed height used as base unit for all internal shape math
const BUTTON_WIDTH = Dimensions.get("window").width - 24;
const BUTTON_HEIGHT = 58;

// "Breathing" ovals constants
// - OVAL_BREATHE_DURATION: ping-pong timing (ms) so left/right ovals alternate calmly
// - PRIMARY/SECONDARY: endpoints for color interpolation to create subtle hue shift
const OVAL_BREATHE_DURATION = 4000;
const OVAL_PRIMARY_COLOR = "#04cea9ff";
const OVAL_SECONDARY_COLOR = "#5c8e5bff";

// Shimmer timing
// - SHIMMER_DELAY: initial and repeat pause so shimmer doesn't compete with first CTA impression
// - SHIMMER_DURATION: sweep speed, scaled by button width for consistent perceived velocity
const SHIMMER_DELAY = 3000;
const SHIMMER_DURATION = Math.max(1500 * (BUTTON_WIDTH / 200), 1500);

const GRADIENT_COLOR = "#99f6e4";

const StartTimerButton = () => {
  // Oval layout derived from button height to keep proportions across devices
  const ovalWidth = BUTTON_HEIGHT * 3.4;
  const ovalHeight = BUTTON_HEIGHT * 1.7;
  const centerY = BUTTON_HEIGHT / 1.5 + ovalHeight / 2.2;

  const leftOvalRect = {
    x: ovalWidth / 13,
    y: centerY - ovalHeight / 2,
    width: ovalWidth,
    height: ovalHeight,
  };
  const leftOvalPathBase = Skia.Path.Make().addOval(leftOvalRect);

  // Shared driver for breathing animation (0→1 ping-pong)
  const breathingProgress = useSharedValue(0);

  // Left oval scales up as progress goes 0→1 (1.0→1.2)
  // Visually: subtle expansion to imply "inhale"
  const scaleLeft = useDerivedValue(() => {
    return interpolate(breathingProgress.get(), [0, 1], [1, 1.2]);
  });

  // Color interpolation uses the same progress for left oval
  const colorProgressLeft = useDerivedValue(() => {
    return breathingProgress.get();
  });

  // Apply Skia transform on UI thread; cheaper than re-creating paths every frame
  const leftOvalPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleLeft.get() }]));
  }, leftOvalPathBase);

  const rightOvalRect = {
    x: BUTTON_WIDTH - 1.2 * ovalWidth,
    y: centerY - ovalHeight / 2,
    width: ovalWidth,
    height: ovalHeight,
  };
  const rightOvalPathBase = Skia.Path.Make().addOval(rightOvalRect);

  // Right oval mirrors left: it expands when left contracts and vice versa
  const scaleRight = useDerivedValue(() => {
    const opposite = 1 - breathingProgress.get();
    return interpolate(opposite, [0, 1], [1, 1.2]);
  });

  // Inverse color phase to reinforce alternating effect
  const colorProgressRight = useDerivedValue(() => {
    return 1 - breathingProgress.get();
  });

  // Skia transform for right oval
  const rightOvalPath = usePathValue((path) => {
    "worklet";
    path.transform(processTransform3d([{ scale: scaleRight.get() }]));
  }, rightOvalPathBase);

  // Start ping-pong breathing: withRepeat + reverse = yo-yo
  useEffect(() => {
    breathingProgress.set(withRepeat(withTiming(1, { duration: OVAL_BREATHE_DURATION }), -1, true));
  }, [breathingProgress]);

  // Left color: progress 0→1 maps PRIMARY→SECONDARY (CLAMP implied)
  const leftOvalColor = useDerivedValue(() => {
    return interpolateColor(
      colorProgressLeft.get(),
      [0, 1],
      [OVAL_PRIMARY_COLOR, OVAL_SECONDARY_COLOR],
    );
  });

  // Right color: inverted progress for alternating hue shift
  const rightOvalColor = useDerivedValue(() => {
    return interpolateColor(
      colorProgressRight.get(),
      [0, 1],
      [OVAL_PRIMARY_COLOR, OVAL_SECONDARY_COLOR],
    );
  });

  // 0→1 mirror of Shimmer.Overlay progress, used to drive overlay opacity
  const shimmerProgress = useSharedValue(0);

  // Press feedback: animate scale directly (1 → 0.96 on press-in, back to 1 on release)
  const pressScale = useSharedValue(1);
  const pressAnimatedStyle = useAnimatedStyle(() => {
    return { transform: [{ scale: pressScale.get() }] };
  });

  // Shimmer overlay opacity: fades in/out as highlight crosses to avoid hard edges
  const shimmerOverlayOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmerProgress.get(), [0, 0.2, 0.7, 1], [0, 0.15, 0.1, 0]);
    return { opacity };
  });

  // Eased gradients: transparent→color (left half) and color→transparent (right half)
  // easeGradient produces extra color stops for a smooth perceptual curve
  const { colors: leftGradientColors, locations: leftGradientLocations } = easeGradient({
    colorStops: {
      0: { color: colorKit.setAlpha(GRADIENT_COLOR, 0).hex() },
      1: { color: GRADIENT_COLOR },
    },
  });

  const { colors: rightGradientColors, locations: rightGradientLocations } = easeGradient({
    colorStops: {
      0: { color: GRADIENT_COLOR },
      1: { color: colorKit.setAlpha(GRADIENT_COLOR, 0).hex() },
    },
  });

  return (
    <Animated.View entering={FadeInDown}>
      <AnimatedPressable
        onPressIn={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          pressScale.set(withTiming(0.96, { duration: 150, easing: Easing.out(Easing.quad) }));
        }}
        onPressOut={() => {
          pressScale.set(withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }));
        }}
        className={cn(
          "self-center rounded-full mb-4 overflow-hidden",
          Platform.OS === "android" ? "border-neutral-900" : "border-neutral-700",
        )}
        style={[styles.container, pressAnimatedStyle]}
      >
        <Shimmer style={styles.shimmerWrapper}>
          {/* Breathing shapes */}
          {Platform.OS === "ios" && (
            <BlurView
              pointerEvents="none"
              intensity={50}
              tint="dark"
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <Canvas pointerEvents="none" style={styles.canvas}>
            <Path path={leftOvalPath} color={leftOvalColor}>
              <Blur blur={35} />
            </Path>
            <Path path={rightOvalPath} color={rightOvalColor}>
              <Blur blur={35} />
            </Path>
          </Canvas>
          <View
            pointerEvents="none"
            className="absolute top-0 left-0 right-0 bottom-0 flex-row gap-1.5 items-center justify-center"
          >
            <Ionicons name="play" size={18} color="white" />
            <Text className="text-white text-xl font-medium">Start Timer</Text>
          </View>
          {/* Shimmer highlight — sweeps across button with gradient tint */}
          <Shimmer.Overlay
            width="50%"
            initialDelay={SHIMMER_DELAY / 2}
            repeatDelay={SHIMMER_DELAY}
            animation={{
              type: "timing",
              config: {
                duration: SHIMMER_DURATION,
                easing: Easing.bezier(0.9, 0, 0.5, 0.3),
              },
            }}
            onProgress={shimmerProgress}
          >
            <Animated.View style={[styles.shimmerOverlayContent, shimmerOverlayOpacityStyle]}>
              <LinearGradient
                colors={leftGradientColors}
                locations={leftGradientLocations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              />
              <LinearGradient
                colors={rightGradientColors}
                locations={rightGradientLocations}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
              />
            </Animated.View>
          </Shimmer.Overlay>
        </Shimmer>
      </AnimatedPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    borderWidth: Platform.OS === "ios" ? StyleSheet.hairlineWidth : 1,
    borderCurve: "continuous",
  },
  canvas: {
    flex: 1,
    borderRadius: 999,
  },
  shimmerWrapper: {
    flex: 1,
  },
  shimmerOverlayContent: {
    flex: 1,
    flexDirection: "row",
  },
  gradient: {
    flex: 1,
  },
});

export default memo(StartTimerButton);

// opal-start-timer-button-animation 🔼
