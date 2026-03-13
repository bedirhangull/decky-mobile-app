import { useAnimatedReaction, withSpring, withTiming } from "react-native-reanimated";
import { useChannelAnimation } from "../provider/channel-animation";
import { useCatchUpAnimation } from "../provider/catch-up-animation";
import { scheduleOnRN } from "react-native-worklets";

// slack-catch-up-cards-swipe-animation 🔽

// Animation timing chosen to feel intentional but quick for an "Undo" affordance
const DURATION = 300;

const ANIM_CONFIG = {
  damping: 90,
  stiffness: 1000,
};

export const useHeaderControlsAnimation = (index: number) => {
  const {
    isDragging,
    animatedChannelIndex,
    currentChannelIndex,
    prevChannelIndex,
    undoChannelIndex,
  } = useCatchUpAnimation();
  const { panX, panY, absoluteYAnchor, handleChannelStatus } = useChannelAnimation();

  // Undo resolves via store update after animation completes (avoid re-layout while animating)
  const resetUndoPressed = () => {
    setTimeout(() => {
      // Be sure to set undoChannelIndex before handleChannelStatus call to avoid re-render issue on store update
      undoChannelIndex.set(null);
      handleChannelStatus("unread");
    }, 250);
  };

  // Listen once per item to its undo flag; reaction runs on UI thread
  useAnimatedReaction(
    () => {
      return {
        undoChannelIndexValue: undoChannelIndex.get(),
      };
    },
    ({ undoChannelIndexValue }) => {
      if (index !== undoChannelIndex.get()) {
        return;
      }

      if (undoChannelIndexValue !== null) {
        // Disable gesture/rotation side-effects during programmatic undo
        isDragging.set(false);
        absoluteYAnchor.set(0);

        // Important here to keep an order so currentChannelIndex is last
        // Why: consumers rely on integer currentChannelIndex after animatedChannelIndex settles
        prevChannelIndex.set(currentChannelIndex.get());
        animatedChannelIndex.set(withTiming(currentChannelIndex.get() + 1, { duration: DURATION }));
        currentChannelIndex.set(currentChannelIndex.get() + 1);

        // Reset any residual pan offsets to align the card stack visually
        panX.set(withSpring(0, ANIM_CONFIG));
        panY.set(withSpring(0, ANIM_CONFIG));

        scheduleOnRN(resetUndoPressed);
      }
    }
  );
};

// slack-catch-up-cards-swipe-animation 🔼
