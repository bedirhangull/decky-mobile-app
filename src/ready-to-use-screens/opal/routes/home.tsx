import { FC } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StartTimerButton from "../components/start-timer-button";
import { SetTimer } from "../components/set-timer";

export const Home: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 pb-2 bg-black justify-end"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 60 }}
    >
      <View className="flex-1 items-center justify-end py-6 px-3">
        {/* opal-set-timer-slider-animation 🔽 */}
        <SetTimer />
        {/* opal-set-timer-slider-animation 🔼 */}
      </View>
      {/* opal-start-timer-button-animation 🔽 */}
      <StartTimerButton />
      {/* opal-start-timer-button-animation 🔼 */}
    </View>
  );
};
