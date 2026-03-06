import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { cn } from "@/src/shared/lib/utils/cn";

// opal-set-timer-slider-animation 🔽

const BlockButton = () => {
  return (
    <Pressable
      onPress={simulatePress}
      style={styles.container}
      className={cn(
        "flex-1 flex-row h-[40px] gap-4 justify-center border-neutral-700 rounded-full overflow-hidden",
        Platform.OS === "android" && "bg-neutral-900 border-neutral-800"
      )}
    >
      {/* iOS blur effect: BlurView only works on iOS, Android uses solid background fallback */}
      {Platform.OS === "ios" && <BlurView style={StyleSheet.absoluteFill} tint="light" />}
      <Text className="text-white text-lg self-center">Block</Text>
      {/* Visual indicator: three dots representing blocked state */}
      <View className="bg-white rounded-md flex-row gap-0.5 px-1 py-2.5 items-center justify-center self-center">
        <View className="size-1 rounded-full bg-neutral-900" />
        <View className="size-1 rounded-full bg-neutral-900" />
        <View className="size-1 rounded-full bg-neutral-900" />
      </View>
    </Pressable>
  );
};

export default BlockButton;

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
  },
});

// opal-set-timer-slider-animation 🔽
