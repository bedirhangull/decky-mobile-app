import { useEffect, useRef } from 'react';
import { Animated, Pressable, StatusBar, Text, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const ACCENT = '#d9fd0c';
const ACCENT_FOREGROUND = '#0f1a00';

// Staggered fade + slide-up for text elements
function FadeSlide({
  children,
  delay,
  style,
}: {
  children: React.ReactNode;
  delay: number;
  style?: ViewStyle;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>
      {children}
    </Animated.View>
  );
}

export default function Streak() {
  const { t } = useTranslation();

  // Background glow breathe
  const glowOpacity = useRef(new Animated.Value(0.25)).current;
  // Ring entrance
  const ringScale = useRef(new Animated.Value(0)).current;
  // Outer glow ring pulse (opacity-based, supports useNativeDriver)
  const outerGlowOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Ring springs in after slight delay
    Animated.sequence([
      Animated.delay(150),
      Animated.spring(ringScale, {
        toValue: 1,
        tension: 55,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Background glow breathes
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.65, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.2, duration: 1500, useNativeDriver: true }),
      ])
    ).start();

    // Outer ring halo pulses
    Animated.loop(
      Animated.sequence([
        Animated.timing(outerGlowOpacity, { toValue: 0.18, duration: 1100, useNativeDriver: true }),
        Animated.timing(outerGlowOpacity, { toValue: 0.5, duration: 1100, useNativeDriver: true }),
      ])
    ).start();

    const navTimer = setTimeout(() => {
      router.replace('/(tabs)/feed');
    }, 5000);

    return () => clearTimeout(navTimer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      {/* Dark fire gradient background */}
      <LinearGradient
        colors={['#0d0000', '#2a0400', '#5c0f00', '#8c2208']}
        locations={[0, 0.25, 0.6, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Breathing ambient glow (bottom-up) */}
      <Animated.View
        pointerEvents="none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: glowOpacity }}
      >
        <LinearGradient
          colors={['transparent', 'transparent', '#ff3d0055', '#ff6a0088']}
          locations={[0, 0.25, 0.65, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{ flex: 1 }}
        />
      </Animated.View>

      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            paddingTop: 40,
            paddingBottom: 36,
          }}
        >

          {/* Top chip */}
          <FadeSlide delay={700}>
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.10)',
                borderRadius: 24,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.18)',
                paddingHorizontal: 20,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 17 }}>🔥</Text>
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14, letterSpacing: 0.2 }}>
                {t('STREAK_SUBTITLE')}
              </Text>
            </View>
          </FadeSlide>

          {/* Center: Streak ring */}
          <Animated.View
            style={{
              transform: [{ scale: ringScale }],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer halo glow (opacity pulse) */}
            <Animated.View
              style={{
                position: 'absolute',
                width: 240,
                height: 240,
                borderRadius: 120,
                backgroundColor: '#ff4500',
                opacity: outerGlowOpacity,
              }}
            />

            {/* Ring border */}
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                borderWidth: 3,
                borderColor: '#ff7a3a',
                backgroundColor: 'rgba(20, 4, 0, 0.85)',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 76,
                  fontWeight: '900',
                  color: '#ffffff',
                  letterSpacing: -3,
                  lineHeight: 82,
                  includeFontPadding: false,
                }}
              >
                1
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: 'rgba(255,255,255,0.55)',
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  marginTop: -4,
                }}
              >
                streak
              </Text>
            </View>
          </Animated.View>

          {/* Bottom: Title, description, button */}
          <View style={{ alignItems: 'center', gap: 20, width: '100%' }}>
            <FadeSlide delay={900}>
              <View style={{ alignItems: 'center', gap: 10 }}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 32,
                    fontWeight: '800',
                    textAlign: 'center',
                    letterSpacing: -0.5,
                  }}
                >
                  {t('STREAK_TITLE')}
                </Text>
                <Text
                  style={{
                    color: 'rgba(255,255,255,0.60)',
                    fontSize: 15,
                    textAlign: 'center',
                    lineHeight: 23,
                    maxWidth: 270,
                  }}
                >
                  {t('STREAK_DESCRIPTION')}
                </Text>
              </View>
            </FadeSlide>

            <FadeSlide delay={1100} style={{ width: '100%' }}>
              <Pressable
                onPress={() => router.replace('/(tabs)/feed')}
                style={({ pressed }) => ({
                  backgroundColor: ACCENT,
                  borderRadius: 14,
                  paddingVertical: 16,
                  width: '100%',
                  alignItems: 'center',
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <Text style={{ color: ACCENT_FOREGROUND, fontWeight: '800', fontSize: 17 }}>
                  {t('STREAK_BUTTON')}
                </Text>
              </Pressable>
            </FadeSlide>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}
