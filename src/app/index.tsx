import { BottomSheet, Button } from 'heroui-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCSSVariable } from 'uniwind';
import { DynamicText } from '@/components/molecules/dynamic-text';
import { router } from 'expo-router';

const HELLO_ITEMS = [
  'Merhaba',
  'Hello',
  'Hola',
  'Bonjour',
  'Hallo',
  'Ciao',
  'こんにちは',
  'Olá',
  '안녕하세요',
  'Привет',
  '你好',
];

export default function Index() {
  const { t } = useTranslation();
  const foregroundColor = String(useCSSVariable('--foreground') ?? '#0f1a00');
  const backgroundColor = String(useCSSVariable('--background') ?? '#f5f5f5');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <View className="flex-1 bg-background px-6">

          {/* Center — dynamic hello */}
          <View className="flex-1 items-center justify-center">
            <DynamicText
              items={HELLO_ITEMS}
              loop
              animationPreset="slide"
              animationDirection="up"
              timing={{ interval: 2000, animationDuration: 400 }}
              text={{ fontSize: 52, fontWeight: '700', color: foregroundColor }}
              contentStyle={{ height: 72, width: 280 }}
            />
          </View>

          {/* Bottom — logo, title, description, button */}
          <View className="pb-8">
            <View className="gap-3">
              <Image
                source={require('@/assets/logo.png')}
                className="h-[48px] w-[48px] rounded-lg"
                resizeMode="contain"
              />
              <Text className="text-foreground text-[40px] font-bold tracking-tight">
                {t('WELCOME_TITLE')}
              </Text>
              <Text className="text-muted text-base leading-6">
                {t('WELCOME_DESCRIPTION')}
              </Text>
            </View>

            <Button className="bg-accent w-full mt-6" onPress={() => setIsOpen(true)}>
              <Button.Label
                style={{ fontWeight: 'bold' }}
                className="text-accent-foreground font-bold">
                {t('WELCOME_GET_STARTED')}
              </Button.Label>
            </Button>
          </View>

        </View>
      </SafeAreaView>

      <BottomSheet isOpen={isOpen} onOpenChange={setIsOpen}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content snapPoints={['50%']}>
            <View className=" gap-4">

              {/* Header */}
              <View className="gap-2">
                <BottomSheet.Title className="text-foreground text-2xl font-bold">
                  {t('AUTH_SHEET_TITLE')}
                </BottomSheet.Title>
                <BottomSheet.Description className="text-muted text-sm leading-5">
                  {t('AUTH_SHEET_DESCRIPTION')}
                </BottomSheet.Description>
              </View>

              {/* Apple Button */}
              <Button className="bg-black w-full" onPress={() => {}}>
                <FontAwesome name="apple" size={22} color="white" />
                <Button.Label className="text-white font-semibold">
                  {t('AUTH_APPLE')}
                </Button.Label>
              </Button>

              {/* Email Button */}
              <Button
                variant="outline"
                className="w-full"
                onPress={() => { setIsOpen(false); router.push('/login'); }}
              >
                <Button.Label className="text-foreground font-semibold">
                  {t('AUTH_EMAIL')}
                </Button.Label>
              </Button>

            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>
    </>
  );
}
