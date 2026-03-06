import React, { FC } from "react";
import { View, ScrollView, StyleSheet, Text, Pressable } from "react-native";
import Carousel from "../components/carousel";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnimatedDashedBorder from "../components/animated-dashed-border";
import { Plus } from "lucide-react-native";
import { simulatePress } from "@/src/shared/lib/utils/simulate-press";
import { ScreenBottomBlur } from "../components/screen-bottom-blur";
import { ScreenTopBlur } from "../components/screen-top-blur";

export const Blocks: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        contentContainerClassName="px-5"
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-neutral-50 text-xl font-semibold mb-4">Now</Text>
        {/* opal-moving-dashed-border-animation 🔽 */}
        <Pressable className="mb-8" onPress={simulatePress}>
          <AnimatedDashedBorder
            style={styles.borderCurve}
            borderRadius={18}
            dashLength={4}
            strokeColor="#262626"
          >
            <View className="w-full h-[120px] rounded-3xl items-center justify-center bg-neutral-900/70 gap-3">
              <View
                className="size-14 rounded-2xl bg-neutral-800 border border-neutral-700 items-center justify-center"
                style={styles.borderCurve}
              >
                <Plus size={22} color="#737373" />
              </View>
              <Text className="text-neutral-200 text-lg font-medium">Limit App or Website</Text>
            </View>
          </AnimatedDashedBorder>
        </Pressable>
        {/* opal-moving-dashed-border-animation 🔼 */}

        <Text className="text-neutral-50 text-xl font-semibold mb-4">Upcoming</Text>
        <View className="w-full h-[120px] rounded-3xl p-4 pt-6 bg-neutral-900/70 mb-4">
          <View className="mb-2 w-1/3 h-5 rounded-full bg-neutral-900" />
          <View className="mb-2 w-2/3 h-5 rounded-full bg-neutral-900" />
          <View className="w-2/3 h-5 rounded-full bg-neutral-900" />
        </View>
        <View className="w-full h-[120px] rounded-3xl p-4 pt-6 bg-neutral-900/70 mb-12">
          <View className="mb-2 w-1/3 h-5 rounded-full bg-neutral-900" />
          <View className="mb-2 w-2/3 h-5 rounded-full bg-neutral-900" />
          <View className="w-2/3 h-5 rounded-full bg-neutral-900" />
        </View>
        <Text className="text-neutral-50 text-xl font-semibold mb-1">Get More Done</Text>
        <Text className="text-neutral-400 text-base font-medium mb-4">
          Maximize your productivity while staying sane.
        </Text>
        <View className="-mx-5 mb-12">
          {/* opal-horizontal-carousel-animation 🔽 */}
          <Carousel
            data={[
              "L87Luf_JHtDk%yx@eUaOH[WByCx[",
              "LOH]%h^N9^Iq}ts.oLaz=eR*ofxZ",
              "LEA]]RrW0}Os%KM{WBxu11Ip|=xZ",
              "LJOXU1-pxuoz~XIoRjWBxsNHfOoJ",
            ]}
          />
          {/* opal-horizontal-carousel-animation 🔼 */}
        </View>
        <Text className="text-neutral-50 text-xl font-semibold mb-1">Sleep, Relax and Reset</Text>
        <Text className="text-neutral-400 text-base font-medium mb-4">
          Sleep better, rise refreshed.
        </Text>
        <View className="-mx-5 mb-10">
          <Carousel
            data={[
              "LKO2:N%2Tw=w]~RBVZRi};RPxuwH",
              "L60MZWh2e7f,k]f5f5e.hyfmf5e-",
              "LEHLh[WB2yk8pyoJadR*.7kCMdnj",
              "LKN]Rv%2Tw=w]~RBVZRi};RPxuwH",
              "LWD-8itmofRPKnWCV?kXM}RjkCoz",
              "L25Xx[rV00%#Mw%M%2Mw00x]~qMd",
            ]}
          />
        </View>
      </ScrollView>
      <ScreenTopBlur />
      <ScreenBottomBlur />
    </View>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});
