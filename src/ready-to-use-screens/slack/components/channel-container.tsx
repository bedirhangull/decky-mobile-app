import React, { FC, memo, PropsWithChildren } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { useChannelAnimation } from "../lib/provider/channel-animation";
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import { useCatchUpAnimation } from "../lib/provider/catch-up-animation";
import { useHeaderControlsAnimation } from "../lib/hooks/use-header-controls-animation";
import { useFooterControlsAnimation } from "../lib/hooks/use-footer-controls-animation";

// slack-catch-up-cards-swipe-animation 🔽

type Props = {
  index: number;
};

const ChannelContainer: FC<PropsWithChildren<Props>> = ({ children, index }) => {
  const { width, height } = useWindowDimensions();

  const { animatedChannelIndex, currentChannelIndex } = useCatchUpAnimation();
  const { panX, panY, absoluteYAnchor, panDistance } = useChannelAnimation();

  useHeaderControlsAnimation(index);
  useFooterControlsAnimation(index);

  const rContainerStyle = useAnimatedStyle(() => {
    // Compute neighbors relative to the active index to limit work to only visible cards
    const isLast = index === currentChannelIndex.get();
    const isSecondLast = index === currentChannelIndex.get() - 1;
    const isThirdLast = index === currentChannelIndex.get() - 2;
    const isNextToLast = index === currentChannelIndex.get() + 1;

    // Interpolate based on the visual progress in "card index" space
    const inputRange = [index - 2, index - 1, index, index + 1, index + 2];

    // Rotation direction: dragging from bottom half tilts opposite for a natural hinge effect
    const sign = absoluteYAnchor.get() > height / 2 ? -1 : 1;

    // Subtle parallax: cards below the top one slide down slightly as the top card moves away
    // Range: at current index => 0, next card => width*0.07, then easing down
    const top = interpolate(
      animatedChannelIndex.get(),
      inputRange,
      [0, 0, 0, width * 0.07, width * 0.01],
      Extrapolation.CLAMP
    );

    // Rotate top card up to 4deg as user drags by panDistance; clamped via panDistance from provider
    const rotate = interpolate(panX.get(), [0, panDistance], [0, sign * 4]);

    // Scale stack: next cards scale down slightly to create depth and avoid z-fighting
    const scale = interpolate(
      animatedChannelIndex.get(),
      inputRange,
      [1, 1, 1, 0.95, 0.95],
      Extrapolation.CLAMP
    );

    return {
      top,
      // Hide far cards to reduce overdraw and avoid rendering cost beyond the stack
      opacity: isLast || isSecondLast || isThirdLast || isNextToLast ? 1 : 0,
      transform: [
        {
          translateX: panX.get(),
        },
        {
          translateY: panY.get(),
        },
        {
          rotate: `${rotate}deg`,
        },
        {
          scale,
        },
      ],
    };
  });

  return (
    <Animated.View
      key={index}
      className="absolute w-full h-full bg-neutral-900 border border-neutral-800 rounded-3xl z-50 shadow-lg overflow-hidden"
      style={[styles.container, rContainerStyle]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderCurve: "continuous",
  },
});

export default memo(ChannelContainer);

// slack-catch-up-cards-swipe-animation 🔼
