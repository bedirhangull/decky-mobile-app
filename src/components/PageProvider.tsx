import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type ReactNode } from 'react';
import { View } from 'react-native';

interface PageProviderProps {
  children: ReactNode;
  scrollable?: boolean;
}

export function PageProvider({ children, scrollable = false }: PageProviderProps) {
  if (scrollable) {
    return (
      <SafeAreaView 
      style={{ flex: 1, backgroundColor: "#fbfcfa"  }}
      className="bg-background">
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
    style={{ flex: 1, backgroundColor: "#fbfcfa"  }}
    className="flex-1 bg-background">
      <View className="flex-1 px-4">
        {children}
      </View>
    </SafeAreaView>
  );
}
