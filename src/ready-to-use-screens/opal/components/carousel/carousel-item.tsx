import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Plus } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
  useAnimatedProps,
  Extrapolation,
} from "react-native-reanimated";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { memo } from "react";
import { useRouter } from "expo-router";

// opal-horizontal-carousel-animation 🔽

// Reanimated wrapper enables animated styles/props on host components
// Ref: https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface CarouselItemProps {
  item: string;
  index: number;
  scrollX: SharedValue<number>;
  itemWidth: number;
  screenWidth: number;
  horizontalPadding: number;
  innerPadding: number;
}

const CarouselItem = ({
  item,
  index,
  scrollX,
  itemWidth,
  screenWidth,
  horizontalPadding,
  innerPadding,
}: CarouselItemProps) => {
  const router = useRouter();
  // Card scale based on distance from screen center (center = 1.0, edges = 0.88)
  const rItemStyle = useAnimatedStyle(() => {
    // Compute visual center within padded content (not raw screen center)
    const screenCenter = (screenWidth - horizontalPadding * 2) / 2;

    // Translate fixed index position by current scroll to get on-screen position
    const itemLeftEdge = index * itemWidth - scrollX.get();
    const itemCenter = itemLeftEdge + itemWidth / 2;

    // abs() → symmetric response left/right of center (no directional bias)
    const distanceFromScreenCenter = Math.abs(itemCenter - screenCenter);

    // Within one card width, treat as fully visible (no scale change)
    const fullyVisibleRange = itemWidth;

    // 1.5x widens the falloff so edges shrink subtly (prevents harsh drop-off)
    // Values beyond this are clamped to avoid tiny unreadable cards
    const partiallyVisibleRange = itemWidth * 1.5;

    // Interpolate distance→scale: [center, full, partial] => [1, 1, 0.88]
    // CLAMP: freeze at 0.88 outside the defined range for stability
    const scale = interpolate(
      distanceFromScreenCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [1, 1, 0.88],
      Extrapolation.CLAMP
    );

    return {
      // Scale-only transform to preserve layout; avoids reflow and keeps FPS high
      transform: [{ scale }],
    };
  });

  // iOS-only blur increases as item moves away from center (focus metaphor)
  const rBlurProps = useAnimatedProps(() => {
    // Same center math as scale to keep effects perfectly in sync
    const screenCenter = (screenWidth - horizontalPadding * 2) / 2;

    const itemLeftEdge = index * itemWidth - scrollX.get();
    const itemCenter = itemLeftEdge + itemWidth / 2;

    // Shared distance drives both scale and blur for coherent visual depth
    const distanceFromScreenCenter = Math.abs(itemCenter - screenCenter);

    const fullyVisibleRange = itemWidth;
    const partiallyVisibleRange = itemWidth * 1.5;

    // Interpolate distance→blur: [center..full] stays sharp, increases towards edges
    // 15 intensity chosen for subtlety; higher values can overpower text/overlays
    const blurIntensity = interpolate(
      distanceFromScreenCenter,
      [0, fullyVisibleRange, partiallyVisibleRange],
      [0, 0, 15],
      Extrapolation.CLAMP
    );

    return {
      // AnimatedProps required because BlurView uses prop-based intensity, not style
      intensity: blurIntensity,
    };
  });

  const _innerPadding = Math.max(innerPadding ?? 0, 6);

  return (
    <AnimatedPressable
      style={[{ width: itemWidth, padding: _innerPadding }, rItemStyle]}
      className="aspect-[2/3] self-start overflow-hidden"
      onPress={() => router.push({ pathname: "/opal/schedule" })}
    >
      <Animated.View
        className="flex-1 p-3 rounded-[30px] overflow-hidden border border-white/10"
        style={styles.cardContainer}
      >
        <Image
          contentFit="cover"
          placeholder={{ blurhash: item }}
          style={[StyleSheet.absoluteFill, styles.image]}
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.95)", "black", "black"]}
          locations={[0, 0.81, 0.88, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View className="mt-auto">
          <View className="mb-2 w-20 h-4 rounded-full bg-neutral-800/70" />
          <View className="mb-1 h-3 rounded-full bg-neutral-800/70" />
          <View className="mb-4 w-3/4 h-3 rounded-full bg-neutral-800/70" />
          <View className="flex-row justify-center items-center gap-1 rounded-full bg-neutral-800/70 p-1">
            <Plus size={15} color="#d4d4d4" strokeWidth={2.5} />
            <Text className="text-md text-neutral-300 font-semibold">Add </Text>
          </View>
        </View>
      </Animated.View>

      {/* Platform: iOS blur adds depth cue; Android omits for perf/parity */}
      {Platform.OS === "ios" && (
        <View className="rounded-[24px] overflow-hidden" style={StyleSheet.absoluteFill}>
          <AnimatedBlurView
            animatedProps={rBlurProps}
            pointerEvents="none"
            tint="systemThinMaterialDark"
            style={StyleSheet.absoluteFill}
          />
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    // iOS continuous curves for premium look; adjust border width per platform
    borderCurve: "continuous",
  },
  image: {
    // Match container rounding to avoid anti-alias seams over the absolute image
    borderRadius: 30,
  },
});

export default memo(CarouselItem);

// opal-horizontal-carousel-animation 🔼
