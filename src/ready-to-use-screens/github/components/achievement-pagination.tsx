import React, { FC } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { colorKit } from "reanimated-color-picker"; // For consistent opacity calculations

// github-achievements-carousel-animation 🔽

// Pagination dot colors: 20% opacity for inactive, full opacity for active
const _containerDefaultDotColor = colorKit.setAlpha("#fff", 0.2).hex(); // Subtle inactive state
const _containerActiveDotColor = "#fff"; // Full brightness for current achievement

type DotProps = {
  index: number; // Dot position in pagination array
  currentIndex: number; // Currently active achievement index
};

const Dot = ({ index, currentIndex }: DotProps) => {
  // Smooth color transition animation for dot state changes
  const rDotStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        currentIndex === index ? _containerActiveDotColor : _containerDefaultDotColor,
        {
          duration: 150, // Quick transition matches swipe interaction speed
        }
      ),
    };
  });
  return <Animated.View key={index} className="h-2.5 w-2.5 rounded-full" style={rDotStyle} />;
};

type Props = {
  currentIndex: number; // Active achievement index (adjusted for cloned items)
  total: number; // Total number of real achievements (excluding clones)
};

export const AchievementPagination: FC<Props> = ({ currentIndex, total }) => {
  // Hide pagination for single achievement to avoid visual clutter
  if (total < 2) {
    return <></>;
  }

  return (
    // Centered pagination with generous padding for touch targets
    <View className="items-center p-7">
      <View className="flex-row items-center gap-2.5">
        {Array.from({ length: total }).map((_, index) => (
          <Dot key={index} index={index} currentIndex={currentIndex} />
        ))}
      </View>
    </View>
  );
};

// github-achievements-carousel-animation 🔼
