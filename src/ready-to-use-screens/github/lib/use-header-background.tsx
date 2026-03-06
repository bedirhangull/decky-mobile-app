import { useNavigation } from "expo-router";
import type React from "react";
import { useEffect } from "react";
import Animated, { type SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { colorKit } from "reanimated-color-picker";

// github-profile-header-title-animation 🔽

type Props = {
  offsetY: SharedValue<number>;
};

export const useHeaderBackground = ({ offsetY }: Props) => {
  const navigation = useNavigation();

  // Animate header bottom border visibility based on scroll position
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      // Show 0.5px border when scrolled, hide when at top
      // 200ms timing provides smooth transition without lag
      // Threshold: offsetY > 0 ensures border appears immediately on scroll
      borderBottomWidth: withTiming(offsetY.value > 0 ? 0.5 : 0, {
        duration: 200,
      }),
    };
  });

  useEffect(() => {
    navigation.setOptions({
      headerBackground: () => (
        <Animated.View
          className="absolute inset-0 bg-black"
          style={[
            rContainerStyle,
            {
              // 10% opacity white border provides subtle separation
              // colorKit.setAlpha ensures consistent opacity calculation
              borderColor: colorKit.setAlpha("#ffffff", 0.1).hex(),
            },
          ]}
        />
      ),
    });
  }, [navigation, rContainerStyle]);
};

// github-profile-header-background-animation 🔼
