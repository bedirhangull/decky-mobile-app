import { Text, View, StyleSheet } from "react-native";
import { cn } from "@/src/shared/lib/utils/cn";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";
import SegmentedControl from "@/src/shared/components/segmented-control";

// opal-schedule-timer-tabs-transition-animation 🔽

// Acts as the visual switch driving page index in parent; indicator animates via SegmentedControl internals.
// Keep paddings small (3px) to create tight pill look and predictable indicator math across platforms.

type SwitcherProps = {
  value: "schedule" | "timer";
  setValue: (value: "schedule" | "timer") => void;
};

const ScheduleTimerControl = ({ value, setValue }: SwitcherProps) => {
  return (
    <SegmentedControl
      value={value}
      onValueChange={(v) => setValue(v as "schedule" | "timer")}
      className="overflow-hidden mx-4 px-[3px] py-[3px] rounded-full"
      style={styles.borderCurve}
    >
      <BlurView intensity={8} tint="systemThickMaterialLight" style={StyleSheet.absoluteFill} />

      <SegmentedControl.Indicator
        className="bg-neutral-400/30 top-[3px] rounded-full"
        style={styles.borderCurve}
      />

      <SegmentedControl.Item value="schedule" className="flex-1 py-2 px-4 rounded-full">
        <View className="flex-row gap-2 items-center justify-center">
          <Ionicons
            name="calendar-outline"
            size={14}
            color={value === "schedule" ? "white" : "grey"}
          />
          <Text
            className={cn(
              value === "schedule" ? "text-white font-semibold" : "text-neutral-400 font-semibold",
              "text-center"
            )}
          >
            Schedule
          </Text>
        </View>
      </SegmentedControl.Item>
      <SegmentedControl.Item value="timer" className="flex-1 py-2 px-4 rounded-full">
        <View className="flex-row gap-2 items-center justify-center">
          <Ionicons name="play" size={15} color={value === "timer" ? "white" : "grey"} />
          <Text
            className={cn(
              value === "timer" ? "text-white font-semibold" : "text-neutral-400 font-semibold",
              "text-center"
            )}
          >
            Timer
          </Text>
        </View>
      </SegmentedControl.Item>
    </SegmentedControl>
  );
};

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: "continuous",
  },
});

export default ScheduleTimerControl;

// opal-schedule-timer-tabs-transition-animation 🔼
