import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

// slack-catch-up-cards-swipe-animation 🔽

export const ColorBackground: FC = () => {
  const { panX, panDistance } = useChannelAnimation();

  const rGreenStyle = useAnimatedStyle(() => {
    return {
      // Right swipe reveals green (mark as read). Max at panDistance, clamped to avoid overshooting
      opacity: interpolate(panX.get(), [0, panDistance], [0, 0.8], Extrapolation.CLAMP),
    };
  });

  const rBlueStyle = useAnimatedStyle(() => {
    return {
      // Left swipe reveals blue (keep unread). Mirror of rGreenStyle
      opacity: interpolate(panX.get(), [0, -panDistance], [0, 0.8], Extrapolation.CLAMP),
    };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, rGreenStyle]}>
        <LinearGradient
          colors={["#34d399", "#064e3b"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, rBlueStyle]}>
        <LinearGradient
          colors={["#38bdf8", "#1e3a8a"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    width: "100%",
    height: "100%",
  },
});

// slack-catch-up-cards-swipe-animation 🔼
