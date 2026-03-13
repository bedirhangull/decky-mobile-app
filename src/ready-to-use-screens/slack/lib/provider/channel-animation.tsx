import { createContext, FC, PropsWithChildren, useCallback, useContext } from "react";
import { useWindowDimensions, InteractionManager } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  SharedValue,
  useSharedValue,
  withDecay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSingleHapticOnPanGesture } from "../hooks/use-single-haptic-on-pan-gesture";
import { useCatchUpStore } from "../store/catch-up";
import { ChannelStatus } from "../types";
import * as Haptics from "expo-haptics";
import { useCatchUpAnimation } from "./catch-up-animation";
import { scheduleOnRN } from "react-native-worklets";

// slack-catch-up-cards-swipe-animation 🔽

const SPRING_CONFIG = {
  damping: 60,
  stiffness: 900,
};

type ContextValue = {
  // panX, panY are used to move the channel along the screen
  panX: SharedValue<number>;
  panY: SharedValue<number>;
  // absoluteYAnchor is used to handle rotation of the card based on the part of the screen you start the gesture (top or bottom)
  absoluteYAnchor: SharedValue<number>;
  // panDistance is the distance you need to drag the card to swipe it left or right
  panDistance: number;
  // handleChannelStatus is used to update the channel status (or any other needed data) in the store
  handleChannelStatus: (status: ChannelStatus) => void;
};

const ChannelAnimationContext = createContext<ContextValue>({} as ContextValue);

export const ChannelAnimationProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isDragging, animatedChannelIndex, currentChannelIndex, prevChannelIndex, isDone } =
    useCatchUpAnimation();

  const { width } = useWindowDimensions();
  // Threshold: quarter of screen width feels reachable yet deliberate
  // Used for both visual progress (animatedChannelIndex) and commit decision on release
  const panDistance = width / 4;

  // panX, panY are used to move the channel along the screen
  const panX = useSharedValue(0);
  const panY = useSharedValue(0);
  // Anchor used downstream for rotation direction (top drag tilts one way, bottom the other)
  const absoluteYAnchor = useSharedValue(0);

  // hook to add haptic when we pan the card more than panDistance
  const { singleHapticOnChange } = useSingleHapticOnPanGesture({
    triggerOffset: panDistance,
    axis: "x",
  });

  const setChannelStatus = useCatchUpStore.use.setChannelStatus();

  const handleChannelStatus = useCallback((status: ChannelStatus) => {
    if (currentChannelIndex.get() === -1 && prevChannelIndex.get() === 0) {
      // When last item is swiped, signal completion and give light haptics
      isDone.set(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // We handle the status update in both direction as user can undo the action
    if (currentChannelIndex.get() < prevChannelIndex.get()) {
      const channelIndex = currentChannelIndex.get() + 1;
      InteractionManager.runAfterInteractions(() => {
        setChannelStatus(channelIndex, status);
      });
    } else {
      const channelIndex = currentChannelIndex.get();
      InteractionManager.runAfterInteractions(() => {
        setChannelStatus(channelIndex, status);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Main pan gesture: updates visual progress during drag and commits on release
  const gesture = Gesture.Pan()
    .onBegin((event) => {
      isDragging.set(true);
      absoluteYAnchor.set(event.absoluteY);
    })
    .onChange((event) => {
      // Progress in "card index" space: 1.0 shift equals one card dismissed
      const progress = currentChannelIndex.get() - Math.abs(event.translationX) / panDistance;
      // Clamp progress to at most one card ahead to avoid skipping
      animatedChannelIndex.set(
        progress < currentChannelIndex.get() - 1 ? currentChannelIndex.get() - 1 : progress
      );

      panX.set(event.translationX);
      panY.set(event.translationY);

      singleHapticOnChange(event);
    })
    .onEnd((event) => {
      isDragging.set(false);

      if (Math.abs(event.translationX) > panDistance) {
        // Commit: move to next card (left or right) and remember previous for undo logic
        prevChannelIndex.set(Math.round(currentChannelIndex.get()));
        currentChannelIndex.set(Math.round(currentChannelIndex.get() - 1));

        const status = event.translationX > 0 ? "read" : "unread";
        const sign = event.translationX > 0 ? 1 : -1;

        // Fling card off-screen horizontally; vertical uses a quick decay for natural release
        panX.set(withTiming(sign * width * 2));
        panY.set(
          withSequence(
            withDecay({
              velocity: event.velocityY,
            }),
            withTiming(0, { duration: 0 })
          )
        );

        scheduleOnRN(handleChannelStatus, status);
      } else {
        // We reset panX and panY to 0 on release
        // Spring back feels snappy but controlled; high stiffness + moderate damping
        panX.set(withSpring(0, SPRING_CONFIG));
        panY.set(withSpring(0, SPRING_CONFIG));

        // We need, because on release our index can be a float so we ceil it
        animatedChannelIndex.set(
          withTiming(Math.ceil(currentChannelIndex.get()), { duration: 200 })
        );
      }
    });

  const value = {
    panX,
    panY,
    absoluteYAnchor,
    panDistance,
    handleChannelStatus,
  };

  return (
    <ChannelAnimationContext.Provider value={value}>
      {/**
       * We wrap children with GestureDetector to intercept pan gestures at the provider level.
       * Why: centralizes gesture handling and keeps card components focused on visuals.
       */}
      <GestureDetector gesture={gesture}>{children}</GestureDetector>
    </ChannelAnimationContext.Provider>
  );
};

export const useChannelAnimation = () => {
  const context = useContext(ChannelAnimationContext);

  if (!context) {
    throw new Error("useChannelAnimation must be used within an ChannelAnimationProvider");
  }

  return context;
};

// slack-catch-up-cards-swipe-animation 🔼
