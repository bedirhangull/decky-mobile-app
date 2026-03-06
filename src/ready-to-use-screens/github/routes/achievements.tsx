import { X } from "lucide-react-native";
import { FlatList, Platform, Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useMemo, useRef, useState } from "react";
import { AchievementBadge } from "../components/achievment-badge";
import PairExtraordinaireImage from "@/assets/images/misc/github/achievement-1.png";
import PullSharkImage from "@/assets/images/misc/github/achievement-2.png";
import { AchievementPagination } from "../components/achievement-pagination";
import { useRouter } from "expo-router";

// github-achievements-carousel-animation 🔽

type Achievement = {
  bgColor: string;
  imageSource: number;
};

const achievements: Achievement[] = [
  {
    bgColor: "#18600B",
    imageSource: PairExtraordinaireImage,
  },
  {
    bgColor: "#012A60",
    imageSource: PullSharkImage,
  },
];

export default function Achievements() {
  // Start at index 1 to account for cloned item at beginning (for infinite scroll)
  const [currentIndex, setCurrentIndex] = useState(1);

  const router = useRouter();

  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Infinite scroll implementation: clone last item at start, first item at end
  // Structure: [last, ...original, first] enables seamless looping
  const data: Achievement[] = useMemo(
    () => [achievements.at(-1)!, ...achievements, achievements.at(0)!],
    []
  );

  const horizontalListRef = useRef<FlatList>(null);

  // Tracks horizontal scroll position for badge rotation and background color interpolation
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Update shared value on every scroll event for smooth animations
      scrollX.value = event.contentOffset.x;
    },
  });

  // Pre-compute color array for interpolation performance
  const bgColors = useMemo(() => data.map((item) => item.bgColor), [data]);

  // Smooth background color transition based on scroll position
  const rContainerStyle = useAnimatedStyle(() => {
    return {
      // Interpolate between achievement colors as user scrolls
      // Input: scroll positions [0, width, 2*width, ...]
      // Output: corresponding background colors
      backgroundColor: interpolateColor(
        scrollX.value,
        data.map((_, i) => i * width), // Scroll positions at each page
        bgColors // Achievement-specific colors
      ),
    };
  });

  return (
    <Animated.View
      className="flex-1"
      style={[{ paddingBottom: insets.bottom + 10 }, rContainerStyle]}
    >
      <Animated.FlatList
        ref={horizontalListRef}
        data={data}
        renderItem={({ item, index }) => (
          <ScrollView style={{ width }} contentContainerStyle={{ paddingTop: insets.top + 45 }}>
            <View className="flex-1 items-center">
              <AchievementBadge
                index={index}
                imageSource={item.imageSource}
                scrollOffsetX={scrollX}
              />
              <View className="mt-10 w-full items-center">
                <View className="h-12 w-1/2 rounded-full bg-white/10 mb-4" />
                <View className="h-6 w-5/6 rounded-full bg-white/10 mb-2" />
                <View className="h-5 w-3/4 rounded-full bg-white/10 mb-16" />
                <View className="flex-row items-center gap-6 mb-6">
                  <View className="h-4 w-4 rounded-full bg-white/10" />
                  <View className="h-5 w-1/3 rounded-full bg-white/10" />
                </View>
                <View className="flex-row items-center gap-6 mb-4">
                  <View className="h-4 w-4 rounded-full bg-white/10" />
                  <View className="w-1/3 gap-2">
                    <View className="h-4 w-full rounded-full bg-white/10" />
                    <View className="h-4 w-2/3 rounded-full bg-white/10" />
                  </View>
                </View>
                <View className="flex-row items-center gap-6">
                  <View className="h-4 w-4 rounded-full bg-white/10" />
                  <View className="w-1/3 gap-2">
                    <View className="h-4 w-full rounded-full bg-white/10" />
                    <View className="h-4 w-2/3 rounded-full bg-white/10" />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
        horizontal
        pagingEnabled // Snap to full-width pages for precise badge positioning
        initialScrollIndex={1} // Start at first real item (skip cloned item)
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })} // Pre-calculate layout for performance and accurate scroll positioning
        scrollEventThrottle={16} // ~60fps updates for smooth badge rotation
        onScroll={scrollHandler}
        // Infinite scroll: when reaching start, jump to equivalent end position
        onStartReached={() => {
          if (Platform.OS === "android") {
            // Android needs delay to prevent scroll conflict during momentum
            setTimeout(() => {
              horizontalListRef.current?.scrollToIndex({ index: data.length - 2, animated: false });
            }, 100);
          } else {
            horizontalListRef.current?.scrollToIndex({ index: data.length - 2, animated: false });
          }
        }}
        // Infinite scroll: when reaching end, jump to equivalent start position
        onEndReached={() => {
          if (Platform.OS === "android") {
            // Android needs delay to prevent scroll conflict during momentum
            setTimeout(() => {
              horizontalListRef.current?.scrollToIndex({ index: 1, animated: false });
            }, 100);
          } else {
            horizontalListRef.current?.scrollToIndex({ index: 1, animated: false });
          }
        }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 99, // Only trigger when item is almost fully visible
        }}
        onViewableItemsChanged={(info) => {
          // Update pagination dots based on currently visible achievement
          if (typeof info.viewableItems[0]?.index === "number") {
            setCurrentIndex(info.viewableItems[0].index);
          }
        }}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={data.length > 3} // Disable scroll for single items
      />
      {/* Pagination */}
      {/* Subtract 1 from currentIndex and 2 from total to account for cloned items */}
      <AchievementPagination currentIndex={currentIndex - 1} total={data.length - 2} />
      {/* CTA Button */}
      <View className="px-5">
        <View className="h-12 w-full rounded-2xl bg-white/20" />
      </View>
      {/* Close Button */}
      <Pressable
        className="absolute right-4 w-8 h-8 rounded-full bg-white/20 items-center justify-center"
        style={{ top: insets.top + 16 }}
        onPress={router.back}
      >
        <X size={16} color="lightgray" />
      </Pressable>
    </Animated.View>
  );
}

// github-achievements-carousel-animation 🔼
