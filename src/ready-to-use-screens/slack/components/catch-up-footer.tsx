import React, { FC } from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useCatchUpAnimation } from "../lib/provider/catch-up-animation";
import * as Haptics from "expo-haptics";

// slack-catch-up-cards-swipe-animation 🔽

// Wrap Pressable to animate scale/opacity with Reanimated on the UI thread
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Short 150ms tap feedback to feel snappy without stealing focus from card animation
const DURATION = 150;

export const CatchUpFooter: FC = () => {
  const { isKeepUnreadPressed, isMarkAsReadPressed, isDone } = useCatchUpAnimation();

  const keepUnreadScale = useSharedValue(1);
  const markAsReadScale = useSharedValue(1);

  const rContainerStyle = useAnimatedStyle(() => {
    // I want to disable it for short moment to let animation complete
    // Why: avoid double-taps during card dismissal driven by useFooterControlsAnimation
    const disabled = isKeepUnreadPressed.get() || isMarkAsReadPressed.get();

    return {
      // Footer hides when "All caught up" overlay shows
      opacity: withTiming(isDone.get() ? 0 : 1, { duration: DURATION }),
      pointerEvents: disabled ? "none" : "auto",
    };
  });

  return (
    <Animated.View className="flex-row gap-5 pt-6 items-center" style={rContainerStyle}>
      <AnimatedPressable
        className="flex-1 p-[14px] bg-neutral-900 border border-neutral-700/50 rounded-2xl items-center justify-center"
        style={[styles.borderCurve, { transform: [{ scale: keepUnreadScale }] }]}
        onPressIn={() => {
          // Micro scale-down for tactile feedback
          keepUnreadScale.set(withTiming(0.98, { duration: DURATION }));
        }}
        onPressOut={() => {
          keepUnreadScale.set(withTiming(1, { duration: DURATION }));
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          isKeepUnreadPressed.set(true);
        }}
      >
        <Text className="text-base font-semibold text-neutral-300">Keep Unread</Text>
      </AnimatedPressable>
      <AnimatedPressable
        className="flex-1 p-[12px] bg-emerald-900 border border-emerald-700/50 rounded-2xl items-center justify-center"
        style={[styles.borderCurve, { transform: [{ scale: markAsReadScale }] }]}
        onPressIn={() => {
          // Same tactile feedback for the second action button
          markAsReadScale.set(withTiming(0.98, { duration: DURATION }));
        }}
        onPressOut={() => {
          markAsReadScale.set(withTiming(1, { duration: DURATION }));
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          isMarkAsReadPressed.set(true);
        }}
      >
        <Text className="text-base font-semibold text-neutral-300">Mark as Read</Text>
      </AnimatedPressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

// slack-catch-up-cards-swipe-animation 🔼
