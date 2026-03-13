export type ChannelStatus = "unread" | "read";

export type Channel = {
  id: string;
  name: string;
  data: number[];
  status: ChannelStatus;
};
