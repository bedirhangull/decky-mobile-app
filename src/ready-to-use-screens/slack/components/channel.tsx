import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { MarkView } from "./mark-view";
import { Chat } from "./chat";
import ChannelContainer from "./channel-container";
import { ColorBackground } from "./color-background";
import { Channel as ChannelType } from "../lib/types";
import { useCatchUpAnimation } from "../lib/provider/catch-up-animation";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

// slack-catch-up-cards-swipe-animation 🔽

type Props = {
  channel: ChannelType;
  index: number;
};

export const Channel: FC<Props> = ({ channel, index }) => {
  const { isDragging } = useCatchUpAnimation();

  const rSwipeIndicationContainerStyle = useAnimatedStyle(() => {
    return {
      // Show hint UI only while user is actively dragging
      opacity: withTiming(isDragging.get() ? 1 : 0, { duration: 150 }),
    };
  });

  return (
    <ChannelContainer index={index}>
      <Chat channel={channel} />
      <Animated.View
        style={[StyleSheet.absoluteFill, rSwipeIndicationContainerStyle]}
        className="pointer-events-none"
      >
        {/**
         * Background gradients indicate direction: green = right (read), blue = left (keep unread).
         * MarkView overlays provide icon + circular progress arc.
         */}
        <ColorBackground />
        <View className="absolute top-5 left-5 right-5 flex-row items-center justify-between">
          <MarkView variant="keep-read" />
          <MarkView variant="keep-unread" />
        </View>
      </Animated.View>
    </ChannelContainer>
  );
};

// slack-catch-up-cards-swipe-animation 🔼
