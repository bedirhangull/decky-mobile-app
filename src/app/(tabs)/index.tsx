import { useRef, useCallback } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

// ── Layout constants ───────────────────────────────────────────────────────────
const SCREEN_WIDTH = Dimensions.get('window').width;
const H_PADDING = 16;       // matches PageProvider px-4
const PODCAST_GAP = 10;
// 2 full cards + 0.2 peek on the right side
const PODCAST_ITEM_WIDTH = (SCREEN_WIDTH - H_PADDING * 2 - PODCAST_GAP) / 2.2;
const PODCAST_ITEM_HEIGHT = Math.round(PODCAST_ITEM_WIDTH * 1.35); // portrait ratio

// ── Types ──────────────────────────────────────────────────────────────────────
type Deck = {
  id: string;
  langKey: string;
  flag: string;
  wordCount: number;
};

type Podcast = {
  id: string;
  title: string;
  topic: string;
  duration: string;
};

// ── Mock Data ──────────────────────────────────────────────────────────────────
const DECKS: Deck[] = [
  { id: '1', langKey: 'LANG_ES', flag: '🇪🇸', wordCount: 142 },
  { id: '2', langKey: 'LANG_EN', flag: '🇬🇧', wordCount: 89  },
  { id: '3', langKey: 'LANG_FR', flag: '🇫🇷', wordCount: 34  },
];

const PODCASTS: Podcast[] = [
  { id: '1', title: 'Tech Talk',     topic: '💻', duration: '18 min' },
  { id: '2', title: 'Daily News',    topic: '📰', duration: '12 min' },
  { id: '3', title: 'Food & Travel', topic: '🍜', duration: '24 min' },
  { id: '4', title: 'Sports Daily',  topic: '⚽', duration: '15 min' },
];

const SPOTLIGHT = {
  word: 'Eficiente',
  phonetic: '/e.fi.ˈθjen.te/',
  translation: 'Efficient',
  example: '"Es muy eficiente en su trabajo."',
  userCount: '10,000+',
  language: 'Spanish',
};

const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  squircle: { borderCurve: 'continuous' } as object,
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  hairlineDark: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.09)',
  },
  podcastCard: {
    borderRadius: 22,
    borderCurve: 'continuous',
    // white/10 border — matches opal carousel-item pattern
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  } as object,
});

