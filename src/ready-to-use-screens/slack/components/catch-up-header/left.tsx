import React, { FC } from "react";
import { useCatchUpAnimation } from "../../lib/provider/catch-up-animation";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Pressable } from "react-native";
import { ChevronLeft, X } from "lucide-react-native";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

// slack-catch-up-cards-swipe-animation 🔽

// Quick crossfade so header icon change doesn't distract from card animation
const DURATION = 50;

export const Left: FC = () => {
  const { isDone } = useCatchUpAnimation();

  const rChevronStyle = useAnimatedStyle(() => {
    return {
      // Show back chevron while not done
      opacity: withTiming(isDone.get() ? 0 : 1, { duration: DURATION }),
    };
  });

  const rXStyle = useAnimatedStyle(() => {
    return {
      // Swap to close (X) once user is done
      opacity: withTiming(isDone.get() ? 1 : 0, { duration: DURATION }),
    };
  });

  return (
    // Placeholder behavior for demo; replace simulatePress with navigation or dismiss action
    <Pressable className="w-8 h-8 items-center justify-center" onPress={simulatePress}>
      <Animated.View style={rChevronStyle} className="absolute">
        <ChevronLeft size={28} color="#e5e5e5" strokeWidth={1.5} />
      </Animated.View>
      <Animated.View style={rXStyle} className="absolute">
        <X size={24} color="#e5e5e5" strokeWidth={1.5} />
      </Animated.View>
    </Pressable>
  );
};

// slack-catch-up-cards-swipe-animation 🔼
