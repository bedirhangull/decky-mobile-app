import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Input, TextField } from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useCSSVariable } from 'uniwind';
import { PageProvider } from '@/src/components/PageProvider';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type LanguageOption = { code: string; nameKey: string; flag: string };
type Level = 'words_only' | 'some_phrases' | 'can_sentences' | 'conversations';
type PreviousApp = 'Duolingo' | 'Preply' | 'Memrise' | 'Anki' | 'Other';
type InterestOption = { id: string; emoji: string; labelKey: string };
type OnboardingData = {
  name: string;
  targetLanguage: LanguageOption | null;
  level: Level | null;
  previousApp: PreviousApp | null;
  interests: string[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 12;
const { width, height } = Dimensions.get('window');

const LANGUAGES: LanguageOption[] = [
  { code: 'en', nameKey: 'LANG_EN', flag: '🇺🇸' },
  { code: 'es', nameKey: 'LANG_ES', flag: '🇪🇸' },
  { code: 'fr', nameKey: 'LANG_FR', flag: '🇫🇷' },
  { code: 'de', nameKey: 'LANG_DE', flag: '🇩🇪' },
  { code: 'ja', nameKey: 'LANG_JA', flag: '🇯🇵' },
  { code: 'ko', nameKey: 'LANG_KO', flag: '🇰🇷' },
  { code: 'zh', nameKey: 'LANG_ZH', flag: '🇨🇳' },
  { code: 'it', nameKey: 'LANG_IT', flag: '🇮🇹' },
  { code: 'pt', nameKey: 'LANG_PT', flag: '🇧🇷' },
  { code: 'ru', nameKey: 'LANG_RU', flag: '🇷🇺' },
  { code: 'ar', nameKey: 'LANG_AR', flag: '🇸🇦' },
  { code: 'hi', nameKey: 'LANG_HI', flag: '🇮🇳' },
  { code: 'nl', nameKey: 'LANG_NL', flag: '🇳🇱' },
  { code: 'sv', nameKey: 'LANG_SV', flag: '🇸🇪' },
  { code: 'pl', nameKey: 'LANG_PL', flag: '🇵🇱' },
  { code: 'tr', nameKey: 'LANG_TR', flag: '🇹🇷' },
  { code: 'no', nameKey: 'LANG_NO', flag: '🇳🇴' },
  { code: 'da', nameKey: 'LANG_DA', flag: '🇩🇰' },
  { code: 'el', nameKey: 'LANG_EL', flag: '🇬🇷' },
  { code: 'cs', nameKey: 'LANG_CS', flag: '🇨🇿' },
  { code: 'ro', nameKey: 'LANG_RO', flag: '🇷🇴' },
  { code: 'uk', nameKey: 'LANG_UK', flag: '🇺🇦' },
  { code: 'he', nameKey: 'LANG_HE', flag: '🇮🇱' },
  { code: 'fi', nameKey: 'LANG_FI', flag: '🇫🇮' },
  { code: 'th', nameKey: 'LANG_TH', flag: '🇹🇭' },
  { code: 'vi', nameKey: 'LANG_VI', flag: '🇻🇳' },
  { code: 'id', nameKey: 'LANG_ID', flag: '🇮🇩' },
  { code: 'ms', nameKey: 'LANG_MS', flag: '🇲🇾' },
  { code: 'fa', nameKey: 'LANG_FA', flag: '🇮🇷' },
  { code: 'hu', nameKey: 'LANG_HU', flag: '🇭🇺' },
  { code: 'bn', nameKey: 'LANG_BN', flag: '🇧🇩' },
  { code: 'la', nameKey: 'LANG_LA', flag: '🏛️' },
  { code: 'sw', nameKey: 'LANG_SW', flag: '🇰🇪' },
  { code: 'cy', nameKey: 'LANG_CY', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'ga', nameKey: 'LANG_GA', flag: '🇮🇪' },
];

type LevelOption = { id: Level; labelKey: string };
const LEVELS: LevelOption[] = [
  { id: 'words_only', labelKey: 'ONBOARDING_LEVEL_WORDS_ONLY' },
  { id: 'some_phrases', labelKey: 'ONBOARDING_LEVEL_SOME_PHRASES' },
  { id: 'can_sentences', labelKey: 'ONBOARDING_LEVEL_CAN_SENTENCES' },
  { id: 'conversations', labelKey: 'ONBOARDING_LEVEL_CONVERSATIONS' },
];

const PREVIOUS_APPS: PreviousApp[] = ['Duolingo', 'Preply', 'Memrise', 'Anki', 'Other'];

const APP_COMPARE_FEATURES: Record<PreviousApp, string[]> = {
  Duolingo: [
    'ONBOARDING_COMPARE_DUOLINGO_1',
    'ONBOARDING_COMPARE_DUOLINGO_2',
    'ONBOARDING_COMPARE_DUOLINGO_3',
    'ONBOARDING_COMPARE_DUOLINGO_4',
  ],
  Preply: [
    'ONBOARDING_COMPARE_PREPLY_1',
    'ONBOARDING_COMPARE_PREPLY_2',
    'ONBOARDING_COMPARE_PREPLY_3',
    'ONBOARDING_COMPARE_PREPLY_4',
  ],
  Memrise: [
    'ONBOARDING_COMPARE_MEMRISE_1',
    'ONBOARDING_COMPARE_MEMRISE_2',
    'ONBOARDING_COMPARE_MEMRISE_3',
    'ONBOARDING_COMPARE_MEMRISE_4',
  ],
  Anki: [
    'ONBOARDING_COMPARE_ANKI_1',
    'ONBOARDING_COMPARE_ANKI_2',
    'ONBOARDING_COMPARE_ANKI_3',
    'ONBOARDING_COMPARE_ANKI_4',
  ],
  Other: [
    'ONBOARDING_COMPARE_OTHER_1',
    'ONBOARDING_COMPARE_OTHER_2',
    'ONBOARDING_COMPARE_OTHER_3',
    'ONBOARDING_COMPARE_OTHER_4',
  ],
};

const INTERESTS: InterestOption[] = [
  { id: 'music', emoji: '🎵', labelKey: 'INTEREST_MUSIC' },
  { id: 'movies', emoji: '🎬', labelKey: 'INTEREST_MOVIES' },
  { id: 'sports', emoji: '⚽', labelKey: 'INTEREST_SPORTS' },
  { id: 'tech', emoji: '💻', labelKey: 'INTEREST_TECH' },
  { id: 'travel', emoji: '✈️', labelKey: 'INTEREST_TRAVEL' },
  { id: 'food', emoji: '🍕', labelKey: 'INTEREST_FOOD' },
  { id: 'history', emoji: '📚', labelKey: 'INTEREST_HISTORY' },
  { id: 'gaming', emoji: '🎮', labelKey: 'INTEREST_GAMING' },
  { id: 'business', emoji: '💼', labelKey: 'INTEREST_BUSINESS' },
  { id: 'art', emoji: '🎨', labelKey: 'INTEREST_ART' },
  { id: 'science', emoji: '🔬', labelKey: 'INTEREST_SCIENCE' },
  { id: 'health', emoji: '💪', labelKey: 'INTEREST_HEALTH' },
  { id: 'news', emoji: '📰', labelKey: 'INTEREST_NEWS' },
  { id: 'comedy', emoji: '😂', labelKey: 'INTEREST_COMEDY' },
];

const CONFETTI_COLORS = ['#d9fd0c', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce'];

const AVATAR_IMAGES = [
  require('@/assets/avatars/avatar1.png'),
  require('@/assets/avatars/avatar2.png'),
  require('@/assets/avatars/avatar3.png'),
  require('@/assets/avatars/avatar4.png'),
  require('@/assets/avatars/avatar5.png'),
  require('@/assets/avatars/avatar6.png'),
];


type ConfettiConfig = { id: number; x: number; delay: number; color: string; size: number };

const confettiConfigs: ConfettiConfig[] = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * (width - 20),
  delay: Math.floor(Math.random() * 600),
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 6 + Math.floor(Math.random() * 8),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: ConfettiPiece
// ─────────────────────────────────────────────────────────────────────────────

interface ConfettiPieceProps {
  config: ConfettiConfig;
  active: boolean;
}

function ConfettiPiece({ config, active }: ConfettiPieceProps) {
  const translateY = useRef(new Animated.Value(-30)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (active) {
      translateY.setValue(-30);
      opacity.setValue(1);
      rotate.setValue(0)

      const delay = config.delay;

      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: height + 50,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 1800,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    }
  }, [active]);

  const rotateInterpolated = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: config.x,
        top: 0,
        width: config.size,
        height: config.size,
        borderRadius: config.size / 4,
        backgroundColor: config.color,
        opacity,
        transform: [{ translateY }, { rotate: rotateInterpolated }],
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: AvatarStack
// ─────────────────────────────────────────────────────────────────────────────

function AvatarStack({ count }: { count: string }) {
  const anims = useRef(
    AVATAR_IMAGES.map(() => ({
      opacity: new Animated.Value(0),
      translateX: new Animated.Value(14),
    }))
  ).current;

  useEffect(() => {
    Animated.stagger(
      90,
      anims.map(a =>
        Animated.parallel([
          Animated.timing(a.opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
          Animated.timing(a.translateX, { toValue: 0, duration: 280, useNativeDriver: true }),
        ])
      )
    ).start();
  }, []);

  return (
    <View style={{ alignItems: 'center', gap: 10, marginTop: 8 }}>
      <View style={{ flexDirection: 'row' }}>
        {AVATAR_IMAGES.map((src, i) => (
          <Animated.View
            key={i}
            style={{
              marginLeft: i === 0 ? 0 : -10,
              opacity: anims[i].opacity,
              transform: [{ translateX: anims[i].translateX }],
              width: 38,
              height: 38,
              borderRadius: 19,
              borderWidth: 2.5,
              borderColor: '#fbfcfa',
              overflow: 'hidden',
              backgroundColor: '#e5e7eb',
            }}
          >
            <Image source={src} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </Animated.View>
        ))}
      </View>
      <Text style={{ fontSize: 13, color: '#888', fontWeight: '500' }}>{count} learners</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: CustomizingItem
// ─────────────────────────────────────────────────────────────────────────────

interface CustomizingItemProps {
  label: string;
  delay: number;
}

function CustomizingItem({ label, delay }: CustomizingItemProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateX }],
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: '#d9fd0c',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="checkmark" size={16} color="#0f1a00" />
      </View>
      <Text className="text-foreground text-base font-medium flex-1">{label}</Text>
    </Animated.View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: ProgressChart
// ─────────────────────────────────────────────────────────────────────────────

interface ProgressChartProps {
  appName: string;
  language: string;
}

function ProgressChart({ appName, language }: ProgressChartProps) {
  const { t } = useTranslation();
  const otherBarHeight = useRef(new Animated.Value(0)).current;
  const deckyBarHeight = useRef(new Animated.Value(0)).current;

  const OTHER_MAX = 100;
  const DECKY_MAX = 160;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(otherBarHeight, {
        toValue: OTHER_MAX,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(deckyBarHeight, {
        toValue: DECKY_MAX,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <View className="gap-4">
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 32,
          height: DECKY_MAX + 32,
        }}
      >
        {/* Other app bar */}
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 13, color: '#6b7280', fontWeight: '600' }}>40%</Text>
          <Animated.View
            style={{
              width: 72,
              height: otherBarHeight,
              backgroundColor: '#e5e7eb',
              borderRadius: 8,
            }}
          />
          <Text
            style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', maxWidth: 80 }}
            numberOfLines={2}
          >
            {appName}
          </Text>
        </View>

        {/* Decky bar */}
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 13, color: '#0f1a00', fontWeight: '700' }}>75%</Text>
          <Animated.View
            style={{
              width: 72,
              height: deckyBarHeight,
              backgroundColor: '#d9fd0c',
              borderRadius: 8,
            }}
          />
          <Text style={{ fontSize: 12, color: '#0f1a00', fontWeight: '600', textAlign: 'center' }}>
            Decky
          </Text>
        </View>
      </View>

      {/* Chart label */}
      <Text className="text-muted text-xs text-center">
        {t('ONBOARDING_7_CHART_LABEL', { language })}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component: Onboarding
// ─────────────────────────────────────────────────────────────────────────────

export default function Onboarding() {
  const { t } = useTranslation();

  // Dynamic colors (needed in style props on Animated or dynamic components)
  const accentColor = String(useCSSVariable('--accent') ?? '#d9fd0c');
  const borderColor = String(useCSSVariable('--border') ?? '#e5e7eb');
  const foregroundColor = String(useCSSVariable('--foreground') ?? '#0f1a00');

  // State
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    targetLanguage: null,
    level: null,
    previousApp: null,
    interests: [],
  });
  const [showReady, setShowReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Animations
  const progressAnim = useRef(new Animated.Value(1 / TOTAL_STEPS)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinnerOpacity = useRef(new Animated.Value(1)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  // Animate progress bar whenever step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step / TOTAL_STEPS,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [step]);

  // Step 8: spinner → checkmark → button
  useEffect(() => {
    if (step !== 12) return;
    setShowReady(false);
    buttonOpacity.setValue(0);
    spinnerOpacity.setValue(1);
    checkmarkScale.setValue(0);
    spinValue.setValue(0);

    // Infinite spin loop — stopped by timer
    const spinLoop = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    );
    spinLoop.start();

    // After 2.5s stop spinner and show checkmark
    const timer = setTimeout(() => {
      spinLoop.stop();
      Animated.parallel([
        Animated.timing(spinnerOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(100),
          Animated.spring(checkmarkScale, {
            toValue: 1,
            tension: 120,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => setShowReady(true));
    }, 2500);

    return () => {
      clearTimeout(timer);
      spinLoop.stop();
    };
  }, [step]);

  // Fade in button when showReady becomes true
  useEffect(() => {
    if (showReady) {
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [showReady]);

  // Cross-fade content on step change
  const goNext = () => {
    if (step < TOTAL_STEPS) {
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setStep(s => s + 1);
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      router.replace('/paywall');
    }
  };

  // Gate condition: can user advance from current step?
  const canProceed: boolean = (() => {
    if (step === 4) return data.targetLanguage !== null;
    if (step === 6) return data.level !== null;
    if (step === 7) return data.previousApp !== null;
    if (step === 9) return data.interests.length > 0;
    if (step === 12) return showReady;
    return true;
  })();

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const languageName = data.targetLanguage ? t(data.targetLanguage.nameKey) : '';
  const languageFlag = data.targetLanguage?.flag ?? '';
  const appName = data.previousApp ?? 'Other';

  // Card dimensions for 2-column grid (used in step 5)
  const cardWidth = (width - 48 - 12) / 2; // px-6 (24*2) + gap (12)

  // Filtered languages for step 2 search
  const filteredLanguages = LANGUAGES.filter(lang =>
    t(lang.nameKey).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Step content renderers ─────────────────────────────────────────────────

  const renderStep1 = () => (
    <View className="gap-8">
      <View className="gap-4">
        <Image
          source={require('@/assets/logo.png')}
          style={{ width: 48, height: 48, borderRadius: 12 }}
          resizeMode="contain"
        />
        <View className="gap-2">
          <Text className="text-foreground text-3xl font-bold">
            {t('ONBOARDING_1_TITLE')}
          </Text>
          <Text className="text-muted text-base leading-6">
            {t('ONBOARDING_1_DESCRIPTION')}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-foreground text-2xl font-bold">
          {t('ONBOARDING_2_TITLE')}
        </Text>
        <Text className="text-muted text-sm leading-5">
          {t('ONBOARDING_2_DESCRIPTION')}
        </Text>
      </View>

      {/* Search input */}
      <TextField>
        <Input
          className="border-border focus:border-border"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('ONBOARDING_2_SEARCH_PLACEHOLDER')}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </TextField>

      {/* Single-column language list */}
      <View className="gap-2">
        {filteredLanguages.map(lang => {
          const selected = data.targetLanguage?.code === lang.code;
          return (
            <Pressable
              key={lang.code}
              onPress={() => setData(d => ({ ...d, targetLanguage: lang }))}
              style={{
                borderWidth: 2,
                borderRadius: 12,
                padding: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                borderColor: selected ? accentColor : borderColor,
                backgroundColor: selected ? accentColor + '20' : 'transparent',
              }}
            >
              <Text style={{ fontSize: 26 }}>{lang.flag}</Text>
              <Text
                style={{
                  color: foregroundColor,
                  fontWeight: selected ? '700' : '500',
                  fontSize: 16,
                  flex: 1,
                }}
              >
                {t(lang.nameKey)}
              </Text>
              {selected && (
                <Ionicons name="checkmark-circle" size={22} color={accentColor} />
              )}
            </Pressable>
          );
        })}
        {filteredLanguages.length === 0 && (
          <Text className="text-muted text-center py-8">
            {t('ONBOARDING_2_NO_RESULTS')}
          </Text>
        )}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-foreground text-2xl font-bold">
          {t('ONBOARDING_3_TITLE')}
        </Text>
        <Text className="text-muted text-sm leading-5">
          {t('ONBOARDING_3_DESCRIPTION', { language: languageName })}
        </Text>
      </View>
      <View className="items-center gap-2 py-6">
        <Text style={{ fontSize: 72 }}>{languageFlag}</Text>
        <AvatarStack count="100,000+" />
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-foreground text-2xl font-bold">
          {t('ONBOARDING_4_TITLE', { language: languageName })}
        </Text>
        <Text className="text-muted text-sm leading-5">
          {t('ONBOARDING_4_DESCRIPTION')}
        </Text>
      </View>

      <View className="gap-3">
        {LEVELS.map(lvl => {
          const selected = data.level === lvl.id;
          return (
            <Pressable
              key={lvl.id}
              onPress={() => setData(d => ({ ...d, level: lvl.id }))}
              style={{
                borderWidth: 2,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: selected ? accentColor : borderColor,
                backgroundColor: selected ? accentColor + '20' : 'transparent',
              }}
            >
              <Text
                style={{
                  color: foregroundColor,
                  fontWeight: selected ? '700' : '500',
                  fontSize: 15,
                  flex: 1,
                }}
              >
                {t(lvl.labelKey)}
              </Text>
              {selected && (
                <Ionicons name="checkmark-circle" size={22} color={accentColor} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-foreground text-2xl font-bold">
          {t('ONBOARDING_5_TITLE')}
        </Text>
        <Text className="text-muted text-sm leading-5">
          {t('ONBOARDING_5_DESCRIPTION')}
        </Text>
      </View>

      {/* 2-column app grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {PREVIOUS_APPS.map(app => {
          const selected = data.previousApp === app;
          return (
            <Pressable
              key={app}
              onPress={() => setData(d => ({ ...d, previousApp: app }))}
              style={{
                width: cardWidth,
                borderWidth: 2,
                borderRadius: 12,
                padding: 14,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 52,
                borderColor: selected ? accentColor : borderColor,
                backgroundColor: selected ? accentColor + '20' : 'transparent',
              }}
            >
              <Text
                style={{
                  color: foregroundColor,
                  fontWeight: selected ? '700' : '500',
                  fontSize: 14,
                }}
              >
                {app}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderStep6 = () => (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="text-foreground text-2xl font-bold">
          {t('ONBOARDING_INTERESTS_TITLE')}
        </Text>
        <Text className="text-muted text-sm leading-5">
          {t('ONBOARDING_INTERESTS_DESCRIPTION', { language: languageName })}
        </Text>
      </View>

      {/* Interest chips */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {INTERESTS.map(interest => {
          const selected = data.interests.includes(interest.id);
          return (
            <Pressable
              key={interest.id}
              onPress={() =>
                setData(d => ({
                  ...d,
                  interests: d.interests.includes(interest.id)
                    ? d.interests.filter(i => i !== interest.id)
                    : [...d.interests, interest.id],
                }))
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 24,
                borderWidth: 2,
                borderColor: selected ? accentColor : borderColor,
                backgroundColor: selected ? accentColor + '20' : 'transparent',
              }}
            >
              <Text style={{ fontSize: 18 }}>{interest.emoji}</Text>
              <Text
                style={{
                  color: foregroundColor,
                  fontWeight: selected ? '700' : '500',
                  fontSize: 14,
                }}
              >
                {t(interest.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderStep7 = () => {
    const selectedInterests = INTERESTS.filter(i => data.interests.includes(i.id));
    return (
      <View className="gap-8">
        <View className="gap-2">
          <Text className="text-foreground text-2xl font-bold">
            {t('ONBOARDING_INTEREST_MATCH_TITLE')}
          </Text>
          <Text className="text-muted text-sm leading-5">
            {t('ONBOARDING_INTEREST_MATCH_DESCRIPTION', { language: languageName })}
          </Text>
        </View>

        {/* Selected interests recap */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {selectedInterests.map(interest => (
            <View
              key={interest.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: accentColor + '22',
                borderWidth: 1.5,
                borderColor: accentColor,
              }}
            >
              <Text style={{ fontSize: 16 }}>{interest.emoji}</Text>
              <Text style={{ color: foregroundColor, fontWeight: '600', fontSize: 13 }}>
                {t(interest.labelKey)}
              </Text>
            </View>
          ))}
        </View>

        {/* Same layout as step 3 (users count): avatars + stat text, no card */}
        <View className="items-center gap-2 py-6">
          <AvatarStack count="50,000+" />
          <Text style={{ fontSize: 15, color: foregroundColor, fontWeight: '600', textAlign: 'center', marginTop: 4 }}>
            {t('ONBOARDING_INTEREST_MATCH_STAT', { language: languageName })}
          </Text>
        </View>
      </View>
    );
  };

  const renderStep8 = () => {
    const featureKeys = APP_COMPARE_FEATURES[appName as PreviousApp] ?? APP_COMPARE_FEATURES['Other'];
    const features = featureKeys.map(key => t(key));
    return (
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-foreground text-2xl font-bold">
            {t('ONBOARDING_6_TITLE', { appName })}
          </Text>
          <Text className="text-muted text-sm leading-5">
            {t('ONBOARDING_6_DESCRIPTION', { language: languageName })}
          </Text>
        </View>

        {/* Comparison card */}
        <View style={{ borderRadius: 16, borderWidth: 1, borderColor: borderColor, overflow: 'hidden' }}>

          {/* Header row */}
          <View style={{ flexDirection: 'row', backgroundColor: accentColor + '18', paddingVertical: 14, paddingHorizontal: 16 }}>
            <View style={{ flex: 1 }} />
            <View style={{ width: 76, alignItems: 'center' }}>
              <Text style={{ color: '#9ca3af', fontSize: 13, fontWeight: '600' }} numberOfLines={1}>
                {appName}
              </Text>
            </View>
            <View style={{ width: 76, alignItems: 'center' }}>
              <Text style={{ color: foregroundColor, fontSize: 13, fontWeight: '800' }}>Decky</Text>
            </View>
          </View>

          {/* Feature rows */}
          {features.map((feature, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 13,
                paddingHorizontal: 16,
                borderTopWidth: 1,
                borderTopColor: borderColor,
              }}
            >
              <Text style={{ flex: 1, color: foregroundColor, fontSize: 14, fontWeight: '500', paddingRight: 8 }}>
                {feature}
              </Text>
              <View style={{ width: 76, alignItems: 'center' }}>
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="close" size={14} color="#9ca3af" />
                </View>
              </View>
              <View style={{ width: 76, alignItems: 'center' }}>
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: accentColor, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="checkmark" size={14} color="#0f1a00" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderStep9 = () => (
    <View style={{ flex: 1, gap: 24 }}>
      <View className="gap-2">
        <Text className="text-foreground text-2xl font-bold">
          {t('ONBOARDING_7_TITLE')}
        </Text>
        <Text className="text-muted text-sm leading-5">
          {t('ONBOARDING_7_DESCRIPTION')}
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ProgressChart appName={appName} language={languageName} />
      </View>
    </View>
  );

  const renderStep10 = () => {
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View className="gap-6">
        <View className="gap-2">
          <Text className="text-foreground text-2xl font-bold">
            {t('ONBOARDING_8_TITLE')}
          </Text>
          <Text className="text-muted text-sm leading-5">
            {t('ONBOARDING_8_DESCRIPTION')}
          </Text>
        </View>

        {/* Spinner → Checkmark */}
        <View style={{ alignItems: 'center', paddingVertical: 28 }}>
          <View style={{ width: 96, height: 96, alignItems: 'center', justifyContent: 'center' }}>
            {/* Track ring */}
            <View
              style={{
                position: 'absolute',
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 5,
                borderColor: borderColor,
              }}
            />
            {/* Spinning arc */}
            <Animated.View
              style={{
                position: 'absolute',
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 5,
                borderColor: accentColor,
                borderTopColor: 'transparent',
                borderLeftColor: 'transparent',
                opacity: spinnerOpacity,
                transform: [{ rotate: spin }],
              }}
            />
            {/* Checkmark circle (springs in when done) */}
            <Animated.View
              style={{
                position: 'absolute',
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: accentColor,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale: checkmarkScale }],
              }}
            >
              <Ionicons name="checkmark" size={48} color="#0f1a00" />
            </Animated.View>
          </View>
        </View>

        <View className="gap-1">
          <CustomizingItem label={t('ONBOARDING_8_ITEM_1')} delay={300} />
          <CustomizingItem label={t('ONBOARDING_8_ITEM_2')} delay={700} />
          <CustomizingItem label={t('ONBOARDING_8_ITEM_3')} delay={1100} />
          <CustomizingItem label={t('ONBOARDING_8_ITEM_4')} delay={1700} />
        </View>
      </View>
    );
  };

  const renderNameInput = () => (
    <View style={{ flex: 1, justifyContent: 'center', gap: 24 }}>
      <View className="gap-4 items-center">
        <Text style={{ fontSize: 56 }}>👋</Text>
        <View className="gap-2 items-center">
          <Text className="text-foreground text-3xl font-bold text-center">
            {t('ONBOARDING_NAME_TITLE')}
          </Text>
          <Text className="text-muted text-base leading-6 text-center">
            {t('ONBOARDING_NAME_DESCRIPTION')}
          </Text>
        </View>
      </View>
      <TextField>
        <Input
          className="border-border focus:border-border"
          value={data.name}
          onChangeText={name => setData(d => ({ ...d, name }))}
          placeholder={t('ONBOARDING_NAME_PLACEHOLDER')}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="done"
        />
      </TextField>
    </View>
  );

  const renderNameWelcome = () => {
    const greeting = data.name.trim()
      ? t('ONBOARDING_WELCOME_GREETING', { name: data.name.trim() })
      : t('ONBOARDING_WELCOME_GREETING_ANONYMOUS');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24, paddingTop: 40 }}>
        <Text style={{ fontSize: 80 }}>🎉</Text>
        <View className="gap-4 items-center">
          <Text className="text-foreground text-3xl font-bold text-center">
            {greeting}
          </Text>
          <Text className="text-muted text-lg leading-7 text-center">
            {t('ONBOARDING_WELCOME_SUBTITLE')}
          </Text>
        </View>
      </View>
    );
  };

  const stepRenderers: Record<number, () => React.JSX.Element> = {
    1: renderNameInput,
    2: renderNameWelcome,      // transition
    3: renderStep1,
    4: renderStep2,
    5: renderStep3,            // transition
    6: renderStep4,
    7: renderStep5,
    8: renderStep8,            // comparison — right after app selection
    9: renderStep6,
    10: renderStep7,           // transition
    11: renderStep9,           // transition
    12: renderStep10,
  };

  const buttonLabel = step === 12 ? t('ONBOARDING_GET_STARTED') : t('ONBOARDING_NEXT');

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <PageProvider>

      {/* Confetti overlay — only mounted when celebrating */}
      {(step === 12 && showReady) && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: -16,
            right: -16,
            bottom: 0,
            zIndex: 50,
          }}
        >
          {confettiConfigs.map(config => (
            <ConfettiPiece key={config.id} config={config} active={true} />
          ))}
        </View>
      )}

      {/* Progress bar */}
      <View className="pt-2 pb-4">
        <View className="h-2 bg-border rounded-full overflow-hidden">
          <Animated.View
            style={{
              height: 8,
              borderRadius: 2,
              backgroundColor: accentColor,
              width: progressWidth,
            }}
          />
        </View>
      </View>

      {/* Scrollable step content */}
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: contentOpacity, paddingBottom: 16, flex: 1 }}>
          {stepRenderers[step]?.()}
        </Animated.View>
      </KeyboardAwareScrollView>

      {/* Next button — pinned to bottom */}
      <View className="pt-4 pb-2">
        {step === 12 ? (
          <Animated.View style={{ opacity: buttonOpacity }}>
            <Button
              className="bg-accent w-full"
              onPress={goNext}
              isDisabled={!canProceed}
            >
              <Button.Label style={{ fontWeight: 'bold' }} className="text-accent-foreground font-bold">
                {buttonLabel}
              </Button.Label>
            </Button>
          </Animated.View>
        ) : (
          <Button
            className="bg-accent w-full"
            onPress={goNext}
            isDisabled={!canProceed}
          >
            <Button.Label style={{ fontWeight: 'bold' }} className="text-accent-foreground font-bold">
              {buttonLabel}
            </Button.Label>
          </Button>
        )}
      </View>

    </PageProvider>
  );
}
