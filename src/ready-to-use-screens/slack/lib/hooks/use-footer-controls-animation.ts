import { useWindowDimensions } from "react-native";
import { useCatchUpAnimation } from "../provider/catch-up-animation";
import { useChannelAnimation } from "../provider/channel-animation";
import { useAnimatedReaction, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// slack-catch-up-cards-swipe-animation 🔽

// Longer duration than header undo to read as a deliberate action (button-initiated)
const DURATION = 500;
const TIMEOUT = 250;

export const useFooterControlsAnimation = (index: number) => {
  const { width } = useWindowDimensions();

  const {
    isDragging,
    animatedChannelIndex,
    currentChannelIndex,
    prevChannelIndex,
    isKeepUnreadPressed,
    isMarkAsReadPressed,
  } = useCatchUpAnimation();

  const { panX, absoluteYAnchor, handleChannelStatus } = useChannelAnimation();

  // Reset flags and apply store change after the dismissal animation completes
  const resetKeepUnreadPressed = () => {
    setTimeout(() => {
      // Be sure to set isKeepUnreadPressed before handleChannelStatus call to avoid re-render issue on store update
      isKeepUnreadPressed.set(false);
      isDragging.set(false);
      handleChannelStatus("unread");
    }, TIMEOUT);
  };

  const resetMarkAsReadPressed = () => {
    setTimeout(() => {
      // Be sure to set isMarkAsReadPressed before handleChannelStatus call to avoid re-render issue on store update
      isMarkAsReadPressed.set(false);
      isDragging.set(false);
      handleChannelStatus("read");
    }, TIMEOUT);
  };

  // Common preparation for a programmatic dismissal (no vertical movement, disable gesture)
  const onButtonPressed = () => {
    "worklet";
    isDragging.set(true);
    absoluteYAnchor.set(0);

    // Important here to keep an order so currentChannelIndex is last
    // Visual index (animated) moves first, then the integer index advances
    prevChannelIndex.set(currentChannelIndex.get());
    animatedChannelIndex.set(withTiming(currentChannelIndex.get() - 1, { duration: DURATION }));
    currentChannelIndex.set(currentChannelIndex.get() - 1);
  };

  // React only for the currently active card to prevent multiple cards moving at once
  useAnimatedReaction(
    () => {
      return {
        isKeepUnreadPressedValue: isKeepUnreadPressed.get(),
        isMarkAsReadPressedValue: isMarkAsReadPressed.get(),
      };
    },
    ({ isKeepUnreadPressedValue, isMarkAsReadPressedValue }) => {
      if (index !== currentChannelIndex.get()) {
        return;
      }

      if (isKeepUnreadPressedValue) {
        onButtonPressed();
        // Slide left off-screen (keep unread). 2x width ensures it clears the viewport on all devices
        panX.set(withTiming(-width * 2, { duration: DURATION }));
        scheduleOnRN(resetKeepUnreadPressed);
      }

      if (isMarkAsReadPressedValue) {
        onButtonPressed();
        // Slide right off-screen (mark as read)
        panX.set(withTiming(width * 2, { duration: DURATION }));
        scheduleOnRN(resetMarkAsReadPressed);
      }
    }
  );
};

// slack-catch-up-cards-swipe-animation 🔼
