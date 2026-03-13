import { ChevronDown, Mic, Plus } from "lucide-react-native";
import React, { FC } from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { Channel as ChannelType } from "../lib/types";

// slack-catch-up-cards-swipe-animation 🔽

type Props = {
  channel: ChannelType;
};

export const Chat: FC<Props> = ({ channel }) => {
  return (
    <View className="flex-1">
      <Pressable className="p-3 flex-row items-center justify-center gap-1 border-b border-neutral-800">
        <Text className="text-neutral-300 text-base font-semibold">#{channel.name}</Text>
        <ChevronDown size={14} color="#d4d4d4" strokeWidth={2.5} />
      </Pressable>
      <FlatList
        data={channel.data}
        renderItem={() => (
          <View className="flex-row gap-4 p-5">
            <View className="w-12 h-12 rounded-xl bg-neutral-800" />
            <View className="flex-1 gap-2">
              <View className="w-20 h-4 rounded-full bg-neutral-800" />
              <View className="w-full h-3 rounded-full bg-neutral-800" />
              <View className="w-full h-3 rounded-full bg-neutral-800" />
              <View className="w-3/4 h-3 rounded-full bg-neutral-800" />
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-[0.5px] bg-neutral-800 mx-3" />}
        keyExtractor={(item) => item.toString()}
        indicatorStyle="white"
      />
      <Pressable
        onPress={() => Alert.alert("The keyboard animation will be available very soon!")}
        className="justify-center rounded-3xl border border-neutral-800 -mx-px -mb-px"
      >
        <View className="w-10 h-10 rounded-full items-center justify-center bg-neutral-800/50 absolute left-3">
          <Plus size={24} color="#737373" />
        </View>
        <View className="pointer-events-none">
          <TextInput
            placeholder={`Message #${channel.name}`}
            placeholderTextColor="#a3a3a3"
            className="px-16 py-6"
          />
        </View>
        <View className="w-10 h-10 rounded-full items-center justify-center absolute right-3">
          <Mic size={18} color="#737373" />
        </View>
      </Pressable>
    </View>
  );
};

// slack-catch-up-cards-swipe-animation 🔼
