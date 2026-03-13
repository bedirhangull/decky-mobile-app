import { createSelectors } from "@/src/shared/lib/utils/create-selectors";
import { create } from "zustand";
import { Channel, ChannelStatus } from "../types";

// slack-catch-up-cards-swipe-animation 🔽

const initialData: Channel[] = [
  {
    id: "1",
    name: "channel-1",
    data: Array.from({ length: 20 }, (_, i) => i),
    status: "unread",
  },
  {
    id: "2",
    name: "channel-2",
    data: Array.from({ length: 20 }, (_, i) => i),
    status: "unread",
  },
  {
    id: "3",
    name: "channel-3",
    data: Array.from({ length: 20 }, (_, i) => i),
    status: "unread",
  },
  {
    id: "4",
    name: "channel-4",
    data: Array.from({ length: 20 }, (_, i) => i),
    status: "unread",
  },
  {
    id: "5",
    name: "channel-5",
    data: Array.from({ length: 20 }, (_, i) => i),
    status: "unread",
  },
];

interface State {
  unreadChannels: Channel[];
  total: number;
}

interface Actions {
  setChannelStatus: (index: number, status: ChannelStatus) => void;
}

export const initialState: State = {
  unreadChannels: initialData,
  total: initialData.length,
};

const catchUpStore = create<State & Actions>()((set) => ({
  ...initialState,
  setChannelStatus: (index, status) => {
    set((state) => ({
      ...state,
      unreadChannels: state.unreadChannels.map((channel, i) => {
        if (i === index) {
          return {
            ...channel,
            status,
          };
        }
        return channel;
      }),
    }));
  },
}));

export const useCatchUpStore = createSelectors(catchUpStore);

// slack-catch-up-cards-swipe-animation 🔼
