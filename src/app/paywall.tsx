import { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from 'heroui-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react-native';

// ── Avatars ───────────────────────────────────────────────────────────────────
const AVATAR_IMAGES = [
  require('@/assets/avatars/avatar1.png'),
  require('@/assets/avatars/avatar2.png'),
  require('@/assets/avatars/avatar3.png'),
  require('@/assets/avatars/avatar4.png'),
  require('@/assets/avatars/avatar5.png'),
];

// ── AnimatedAvatar ────────────────────────────────────────────────────────────
function AnimatedAvatar({ source, delay, index }: { source: any; delay: number; index: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        marginLeft: index === 0 ? 0 : -12,
        opacity,
        transform: [{ translateX }],
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 3,
        borderColor: '#fbfcfa',
        overflow: 'hidden',
        backgroundColor: '#e5e7eb',
      }}
    >
      <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
    </Animated.View>
  );
}

// ── Feature row ───────────────────────────────────────────────────────────────
function FeatureRow({ icon, titleKey, descKey }: { icon: string; titleKey: string; descKey: string }) {
  const { t } = useTranslation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(15,26,0,0.04)',
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: '#d9fd0c',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon as any} size={22} color="#0f1a00" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#0f1a00', marginBottom: 3 }}>
          {t(titleKey)}
        </Text>
        <Text style={{ fontSize: 13, color: '#888', lineHeight: 18 }}>
          {t(descKey)}
        </Text>
      </View>
    </View>
  );
}

// ── Countdown block ───────────────────────────────────────────────────────────
function TimeBlock({ value }: { value: string }) {
  return (
    <View
      style={{
        width: 60,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#0f1a00',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#d9fd0c', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
        {value}
      </Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function PaywallScreen() {
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState(3599);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = Math.floor(secondsLeft / 3600).toString().padStart(2, '0');
  const m = Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, '0');
  const s = (secondsLeft % 60).toString().padStart(2, '0');

  const proceed = () => router.replace('/streak');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fbfcfa' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Hero image */}
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/flagged/photo-1574164908900-6275ca361157' }}
          style={{
            paddingHorizontal: 24,
            paddingTop: 44,
            paddingBottom: 60,
            alignItems: 'center',
            gap: 18,
          }}
          resizeMode="cover"
        >
          {/* Dark gradient overlay — fades to page bg at bottom */}
          <LinearGradient
            colors={['rgba(0,0,0,0.18)', 'rgba(0,0,0,0.58)', '#fbfcfa']}
            locations={[0, 0.68, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            pointerEvents="none"
          />

          {/* X button */}
          <Pressable
            onPress={proceed}
            hitSlop={12}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(255,255,255,0.20)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} color="#fff" />
          </Pressable>

          {/* Laurel + award badge */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={require('@/assets/laurel.png')}
              style={{ width: 60, height: 60 }}
              resizeMode="contain"
            />
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '800',
                  letterSpacing: 2,
                  color: '#fff',
                  textTransform: 'uppercase',
                }}
              >
                {t('PAYWALL_AWARD_TITLE')}
              </Text>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: '500' }}>
                {t('PAYWALL_AWARD_SUBTITLE')}
              </Text>
            </View>
            <Image
              source={require('@/assets/laurel.png')}
              style={{ width: 60, height: 60, transform: [{ scaleX: -1 }] }}
              resizeMode="contain"
            />
          </View>

          {/* Headline */}
          <Text
            style={{
              fontSize: 30,
              fontWeight: '900',
              color: '#fff',
              textAlign: 'center',
              letterSpacing: -0.8,
              lineHeight: 36,
            }}
          >
            {t('PAYWALL_TITLE')}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.72)',
              textAlign: 'center',
              fontWeight: '500',
              lineHeight: 22,
            }}
          >
            {t('PAYWALL_SUBTITLE')}
          </Text>
        </ImageBackground>

        <View style={{ paddingHorizontal: 24, paddingTop: 28, gap: 28 }}>
          {/* Pricing */}
          <View style={{ alignItems: 'center', gap: 10 }}>
            {/* Original monthly — crossed out */}
            <Text style={{ fontSize: 15, color: '#bbb', fontWeight: '600', textDecorationLine: 'line-through' }}>
              {t('PAYWALL_PRICE_ORIGINAL')} {t('PAYWALL_PRICE_MONTHLY_LABEL')}
            </Text>

            {/* Discounted monthly */}
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
              <Text style={{ fontSize: 52, fontWeight: '900', color: '#0f1a00', letterSpacing: -2 }}>
                {t('PAYWALL_PRICE_DISCOUNTED')}
              </Text>
              <Text style={{ fontSize: 16, color: '#888', fontWeight: '600' }}>
                {t('PAYWALL_PRICE_MONTHLY_LABEL')}
              </Text>
            </View>

            {/* Annual billing note */}
            <View style={{ backgroundColor: 'rgba(217,253,12,0.22)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 }}>
              <Text style={{ fontSize: 13, color: '#3d4700', fontWeight: '700', textAlign: 'center' }}>
                {t('PAYWALL_PRICE_ANNUAL')}
              </Text>
            </View>

            {/* Countdown */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <TimeBlock value={h} />
              <Text style={{ color: '#0f1a00', fontSize: 22, fontWeight: '800' }}>:</Text>
              <TimeBlock value={m} />
              <Text style={{ color: '#0f1a00', fontSize: 22, fontWeight: '800' }}>:</Text>
              <TimeBlock value={s} />
            </View>
            <Text style={{ fontSize: 12, color: '#999', fontWeight: '500' }}>
              {t('PAYWALL_TIMER_LABEL')}
            </Text>
          </View>

          {/* Features */}
          <View style={{ gap: 10 }}>
            <FeatureRow
              icon="albums-outline"
              titleKey="PAYWALL_FEATURE_1_TITLE"
              descKey="PAYWALL_FEATURE_1_DESC"
            />
            <FeatureRow
              icon="color-wand-outline"
              titleKey="PAYWALL_FEATURE_2_TITLE"
              descKey="PAYWALL_FEATURE_2_DESC"
            />
            <FeatureRow
              icon="headset-outline"
              titleKey="PAYWALL_FEATURE_3_TITLE"
              descKey="PAYWALL_FEATURE_3_DESC"
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 28,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.07)',
          backgroundColor: '#fbfcfa',
          gap: 14,
        }}
      >
        {/* Animated avatar stack */}
        <View style={{ alignItems: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            {AVATAR_IMAGES.map((src, i) => (
              <AnimatedAvatar key={i} source={src} delay={i * 100} index={i} />
            ))}
          </View>
          <Text style={{ fontSize: 14, color: '#0f1a00', fontWeight: '600', textAlign: 'center' }}>
            {t('PAYWALL_SOCIAL_PROOF')}
          </Text>
        </View>

        {/* CTA */}
        <Button onPress={proceed} size="lg">
          <Button.Label style={{ fontWeight: 'bold' }} className="text-accent-foreground font-bold">
            {t('PAYWALL_CTA')}
          </Button.Label>
        </Button>

        {/* Skip */}
        <Pressable onPress={proceed} style={{ alignItems: 'center', paddingVertical: 4 }}>
          <Text style={{ fontSize: 13, color: '#bbb', fontWeight: '500' }}>
            {t('PAYWALL_SKIP')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
