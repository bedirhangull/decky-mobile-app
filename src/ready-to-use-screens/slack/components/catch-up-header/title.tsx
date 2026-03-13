import React, { FC } from "react";
import { View, StyleSheet, Platform } from "react-native";
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import { useCatchUpAnimation } from "../../lib/provider/catch-up-animation";

// slack-catch-up-cards-swipe-animation 🔽
// slack-catch-up-header-counter-animation 🔽

// Short timing to keep header responsive; springs provide pleasant bounce
const DURATION = 200;
// Stiffness/damping tuned for a crisp but not jittery number flip
const ANIM_CONFIG = {
  damping: 90,
  stiffness: 1000,
  easing: Easing.out(Easing.ease),
};

// Enter "flip" preset for the numeric counter before springing back to rest
const ENTER_SCALE = 0.6;
const ENTER_TRANSLATE_Y = 7;
const ENTER_ROTATE_X = 45;
const ENTER_OPACITY = 0.5;

export const Title: FC = () => {
  const { currentChannelIndex, prevChannelIndex, isDone } = useCatchUpAnimation();

  // Human-friendly count: 1-based index of current card; never show 0
  const numberOfLeftChannels = useDerivedValue(() => {
    return Math.max(currentChannelIndex.get() + 1, 1).toFixed(0);
  });

  // Shared values controlling a subtle 3D flip/slide on index change
  const titleScale = useSharedValue(1);
  const titleTransformY = useSharedValue(0);
  const titleRotateX = useSharedValue(0);
  const titleOpacity = useSharedValue(1);

  const rTitleContainerStyle = useAnimatedStyle(() => {
    return {
      // Hide and lift the title when "Done" overlay is visible to reduce visual clutter
      opacity: withTiming(isDone.get() ? 0 : 1, { duration: DURATION }),
      transform: [{ translateY: withTiming(isDone.get() ? -20 : 0, { duration: DURATION }) }],
    };
  });

  const rReTextStyle = useAnimatedStyle(() => {
    return {
      // Compose transforms to simulate a small 3D number flip
      opacity: titleOpacity.get(),
      transform: [
        { translateY: titleTransformY.get() },
        { rotateX: `${titleRotateX.get()}deg` },
        { scale: titleScale.get() },
      ],
    };
  });

  useAnimatedReaction(
    () => ({
      currentChannelIndexValue: currentChannelIndex.get(),
      prevChannelIndexValue: prevChannelIndex.get(),
    }),
    ({ currentChannelIndexValue, prevChannelIndexValue }) => {
      // Direction-aware flip: up when advancing, down when going back (Undo)
      // withSequence sets an immediate enter pose (duration: 0), then springs to neutral for snappy feedback
      if (currentChannelIndexValue < prevChannelIndexValue) {
        titleScale.set(
          withSequence(withTiming(ENTER_SCALE, { duration: 0 }), withSpring(1, ANIM_CONFIG))
        );
        titleTransformY.set(
          withSequence(withTiming(-ENTER_TRANSLATE_Y, { duration: 0 }), withSpring(0, ANIM_CONFIG))
        );
        titleRotateX.set(
          withSequence(withTiming(-ENTER_ROTATE_X, { duration: 0 }), withSpring(0, ANIM_CONFIG))
        );
        titleOpacity.set(
          withSequence(withTiming(ENTER_OPACITY, { duration: 0 }), withSpring(1, ANIM_CONFIG))
        );
      }
      if (currentChannelIndexValue > prevChannelIndexValue) {
        titleScale.set(
          withSequence(withTiming(ENTER_SCALE, { duration: 0 }), withSpring(1, ANIM_CONFIG))
        );
        titleTransformY.set(
          withSequence(withTiming(ENTER_TRANSLATE_Y, { duration: 0 }), withSpring(0, ANIM_CONFIG))
        );
        titleRotateX.set(
          withSequence(withTiming(ENTER_ROTATE_X, { duration: 0 }), withSpring(0, ANIM_CONFIG))
        );
        titleOpacity.set(
          withSequence(withTiming(ENTER_OPACITY, { duration: 0 }), withSpring(1, ANIM_CONFIG))
        );
      }
    }
  );

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center">
      <Animated.View
        className="flex-row items-center gap-1"
        style={rTitleContainerStyle}
        // Layout transitions ensure smooth spacing changes if font metrics differ across platforms
        layout={LinearTransition}
      >
        <Animated.View style={rReTextStyle} layout={LinearTransition}>
          <ReText text={numberOfLeftChannels} style={styles.text} verticalAlign="middle" />
        </Animated.View>
        <Animated.Text className="text-lg font-bold text-neutral-200" layout={LinearTransition}>
          Left
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    // Android font metrics differ; a small lineHeight helps keep vertical alignment tight
    lineHeight: Platform.OS === "android" ? 6 : undefined,
    fontWeight: "bold",
    color: "#e5e5e5",
  },
});

// slack-catch-up-header-counter-animation 🔼
// slack-catch-up-cards-swipe-animation 🔼
