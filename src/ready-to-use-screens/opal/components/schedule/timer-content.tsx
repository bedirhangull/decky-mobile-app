import React, { FC } from "react";
import { View, Text, Pressable } from "react-native";
import BlurContainer from "./blur-container";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

export const TimerContent: FC = () => {
  return (
    <>
      <BlurContainer className="mb-4">
        <View className="px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="size-7 rounded-lg bg-green-500 items-center justify-center">
              <Text className="text-white text-2xl font-bold">✓</Text>
            </View>
            <Text className="text-white text-xl font-semibold">Get It Done</Text>
          </View>
        </View>
      </BlurContainer>

      <BlurContainer className="mb-4">
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Text className="text-white text-base">Duration</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-white/60 text-base">20m</Text>
            <Text className="text-white/60 text-base">›</Text>
          </View>
        </View>
      </BlurContainer>

      <BlurContainer className="mb-4">
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Text className="text-white text-base">Apps Blocked</Text>
          <View className="flex-row items-center gap-2">
            <View className="w-5 h-5 rounded-full bg-red-500" />
            <Text className="text-white/60 text-base">Block List</Text>
            <Text className="text-white/60 text-base">›</Text>
          </View>
        </View>
      </BlurContainer>

      <BlurContainer className="mb-8">
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Text className="text-white text-base">Breaks Allowed</Text>
          <View className="flex-row items-center gap-2">
            <View className="w-5 h-5 rounded-full border-2 border-white/40" />
            <Text className="text-white/60 text-base">Yes</Text>
            <Text className="text-white/60 text-base">›</Text>
          </View>
        </View>
      </BlurContainer>

      <Pressable onPress={simulatePress} className="bg-white rounded-full py-3 items-center">
        <Text className="text-black text-lg font-medium">Start Timer</Text>
      </Pressable>
    </>
  );
};