// ── Sub-Components ─────────────────────────────────────────────────────────────
function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  const { t } = useTranslation();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <Text className="text-foreground" style={{ fontSize: 18, fontWeight: '700', letterSpacing: -0.2 }}>
        {title}
      </Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} hitSlop={12}>
          {/* dark olive — WCAG AA on white */}
          <Text style={{ color: '#3d4700', fontSize: 13, fontWeight: '600' }}>
            {t('HOME_SEE_ALL')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ── Deck Card ─────────────────────────────────────────────────────────────────
function DeckCard({ deck }: { deck: Deck }) {
  const { t } = useTranslation();
  return (
    <Pressable>
      <View
        style={[
          s.squircle,
          {
            width: 148,
            borderRadius: 16,
            backgroundColor: '#fff',
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(0,0,0,0.09)',
            padding: 14,
            gap: 12,
          },
        ]}
      >
        {/* Flag */}
        <View
          style={{
            width: 40, height: 40, borderRadius: 12,
            backgroundColor: 'rgba(0,0,0,0.04)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 22 }}>{deck.flag}</Text>
        </View>

        {/* Language + word count */}
        <View style={{ gap: 3 }}>
          <Text
            className="text-foreground"
            style={{ fontSize: 13, fontWeight: '700' }}
            numberOfLines={1}
          >
            {t(deck.langKey as Parameters<typeof t>[0])}
          </Text>
          <Text style={{ fontSize: 11, color: '#aaa' }}>
            {t('HOME_DECK_WORDS', { count: deck.wordCount })}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

// ── Podcast Card (opal-carousel inspired) ────────────────────────────────────
function PodcastCard({
  podcast,
  index,
  scrollX,
}: {
  podcast: Podcast;
  index: number;
  scrollX: SharedValue<number>;
}) {
  // Scale based on distance from screen center — mirrors opal CarouselItem math
  const rStyle = useAnimatedStyle(() => {
    const stride = PODCAST_ITEM_WIDTH + PODCAST_GAP;
    const itemCenterX = H_PADDING + index * stride + PODCAST_ITEM_WIDTH / 2;
    const itemOnScreen = itemCenterX - scrollX.get();
    const dist = Math.abs(itemOnScreen - SCREEN_WIDTH / 2);

    const scale = interpolate(
      dist,
      [0, PODCAST_ITEM_WIDTH, PODCAST_ITEM_WIDTH * 1.5],
      [1, 1, 0.9],
      Extrapolation.CLAMP,
    );

    return { transform: [{ scale }] };
  });

  return (
    <Animated.View style={rStyle}>
      <Pressable>
        <View
          style={[
            s.podcastCard,
            {
              width: PODCAST_ITEM_WIDTH,
              height: PODCAST_ITEM_HEIGHT,
              backgroundColor: '#111827',
            },
          ]}
        >
          {/* Topic emoji — large, fills the upper area */}
          <View style={{ flex: 1, padding: 16, justifyContent: 'flex-end' }}>
            <Text style={{ fontSize: 52 }}>{podcast.topic}</Text>
          </View>

          {/* Bottom gradient overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.88)', '#000', '#000']}
            locations={[0, 0.68, 0.86, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ paddingHorizontal: 14, paddingTop: 22, paddingBottom: 14 }}
          >
            <Text
              style={{ color: '#fff', fontSize: 15, fontWeight: '700', lineHeight: 19 }}
              numberOfLines={1}
            >
              {podcast.title}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7 }}>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '500' }}>
                {podcast.duration}
              </Text>
              {/* Play button — single accent */}
              <View
                style={{
                  width: 30, height: 30, borderRadius: 15,
                  backgroundColor: '#d9fd0c',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Ionicons name="play" size={12} color="#0f1a00" style={{ marginLeft: 1.5 }} />
              </View>
            </View>
          </LinearGradient>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function HomeTab() {
  const { t } = useTranslation();

  // Scroll ref for nudge animation
  const scrollRef = useRef<ScrollView>(null);

  // Shared scroll value drives per-card scale animation
  const podcastScrollX = useSharedValue(0);
  const podcastScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      podcastScrollX.set(e.contentOffset.x);
    },
  });

  // Nudge scroll on focus — hints the user there is more content below
  useFocusEffect(
    useCallback(() => {
      const t1 = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 120, animated: true });
      }, 400);
      const t2 = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }, 1000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fbfcfa' }}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: H_PADDING, paddingBottom: 100 }}
      >

      {/* ── Header ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 6, paddingBottom: 28 }}>
        <Image
          source={require('@/assets/logo.png')}
          style={{ width: 34, height: 34, borderRadius: 10 }}
        />
        <View className="flex-row items-center bg-foreground/5 rounded-full px-2 py-1">
          <Text className='text-lg'>⚡</Text>
          <Text>5</Text>
        </View>
      </View>

      {/* ── Section 1: My Decks ── */}
      <View style={{ marginBottom: 28 }}>
        <SectionHeader title={t('HOME_MY_DECKS')} onSeeAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -H_PADDING }}
          contentContainerStyle={{ paddingHorizontal: H_PADDING, gap: 10 }}
        >
          {DECKS.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </ScrollView>
      </View>

      {/* ── Section 2: My Podcasts ── */}
      <View style={{ marginBottom: 28 }}>
        <SectionHeader title={t('HOME_MY_PODCASTS')} onSeeAll={() => {}} />
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={podcastScrollHandler}
          scrollEventThrottle={16}
          style={{ marginHorizontal: -H_PADDING }}
          contentContainerStyle={{ paddingHorizontal: H_PADDING, gap: PODCAST_GAP }}
        >
          {PODCASTS.map((podcast, index) => (
            <PodcastCard
              key={podcast.id}
              podcast={podcast}
              index={index}
              scrollX={podcastScrollX}
            />
          ))}
        </Animated.ScrollView>
      </View>

      {/* ── Section 3: Streak ── */}
      <View style={{ marginBottom: 28 }}>
        <Card>
          <Card.Body className="p-4" style={{ gap: 14 }}>

            {/* Flame + text */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={[
                  s.squircle,
                  {
                    width: 44, height: 44, borderRadius: 12,
                    backgroundColor: 'rgba(255,69,0,0.12)',
                    alignItems: 'center', justifyContent: 'center',
                  },
                ]}
              >
                <Text style={{ fontSize: 22 }}>🔥</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text className="text-foreground" style={{ fontSize: 15, fontWeight: '700' }}>
                  1 {t('HOME_STREAK_DAYS')}
                </Text>
                <Text className="text-muted-foreground" style={{ fontSize: 12, marginTop: 2 }}>
                  {t('HOME_STREAK_KEEP')}
                </Text>
              </View>
            </View>

            {/* Weekly dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {WEEK_DAYS.map((day, i) => (
                <View key={i} style={{ alignItems: 'center' }}>
                  <View
                    style={{
                      width: 32, height: 32, borderRadius: 16,
                      backgroundColor: i === 0 ? '#d9fd0c' : '#ebebeb',
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: '700', color: i === 0 ? '#0f1a00' : '#bbb' }}>
                      {day}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

          </Card.Body>
        </Card>
      </View>

      {/* ── Section 4: Vocabulary Spotlight ── */}
      <View style={{ marginBottom: 28 }}>
        <SectionHeader title={t('HOME_VOCAB_SPOTLIGHT')} />
        <Card>
          <Card.Body className="p-4">

            {/* Word + speaker button */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text
                className="text-foreground flex-1"
                style={{ fontSize: 36, fontWeight: '800', letterSpacing: -1 }}
                numberOfLines={1}
              >
                {SPOTLIGHT.word}
              </Text>
              <Pressable
                hitSlop={10}
                style={{
                  width: 36, height: 36, borderRadius: 18,
                  backgroundColor: 'rgba(0,0,0,0.06)',
                  alignItems: 'center', justifyContent: 'center',
                  marginLeft: 8,
                }}
              >
                <Ionicons name="volume-medium-outline" size={18} color="#555" />
              </Pressable>
            </View>

            {/* Phonetic */}
            <Text className="text-muted-foreground" style={{ fontSize: 13, marginBottom: 14 }}>
              {SPOTLIGHT.phonetic}
            </Text>

            {/* Translation + example */}
            <View style={{ backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
              <Text className="text-foreground" style={{ fontSize: 15, fontWeight: '600', marginBottom: 4 }}>
                {SPOTLIGHT.translation}
              </Text>
              <Text className="text-muted-foreground" style={{ fontSize: 13, fontStyle: 'italic', lineHeight: 19 }}>
                {SPOTLIGHT.example}
              </Text>
            </View>

            {/* Social proof */}
            <View style={[s.hairlineDark, { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 12 }]}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#888' }}>
                {SPOTLIGHT.userCount}
              </Text>
              <Text className="text-muted-foreground flex-1" style={{ fontSize: 11, lineHeight: 16 }} numberOfLines={2}>
                {t('HOME_SPOTLIGHT_USERS', { language: SPOTLIGHT.language })}
              </Text>
            </View>

          </Card.Body>
        </Card>
      </View>

      </ScrollView>
    </SafeAreaView>
  );
}
