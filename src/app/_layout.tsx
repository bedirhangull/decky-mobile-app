import { Stack } from "expo-router";
import { HeroUINativeProvider } from 'heroui-native';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Uniwind } from 'uniwind';
import '../../global.css';
import '../lang/18n';

Uniwind.setTheme('decky-light');

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardProvider>
        <HeroUINativeProvider>
          <View className="flex-1 bg-background">
            <Stack screenOptions={{ headerShown: false }} />
          </View>
        </HeroUINativeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
