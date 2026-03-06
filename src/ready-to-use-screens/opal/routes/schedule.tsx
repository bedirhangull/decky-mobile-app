import { View, Pressable, StyleSheet, LayoutChangeEvent, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ChevronDown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import ScheduleTimerControl from "../components/schedule/schedule-timer-control";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  useAnimatedRef,
  useDerivedValue,
  scrollTo,
  withSpring,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { ScheduleContent } from "../components/schedule/schedule-content";
import { TimerContent } from "../components/schedule/timer-content";

// opal-schedule-timer-tabs-transition-animation 🔽

// Animation intent: programmatically slide between two bottom-aligned panels (Schedule/Timer)
// while keeping the segmented control visually anchored above each panel's top edge.

export const Schedule = () => {
  const [visibleContent, setVisibleContent] = useState<"schedule" | "timer">("schedule");

  const { width: screenWidth } = useWindowDimensions();

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  // Shared measurements drive precise positioning instead of hardcoded offsets.
  // containerHeight: bottom area container height used to compute control's bottom inset
  // scheduleContentTopY/timerContentTopY: measured Y of each page's inner content (aligns control to panel top)
  const containerHeight = useSharedValue(0);
  const scheduleContentTopY = useSharedValue(0);
  const timerContentTopY = useSharedValue(0);

  // progress: page index in [0,1]; drives horizontal scroll and control alignment
  const progress = useSharedValue(0);

  // Spring to 0/1 for snappy yet controlled switching; UI-thread animation avoids JS jank.
  // The config prioritizes quick settle without noticeable overshoot for a utility control.
  const setProgress = (index: number) => {
    progress.set(withSpring(index, { duration: 350, dampingRatio: 2 }));
  };

  // Keep the ScrollView in sync with progress entirely on the UI thread.
  // Using useDerivedValue ensures scrollTo runs as a worklet for 60fps programmatic paging.
  useDerivedValue(() => {
    scrollTo(scrollRef, progress.get() * screenWidth, 0, false);
  });

  // Align segmented control with the currently visible panel's top edge.
  // Interpolates the measured top Y between schedule/timer based on progress, then converts
  // to a bottom offset by subtracting from containerHeight and adding a small spacing (12px).
  const rSegmentedControlStyle = useAnimatedStyle(() => {
    return {
      bottom:
        containerHeight.get() -
        // Interpolation: progress 0 -> scheduleTopY, 1 -> timerTopY; linear mapping, clamped by input bounds.
        interpolate(progress.get(), [0, 1], [scheduleContentTopY.get(), timerContentTopY.get()]) +
        12,
    };
  });

  return (
    <View className="flex-1">
      <Image
        style={StyleSheet.absoluteFill}
        placeholder={{
          blurhash:
            "h14-@F9a%fM{R.Ipt7e:9aD*?GIVs:xZR+ay_2R*t7xtM|xZRkofaK%1NGxuE2X8RkoL9a%LIVxuRjxtR*R*",
        }}
      />

      <LinearGradient
        colors={["transparent", "rgba(48,43,35,0.95)", "black"]}
        locations={[0.2, 0.55, 0.9]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        className="absolute left-0 right-0"
        style={{ bottom: insets.bottom }}
        onLayout={(e) => {
          // Measure container height once mounted; avoids magic numbers and adapts to safe-area devices.
          containerHeight.set(e.nativeEvent.layout.height);
        }}
      >
        {/* Reanimated ScrollView allows UI-thread scrollTo and disables user swipes to prevent gesture conflicts. */}
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 4,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEnabled={false}
        >
          <View
            className="mt-auto px-4"
            style={{ width: screenWidth }}
            // Capture the schedule panel's top Y so the control can align to it during transitions.
            onLayout={(e: LayoutChangeEvent) => scheduleContentTopY.set(e.nativeEvent.layout.y)}
          >
            <ScheduleContent />
          </View>

          <View
            className="mt-auto px-4"
            style={{ width: screenWidth }}
            // Capture the timer panel's top Y for interpolation when progress → 1.
            onLayout={(e: LayoutChangeEvent) => timerContentTopY.set(e.nativeEvent.layout.y)}
          >
            <TimerContent />
          </View>
        </Animated.ScrollView>

        {/* Absolute layer so the control rides on top; animated bottom keeps it visually glued to content. */}
        <Animated.View className="absolute left-0 right-0" style={rSegmentedControlStyle}>
          <ScheduleTimerControl
            value={visibleContent}
            setValue={(v) => {
              setVisibleContent(v);
              const index = v === "schedule" ? 0 : 1;
              setProgress(index);
            }}
          />
        </Animated.View>
      </View>

      <Pressable
        onPress={router.back}
        className="absolute left-4 overflow-hidden border border-neutral-700/50 rounded-full p-1.5 bg-neutral-700/30"
        style={{ top: insets.top + 12 }}
      >
        <BlurView intensity={8} tint="systemThinMaterialLight" style={StyleSheet.absoluteFill} />
        <ChevronDown size={20} color="white" />
      </Pressable>
    </View>
  );
};

// opal-schedule-timer-tabs-transition-animation 🔼
