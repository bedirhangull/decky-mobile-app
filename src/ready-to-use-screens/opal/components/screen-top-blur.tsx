import { ProgressiveBlurView } from "@/src/shared/components/progressive-blur-view";
import { easeGradient } from "@/src/shared/lib/utils/ease-gradient";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ScreenTopBlur: FC = () => {
  const insets = useSafeAreaInsets();

  const height = insets.top + 40;

  const { colors, locations } = easeGradient({
    colorStops: {
      0: { color: "rgba(0, 0, 0, 0.5)" },
      1: { color: "rgba(0, 0, 0, 0)" },
    },
  });

  return (
    <View className="absolute top-0 left-0 right-0" style={{ height }}>
      <LinearGradient colors={colors} locations={locations} style={StyleSheet.absoluteFill} />
      <ProgressiveBlurView height={height} />
    </View>
  );
};
