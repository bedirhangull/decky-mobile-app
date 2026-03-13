import React, { FC } from "react";
import { Pressable, Text } from "react-native";
import { useCatchUpAnimation } from "../../lib/provider/catch-up-animation";
import Animated, { Easing, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { useCatchUpStore } from "../../lib/store/catch-up";
import * as Haptics from "expo-haptics";

// slack-catch-up-cards-swipe-animation 🔽

// Gentle ease-out keeps header transitions subtle so focus stays on the cards
const EASING = Easing.out(Easing.ease);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Right: FC = () => {
  const total = useCatchUpStore.use.total();

  const { currentChannelIndex, undoChannelIndex, isDone } = useCatchUpAnimation();

  const rOuterContainerStyle = useAnimatedStyle(() => {
    // Disable interactions while undo is in progress to avoid double triggers
    return {
      pointerEvents: undoChannelIndex.get() === null ? "auto" : "none",
    };
  });

  const rContainerStyle = useAnimatedStyle(() => {
    // Hide the button when on the last card; nothing to undo forward from there
    const show = currentChannelIndex.get() < total - 1;

    return {
      pointerEvents: show ? "auto" : "none",
      // Soft fade/scale to avoid popping the control; small scale keeps layout stable
      opacity: withTiming(show ? 1 : 0, { easing: EASING }),
      transform: [{ scale: withTiming(show ? 1 : 0.25, { easing: EASING }) }],
    };
  });

  return (
    <Animated.View style={rOuterContainerStyle}>
      <AnimatedPressable
        onPress={() => {
          // Light haptic for tactile acknowledgment
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          // Set undo target to the next index (the one we just left)
          undoChannelIndex.set(currentChannelIndex.get() + 1);
          // If completion overlay is showing, hide it as we are moving back
          if (isDone.get()) {
            isDone.set(false);
          }
        }}
        style={rContainerStyle}
        hitSlop={10}
      >
        <Text className="text-base font-bold text-neutral-200">Undo</Text>
      </AnimatedPressable>
    </Animated.View>
  );
};

// slack-catch-up-cards-swipe-animation 🔼
