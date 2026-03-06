import { View, Text } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import Animated from "react-native-reanimated";
import { useHeaderBackground } from "../lib/use-header-background";
import { useHeaderTitle } from "../lib/use-header-title";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AchievementsButton } from "../components/achievements-button";
import { useScrollViewOffset } from "@/src/shared/lib/hooks/use-scroll-view-offset";

// github-profile-header-title-animation 🔽

export default function Profile() {
  const insets = useSafeAreaInsets();
  // Header height includes status bar + navigation header for content offset
  const headerHeight = useHeaderHeight();

  // Centralized scroll offset tracking for header animations
  // scrollOffsetY: shared value updated on scroll events
  // scrollHandler: optimized worklet for scroll event processing
  const { scrollOffsetY, scrollHandler } = useScrollViewOffset();

  // Animate header border based on scroll position
  useHeaderBackground({ offsetY: scrollOffsetY });

  // Configure animated header title with username as trigger element
  // triggerRef: attach to username for position measurement
  // title: "vvv-sss" appears in header when username scrolls away
  const { triggerRef, onLayout } = useHeaderTitle({
    offsetY: scrollOffsetY,
    title: "vvv-sss",
  });

  return (
    <Animated.ScrollView
      className="flex-1 bg-black"
      contentContainerClassName="px-5"
      contentContainerStyle={{ paddingTop: headerHeight + 16, paddingBottom: insets.bottom }}
      indicatorStyle="white"
      onScroll={scrollHandler}
      // 16ms throttle = ~60fps, balance between smooth animation and performance
      scrollEventThrottle={16}
    >
      <View className="flex-row items-center gap-4 mb-6">
        <View className="w-20 h-20 rounded-full border border-white/15" />
        <View className="flex-1">
          <Text className="text-stone-100 font-bold text-lg">Volodymyr Serbulenko</Text>
          {/* Username element triggers header title animation when scrolled away */}
          {/* ref={triggerRef}: enables position measurement for animation calculations */}
          {/* onLayout: tracks element position changes (orientation, keyboard) */}
          <Animated.View ref={triggerRef} onLayout={onLayout}>
            <Text className="text-stone-300 text-base">vvv-sss</Text>
          </Animated.View>
        </View>
      </View>

      <View className="w-full h-12 bg-neutral-900 rounded-xl mb-6" />

      <View className="w-3/4 h-4 bg-neutral-900 rounded-md mb-1" />
      <View className="w-1/2 h-4 bg-neutral-900 rounded-md mb-4" />

      <View className="w-32 h-4 bg-neutral-900 rounded-md mb-4" />

      <View className="mb-6">
        <AchievementsButton />
      </View>
      <View className="gap-[2px] mb-10">
        <View className="w-full h-12 bg-neutral-900 rounded-lg" />
        <View className="w-full h-12 bg-neutral-900 rounded-lg" />
        <View className="w-full h-12 bg-neutral-900 rounded-lg" />
      </View>
      <View className="w-1/3 h-4 bg-neutral-900 rounded-md mb-4" />
      <View className="w-full h-40 bg-neutral-900 rounded-xl mb-2" />
      <View className="w-full h-40 bg-neutral-900 rounded-xl mb-2" />
      <View className="w-full h-40 bg-neutral-900 rounded-xl mb-2" />
      <View className="w-full h-40 bg-neutral-900 rounded-xl mb-2" />
    </Animated.ScrollView>
  );
}

// github-profile-header-title-animation 🔼
