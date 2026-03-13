import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React, { FC } from "react";
import { Extrapolation, useDerivedValue, withTiming } from "react-native-reanimated";
import { StyleSheet, View, Text } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Animated, { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import { EyeClosed } from "lucide-react-native";
import { colorKit } from "reanimated-color-picker";

// slack-catch-up-cards-swipe-animation 🔽

// Dimensions chosen to read clearly over the card without stealing attention
const SIZE = 60;
const STROKE_WIDTH = 3;
const ICON_SIZE = 24;

// Transparent white via colorKit for consistent platform alpha handling
const TRANSPARENT = colorKit.setAlpha("#fff", 0).hex();

type Props = {
  variant: "keep-read" | "keep-unread";
};

export const MarkView: FC<Props> = ({ variant }) => {
  const { panX, panDistance } = useChannelAnimation();

  // Map variant to direction sign so the same interpolation works for left/right
  const sign = variant === "keep-read" ? 1 : -1;

  const rContainerStyle = useAnimatedStyle(() => {
    if (variant === "keep-read") {
      return {
        // Reveal label proportionally to drag distance; fully visible at threshold (panDistance)
        opacity: interpolate(panX.get(), [0, sign * panDistance], [0, 1], Extrapolation.CLAMP),
      };
    }
    return {
      opacity: interpolate(panX.get(), [0, sign * panDistance], [0, 1], Extrapolation.CLAMP),
    };
  });

  const rIconContainerStyle = useAnimatedStyle(() => {
    return {
      // Fill the circular icon background when the arc completes
      // Small +STROKE_WIDTH/2 buffer ensures we flip when visually complete
      backgroundColor: withTiming(
        Math.abs(panX.get()) + STROKE_WIDTH / 2 > panDistance ? "white" : TRANSPARENT,
        {
          duration: 50,
        }
      ),
    };
  });

  // Create an animated path that fills based on panX
  const animatedPath = useDerivedValue(() => {
    const skPath = Skia.Path.Make();

    // Calculate the end angle based on panX (0 to 2π)
    // progress: 0.0 at center, 1.0 at threshold; we turn it into degrees for Skia's addArc
    const progress = Math.abs(panX.get()) / panDistance;
    const endAngle = 2 * Math.PI * progress;

    // Draw an arc
    skPath.addArc(
      {
        x: 0 + STROKE_WIDTH / 2,
        y: 0 + STROKE_WIDTH / 2,
        width: SIZE - STROKE_WIDTH,
        height: SIZE - STROKE_WIDTH,
      },
      -90, // Start from top (0° is right; -90° rotates start to 12 o'clock for intuitive progress)
      endAngle * (180 / Math.PI) // Convert to degrees
    );

    return skPath;
  }, [panX, panDistance]);

  const rIconStyle = useAnimatedStyle(() => {
    return {
      // Show the colored icon only after the progress passes threshold; 200ms feels responsive
      opacity: withTiming(Math.abs(panX.get()) + STROKE_WIDTH / 2 > panDistance ? 1 : 0, {
        duration: 200,
      }),
    };
  });

  return (
    <Animated.View className="gap-2" style={rContainerStyle}>
      <Animated.View
        className="rounded-full items-center justify-center"
        style={[styles.iconContainer, rIconContainerStyle]}
      >
        <Canvas style={styles.canvas}>
          <Path
            path={animatedPath}
            color="white"
            style="stroke"
            strokeWidth={STROKE_WIDTH}
            strokeCap="round"
          />
        </Canvas>
        {variant === "keep-read" ? (
          <View className="items-center justify-center">
            <Animated.View className="absolute">
              <FontAwesome6 name="check" size={ICON_SIZE} color="white" />
            </Animated.View>
            <Animated.View className="absolute" style={rIconStyle}>
              <FontAwesome6 name="check" size={ICON_SIZE} color="#065f46" />
            </Animated.View>
          </View>
        ) : (
          <View className="items-center justify-center">
            <Animated.View className="absolute">
              <EyeClosed size={ICON_SIZE} color="white" />
            </Animated.View>
            <Animated.View className="absolute" style={rIconStyle}>
              <EyeClosed size={ICON_SIZE} color="#1e3a8a" />
            </Animated.View>
          </View>
        )}
      </Animated.View>
      {variant === "keep-read" ? (
        <View>
          <Text style={styles.text}>Mark as</Text>
          <Text style={styles.text}>Read</Text>
        </View>
      ) : (
        <View>
          <Text style={styles.text}>Keep</Text>
          <Text style={styles.text}>Unread</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: SIZE,
    height: SIZE,
  },
  canvas: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0,
    color: "white",
  },
});

// slack-catch-up-cards-swipe-animation 🔼
