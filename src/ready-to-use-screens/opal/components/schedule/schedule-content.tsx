import React, { FC } from "react";
import { View, Text, Pressable } from "react-native";
import BlurContainer from "./blur-container";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";

export const ScheduleContent: FC = () => {
  return (
    <>
      <BlurContainer className="mb-4">
        <View className="px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Text className="text-3xl">🌙</Text>
            <Text className="text-white text-xl font-semibold">Wind Down</Text>
          </View>
        </View>
      </BlurContainer>

      <BlurContainer className="mb-4">
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Text className="text-white text-base">From</Text>
          <Text className="text-white/60 text-base">20:00</Text>
        </View>
        <View className="h-[1px] bg-neutral-400/20 mx-4" />
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Text className="text-white text-base">To</Text>
          <Text className="text-white/60 text-base">22:00</Text>
        </View>
      </BlurContainer>

      <BlurContainer className="mb-4">
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Text className="text-white text-base">On these days:</Text>
          <Text className="text-white/40 text-sm">Every day</Text>
        </View>
        <View className="h-[1px] bg-neutral-400/20 mx-4" />
        <View className="px-4 py-4 flex-row justify-between">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <View
              key={index}
              className="w-11 h-11 rounded-full bg-white items-center justify-center"
            >
              <Text className="text-black text-base font-semibold">{day}</Text>
            </View>
          ))}
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
        <Text className="text-black text-lg font-medium">Save</Text>
      </Pressable>
    </>
  );
};
