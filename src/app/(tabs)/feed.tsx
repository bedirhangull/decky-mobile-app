import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  LayoutChangeEvent,
  ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FeedCard {
  id: string;
  word: string;
  phonetic: string;
  translation: string;
  example: string;
  language: string;
  flag: string;
  partOfSpeech: string;
  likes: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const FEED_CARDS: FeedCard[] = [
  {
    id: '1',
    word: 'Eficiente',
    phonetic: '/e.fi.ˈθjen.te/',
    translation: 'Efficient',
    example: 'Es muy eficiente en su trabajo.',
    language: 'Spanish',
    flag: '🇪🇸',
    partOfSpeech: 'adj',
    likes: 1204,
  },
  {
    id: '2',
    word: 'Wanderlust',
    phonetic: '/ˈwɒn.də.lʌst/',
    translation: 'Fernweh · longing to travel',
    example: 'Her wanderlust took her to 30 countries.',
    language: 'German',
    flag: '🇩🇪',
    partOfSpeech: 'noun',
    likes: 3456,
  },
  {
    id: '3',
    word: 'Resilient',
    phonetic: '/rɪˈzɪl.i.ənt/',
    translation: 'Dayanıklı · bouncing back',
    example: 'She proved incredibly resilient after every setback.',
    language: 'English',
    flag: '🇺🇸',
    partOfSpeech: 'adj',
    likes: 892,
  },
  {
    id: '4',
    word: 'Sérendipité',
    phonetic: '/se.ʁɑ̃.di.pi.te/',
    translation: 'Serendipity · happy accident',
    example: 'Leur rencontre était une pure sérendipité.',
    language: 'French',
    flag: '🇫🇷',
    partOfSpeech: 'nom',
    likes: 2187,
  },
  {
    id: '5',
    word: 'Yakiniku',
    phonetic: '/ja.kiˈni.ku/',
    translation: 'Grilled meat · BBQ',
    example: '今夜は焼肉を食べに行こう。',
    language: 'Japanese',
    flag: '🇯🇵',
    partOfSpeech: 'noun',
    likes: 4821,
  },
  {
    id: '6',
    word: 'Dolce far niente',
    phonetic: '/ˈdol.tʃe far ˈnjen.te/',
    translation: 'The sweetness of doing nothing',
    example: 'In summer I embrace the dolce far niente.',
    language: 'Italian',
    flag: '🇮🇹',
    partOfSpeech: 'idiom',
    likes: 6234,
  },
];

// ---------------------------------------------------------------------------
// VocabCard
// ---------------------------------------------------------------------------

interface VocabCardProps {
  card: FeedCard;
  height: number;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
}

function VocabCard({
  card,
  height,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
}: VocabCardProps) {
  const { t } = useTranslation();

  const likeCount = isLiked ? card.likes + 1 : card.likes;

  return (
    <View style={{ width: '100%', height, backgroundColor: '#ffffff' }}>

      {/* Language / part-of-speech badge — top left */}
      <View
        style={{
          position: 'absolute',
          top: 52,
          left: 16,
          backgroundColor: 'rgba(0,0,0,0.07)',
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 6,
          zIndex: 10,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#0d0d0d', fontSize: 13, fontWeight: '600' }}>
          {card.flag} {card.language}
        </Text>
        <View
          style={{
            width: 1,
            height: 12,
            backgroundColor: 'rgba(0,0,0,0.18)',
            marginHorizontal: 8,
          }}
        />
        <Text style={{ color: 'rgba(0,0,0,0.45)', fontSize: 12 }}>
          {card.partOfSpeech}
        </Text>
      </View>

      {/* Large centered word */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
        }}
      >
        <Text
          adjustsFontSizeToFit
          numberOfLines={2}
          style={{
            fontSize: 64,
            fontWeight: '800',
            color: '#0d0d0d',
            textAlign: 'center',
            lineHeight: 72,
          }}
        >
          {card.word}
        </Text>
      </View>

      {/* Bottom-left: translation + example */}
      <View
        style={{
          position: 'absolute',
          bottom: 40,
          left: 20,
          right: 88,
        }}
      >
        <Text
          style={{
            color: '#3d4700',
            fontSize: 22,
            fontWeight: '700',
            marginBottom: 6,
            lineHeight: 28,
          }}
        >
          {card.translation}
        </Text>
        <Text
          style={{
            color: 'rgba(0,0,0,0.45)',
            fontSize: 14,
            fontStyle: 'italic',
            lineHeight: 20,
          }}
        >
          {card.example}
        </Text>
      </View>

      {/* Right side — action buttons, shifted to lower half (TikTok / Reels style) */}
      <View
        style={{
          position: 'absolute',
          right: 16,
          bottom: 130,
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Like */}
        <View style={{ alignItems: 'center', gap: 5 }}>
          <Pressable
            onPress={() => onToggleLike(card.id)}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: isLiked ? '#d9fd0c' : 'rgba(0,0,0,0.07)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={22}
              color={isLiked ? '#0f1a00' : '#0d0d0d'}
            />
          </Pressable>
          <Text style={{ color: 'rgba(0,0,0,0.45)', fontSize: 11, fontWeight: '600' }}>
            {likeCount >= 1000
              ? `${(likeCount / 1000).toFixed(1)}k`
              : String(likeCount)}
          </Text>
        </View>

        {/* Save */}
        <View style={{ alignItems: 'center', gap: 5 }}>
          <Pressable
            onPress={() => onToggleSave(card.id)}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: isSaved ? '#d9fd0c' : 'rgba(0,0,0,0.07)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={isSaved ? '#0f1a00' : '#0d0d0d'}
            />
          </Pressable>
          <Text style={{ color: 'rgba(0,0,0,0.45)', fontSize: 11, fontWeight: '600' }}>
            {t('FEED_SAVE')}
          </Text>
        </View>
      </View>

    </View>
  );
}

// ---------------------------------------------------------------------------
// FeedTab — main screen
// ---------------------------------------------------------------------------

export default function FeedTab() {
  const [itemHeight, setItemHeight] = useState(0);
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set());
  const [savedCards, setSavedCards] = useState<Set<string>>(new Set());

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout;
    if (height > 0) {
      setItemHeight(height);
    }
  }, []);

  const handleToggleLike = useCallback((id: string) => {
    setLikedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleToggleSave = useCallback((id: string) => {
    setSavedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<FeedCard>) => (
      <VocabCard
        card={item}
        height={itemHeight}
        isLiked={likedCards.has(item.id)}
        isSaved={savedCards.has(item.id)}
        onToggleLike={handleToggleLike}
        onToggleSave={handleToggleSave}
      />
    ),
    [itemHeight, likedCards, savedCards, handleToggleLike, handleToggleSave],
  );

  const keyExtractor = useCallback((item: FeedCard) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<FeedCard> | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      onLayout={handleLayout}
    >
      {itemHeight > 0 && (
        <FlatList
          data={FEED_CARDS}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          pagingEnabled
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        />
      )}
    </View>
  );
}
