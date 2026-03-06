import React, { FC } from "react";
import { useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// github-achievements-carousel-animation 🔽

type Props = {
  index: number; // Badge position in carousel for rotation calculations
  imageSource: number; // Achievement image asset
  scrollOffsetX: SharedValue<number>; // Shared scroll position for animation coordination
};

export const AchievementBadge: FC<Props> = ({ index, imageSource, scrollOffsetX }) => {
  const { width } = useWindowDimensions();

  // 3D flip animation: badge rotates as user scrolls between achievements
  const rContainerStyle = useAnimatedStyle(() => {
    // Define scroll positions: previous page, current page, next page
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    // Create 3D rotation effect:
    // Previous page: 360° (full rotation from behind)
    // Current page: 0° (face forward, fully visible)
    // Next page: -360° (rotating away behind)
    const rotate = interpolate(
      scrollOffsetX.value,
      inputRange,
      [360, 0, -360], // Rotation degrees at each scroll position
      Extrapolation.EXTEND // Continue rotation beyond defined range
    );

    return {
      transform: [{ rotateY: `${rotate}deg` }], // Y-axis rotation for 3D flip effect
    };
  });

  return (
    <Animated.View
      // 65% screen width for prominent display, perfect circle with white border
      className="aspect-square rounded-full border-[10px] border-white overflow-hidden"
      style={[{ width: width * 0.65 }, rContainerStyle]}
    >
      <Image source={imageSource} style={{ width: "100%", height: "100%" }} contentFit="cover" />
    </Animated.View>
  );
};

// github-achievements-carousel-animation 🔼
