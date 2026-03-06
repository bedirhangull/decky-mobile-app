import { useTargetMeasurement } from "@/src/shared/lib/hooks/use-target-measurment";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "expo-router";
import type React from "react";
import { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// github-profile-header-title-animation 🔽

type Props = {
  offsetY: SharedValue<number>;
  title: string;
};

export const useHeaderTitle = ({ offsetY, title }: Props) => {
  const navigation = useNavigation();

  // Native header height includes status bar + navigation header
  const headerHeight = useHeaderHeight();

  // Track username element position to calculate scroll trigger point
  // triggerRef: attach to username element for measurement
  // onLayout: callback when element dimensions change
  // triggerMeasurement: shared value containing pageY, height, width
  const {
    targetRef: triggerRef,
    onTargetLayout: onLayout,
    measurement: triggerMeasurement,
  } = useTargetMeasurement();

  const rTitleStyle = useAnimatedStyle(() => {
    // Hide title until username element measurements are available
    if (triggerMeasurement.value === null) {
      return { opacity: 0 };
    }
    const triggerHeight = triggerMeasurement.value.height;
    const triggerPageY = triggerMeasurement.value.pageY;

    // Calculate when username starts disappearing under header
    // scrollDistance: pixels scrolled when username touches header bottom
    const scrollDistance = triggerPageY - headerHeight;

    return {
      opacity: 1,
      transform: [
        {
          // Slide title up from +30px to 0px as username disappears
          // Animation range: username top edge touches header → username fully hidden
          // Input: [scrollDistance, scrollDistance + triggerHeight] (scroll position)
          // Output: [30, 0] (translateY in pixels)
          // CLAMP: prevents over-animation beyond defined ranges
          translateY: interpolate(
            offsetY.value,
            [scrollDistance, scrollDistance + triggerHeight],
            [30, 0],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  useEffect(() => {
    navigation.setOptions({
      // Android fix: 48px spacer compensates for headerTitleAlign: "center" bug
      headerLeft: () => <View className="w-12" />,
      headerTitle: () => {
        return (
          <View className="py-3 overflow-hidden">
            <Animated.View style={rTitleStyle}>
              <Text className="text-white font-semibold text-lg text-center">{title}</Text>
            </Animated.View>
          </View>
        );
      },
    });
  }, [navigation, rTitleStyle, title]);

  return { triggerRef, onLayout };
};

// github-profile-header-title-animation 🔼
