import React, { FC, memo, useMemo } from "react";
import { View } from "react-native";
import { useCatchUpStore } from "../lib/store/catch-up";
import { ChannelAnimationProvider } from "../lib/provider/channel-animation";
import { Channel } from "./channel";
import { Channel as ChannelType } from "../lib/types";

// slack-catch-up-cards-swipe-animation 🔽

type Props = {
  unreadChannels: ChannelType[];
};

const MemoizedListOfChannels: FC<Props> = memo(({ unreadChannels }) => {
  return (
    <View className="flex-1">
      {/**
       * One ChannelAnimationProvider per item keeps gesture/shared values scoped to a single card.
       * Why: prevents cross-talk between cards and allows independent pan/rotation per stack element.
       */}
      {unreadChannels.map((channel, index) => (
        <ChannelAnimationProvider key={channel.id}>
          <Channel channel={channel} index={index} />
        </ChannelAnimationProvider>
      ))}
    </View>
  );
});

MemoizedListOfChannels.displayName = "MemoizedListOfChannels";

export const CatchUpChannels: FC = () => {
  const unreadChannels = useCatchUpStore.use.unreadChannels();

  // For display purposes I don't really care about channel status as It can be set in background
  // so I'm memoizing it to prevent unnecessary re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => unreadChannels, []);

  return <MemoizedListOfChannels unreadChannels={data} />;
};

// slack-catch-up-cards-swipe-animation 🔼
