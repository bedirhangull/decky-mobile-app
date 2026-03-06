import { Dimensions, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import CarouselItem from "./carousel-item";

// opal-horizontal-carousel-animation 🔽

// Screen-driven layout: width is used to derive card sizing and center calculations
const SCREEN_WIDTH = Dimensions.get("window").width;
// Edge spacing: horizontal content inset (affects screen center math and peeking)
const HORIZONTAL_PADDING = 12;

// Space usable for cards after subtracting outer padding
const AVAILABLE_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING * 2;
// Design intent: keep 2 full cards centered in the viewport
const TARGET_ITEMS_CENTERED = 2;
// Peeking amount: each side shows 15% of a card to indicate horizontal scroll
const PARTIAL_ITEM_VISIBLE_RATIO = 0.15;

// Total visible footprint: 2 full cards + 2 partial edges (one on each side)
const TOTAL_VISIBLE_RATIO = TARGET_ITEMS_CENTERED + PARTIAL_ITEM_VISIBLE_RATIO * 2;
// Card width derived from visible footprint so sizing adapts to screen
const ITEM_WIDTH = AVAILABLE_WIDTH / TOTAL_VISIBLE_RATIO;
// Internal card padding (ensures minimum touch/visual spacing inside each item)
const INNER_PADDING = 6;

type Props = {
  data: string[];
};

const Carousel = ({ data }: Props) => {
  // Shared scroll position (px). Drives per-item transforms and blur for sync animations
  const scrollX = useSharedValue(0);

  // UI-thread scroll handler: updates shared value for 60fps animations
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      // Horizontal offset becomes the single source of truth for item interpolations
      scrollX.set(event.contentOffset.x);
    },
  });

  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
      onScroll={scrollHandler}
      // 16ms ~= 60fps. Ensures frequent updates without overwhelming JS thread
      scrollEventThrottle={16}
    >
      {data.map((item, index) => (
        <CarouselItem
          key={index}
          item={item}
          index={index}
          scrollX={scrollX}
          itemWidth={ITEM_WIDTH}
          screenWidth={SCREEN_WIDTH}
          horizontalPadding={HORIZONTAL_PADDING}
          innerPadding={INNER_PADDING}
        />
      ))}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    // Matches HORIZONTAL_PADDING used in layout calculations
    paddingHorizontal: HORIZONTAL_PADDING,
  },
});

export default Carousel;

// opal-horizontal-carousel-animation 🔼
