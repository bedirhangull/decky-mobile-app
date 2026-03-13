import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { CatchUpFooter } from "../components/catch-up-footer";
import { CatchUpHeader } from "../components/catch-up-header";
import { CatchUpDone } from "../components/catch-up-done";
import { CatchUpAnimationProvider } from "../lib/provider/catch-up-animation";
import { CatchUpChannels } from "../components/catch-up-channels";

// slack-catch-up-cards-swipe-animation 🔽

export const CatchUp: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <CatchUpAnimationProvider>
      <View
        className="flex-1 px-5"
        style={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 8 }}
      >
        <LinearGradient colors={["#401147", "#20031F"]} style={StyleSheet.absoluteFill} />
        <CatchUpHeader />
        <View className="flex-1">
          <CatchUpChannels />
          <CatchUpFooter />
          <CatchUpDone />
        </View>
      </View>
    </CatchUpAnimationProvider>
  );
};

// slack-catch-up-cards-swipe-animation 🔼
