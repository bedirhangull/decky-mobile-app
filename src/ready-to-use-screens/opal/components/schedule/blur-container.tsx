import { View, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { cn } from "@/src/shared/lib/utils/cn";
import { ReactNode } from "react";

type BlurContainerProps = {
  children: ReactNode;
  intensity?: number;
  className?: string;
};

const BlurContainer = ({ children, intensity = 8, className }: BlurContainerProps) => {
  return (
    <View
      style={styles.borderCurve}
      className={cn("overflow-hidden rounded-2xl border border-neutral-700/50", className)}
    >
      <BlurView
        intensity={intensity}
        tint="systemThinMaterialLight"
        style={[StyleSheet.absoluteFill, styles.blurView, styles.borderCurve]}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
  blurView: {
    borderRadius: 15.5,
  },
});

export default BlurContainer;
