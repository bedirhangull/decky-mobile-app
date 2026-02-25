import { Button } from "heroui-native";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-semibold">Edit src/app/index.tsx</Text>
      <Button>
        <Button.Label>Selamlar</Button.Label>
      </Button>
    </View>
  );
}
