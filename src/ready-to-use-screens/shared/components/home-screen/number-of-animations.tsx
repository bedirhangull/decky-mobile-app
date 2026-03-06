import { FC, RefObject } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useClearRefinements, useInstantSearch, useSearchBox } from "react-instantsearch-core";
import { AppText } from "../app-text";
import { useRefinementStatus } from "../../lib/hooks/use-refinement-status";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  useSharedValue,
} from "react-native-reanimated";
import { cn } from "../../lib/utils/cn";
import { fireHaptic } from "../../lib/utils/fire-haptic";
import { FlashListRef } from "@shopify/flash-list";
import { Animation } from "../../lib/types/app";
import { useAnimationsStore } from "../../lib/store/animations";
import Shimmer from "../shimmer";

type NumberOfAnimationsProps = {
  listRef: RefObject<FlashListRef<Animation> | null>;
};

/**
 * NumberOfAnimations component - displays the total count of animations
 * Uses Algolia's useHits hook to get the total number of results
 */
export const NumberOfAnimations: FC<NumberOfAnimationsProps> = ({ listRef }) => {
  "use no memo";
  const { results } = useInstantSearch();
  const count = results?.nbHits ?? 0;

  const shimmerProgress = useSharedValue(0);

  const { hasRefinements } = useRefinementStatus();

  const { clear: clearSearch } = useSearchBox();
  const { refine: refineFilters } = useClearRefinements();

  const clearQuery = useAnimationsStore.use.clearQuery();

  const handleReset = () => {
    fireHaptic();
    clearSearch();
    clearQuery();
    refineFilters();
    setTimeout(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 300);
  };

  if (count === 0 && !hasRefinements) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn}
      className="px-6 py-3 border-neutral-700/75 flex-row items-center justify-between"
      style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
    >
      <View className={cn("flex-1 items-center", hasRefinements && "items-start")}>
        <Animated.View layout={LinearTransition.springify()}>
          {count === 0 && hasRefinements ? (
            <Animated.View
              key="no-animations"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <AppText className="text-base text-muted-foreground font-sans-medium ml-2">
                No animations found
              </AppText>
            </Animated.View>
          ) : (
            <Animated.View
              key="animations"
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
            >
              <Shimmer>
                <Shimmer.Mask
                  background={<View className="flex-1 bg-muted-foreground" />}
                  overlay={
                    <Shimmer.Overlay
                      width="100%"
                      initialDelay={2000}
                      repeatDelay={2000}
                      onProgress={shimmerProgress}
                      animation={{
                        type: "timing",
                        config: { duration: 3000, easing: Easing.bezier(0.1, 1.1, 0.8, -0.3) },
                      }}
                    >
                      <View
                        className="flex-1"
                        style={{
                          experimental_backgroundImage:
                            "linear-gradient(to right, transparent, #FFFFF5, transparent)",
                        }}
                      />
                    </Shimmer.Overlay>
                  }
                >
                  <AppText
                    className="text-base font-sans-medium text-black"
                    maxFontSizeMultiplier={1}
                  >
                    {`${count} awesome animations`}
                  </AppText>
                </Shimmer.Mask>
              </Shimmer>
            </Animated.View>
          )}
        </Animated.View>
      </View>
      {hasRefinements && (
        <View className="flex-1 items-end">
          <Pressable onPress={handleReset} hitSlop={12}>
            <AppText className="text-base text-brand">Reset</AppText>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
};
