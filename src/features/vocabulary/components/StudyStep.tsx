import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from 'heroui-native';
import * as Haptics from 'expo-haptics';
import { FlipHorizontal } from 'lucide-react-native';
import { useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import type { Card, CardResult } from '../types';
import { StudyAnimationProvider, useStudyAnimation } from '../lib/study-animation-context';
import { CardAnimationProvider, useCardAnimation } from '../lib/card-animation-provider';
import { useFooterStudyAnimation } from '../lib/use-footer-study-animation';
import CardStackContainer from './CardStackContainer';
import { FlashCard, FLIP_BUTTON_LEMON } from './FlashCard';

const EASING = Easing.out(Easing.ease);

type StudyStepProps = {
  cards: Card[];
  onCardResult: (index: number, result: CardResult) => void;
  onBackToDecks: () => void;
};

type StudyContentProps = StudyStepProps & {
  flipped: boolean;
  setFlipped: (fn: (prev: boolean) => boolean) => void;
};

function StudyContent({
  cards,
  onCardResult,
  onBackToDecks,
  flipped,
  setFlipped,
}: StudyContentProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = cards.length;
  const handleFlipPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFlipped((prev) => !prev);
  }, [setFlipped]);

  useFooterStudyAnimation({
    onCardResult,
  });

  const { currentStudyIndex, isDone, isKnowPressed, isDontKnowPressed } = useStudyAnimation();
  const { gesture } = useCardAnimation();

  useAnimatedReaction(
    () => currentStudyIndex.get(),
    (cur, prev) => {
      runOnJS(setCurrentIndex)(cur);
      if (prev !== null && cur !== prev) {
        runOnJS(setFlipped)(() => false);
      }
    }
  );

  const doneStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDone.get() ? 1 : 0, { easing: EASING }),
    pointerEvents: isDone.get() ? 'auto' : 'none',
    transform: [{ scale: withTiming(isDone.get() ? 1 : 0.5, { easing: EASING }) }],
  }));

  if (total === 0) {
    return (
      <View style={styles.centered}>
        <Text className="text-muted">{t('VOCAB_SELECT_DECK_DESCRIPTION')}</Text>
        <Button onPress={onBackToDecks} className="mt-4">
          <Button.Label>{t('FLASHCARD_BACK_TO_DECKS')}</Button.Label>
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <View style={styles.header}>
        <Text className="text-foreground font-bold text-lg">{t('VOCAB_STUDY_TITLE')}</Text>
        <Text className="text-muted text-sm">
          {currentIndex + 1} / {total}
        </Text>
      </View>
      <Text style={styles.studyHint} numberOfLines={1}>
        {t('VOCAB_STUDY_HINT')}
      </Text>

      <View style={styles.stackWrapper}>
        <View style={styles.stack}>
          {cards.map((card, index) => (
            <CardStackContainer
              key={card.id}
              index={index}
              gesture={index === currentIndex ? gesture : undefined}
            >
              {index === currentIndex ? (
                <FlashCard
                  card={card}
                  showBack={flipped}
                  onFlipPress={handleFlipPress}
                />
              ) : (
                <View style={styles.placeholder} />
              )}
            </CardStackContainer>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [styles.footerBtn, styles.dontKnowBtn, pressed && styles.pressed]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            isDontKnowPressed.set(true);
          }}
        >
          <Text className="font-semibold text-base">{t('VOCAB_DONT_KNOW')}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.footerBtn, styles.knowBtn, pressed && styles.pressed]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            isKnowPressed.set(true);
          }}
        >
          <Text className="font-semibold text-base text-foreground">{t('VOCAB_KNOW')}</Text>
        </Pressable>
      </View>

      <View style={styles.footerFlipRow}>
        <Pressable
          style={({ pressed }) => [
            styles.flipIconButton,
            pressed && styles.flipIconButtonPressed,
          ]}
          onPress={handleFlipPress}
          accessibilityLabel={flipped ? t('VOCAB_TAP_TO_FLIP_BACK') : t('VOCAB_TAP_TO_FLIP')}
        >
          <FlipHorizontal size={24} color="#1a1a1a" strokeWidth={2.5} />
        </Pressable>
      </View>

      <Animated.View style={[StyleSheet.absoluteFill, doneStyle, styles.doneOverlay]}>
        <View style={styles.doneContent}>
          <Text style={styles.doneEmoji}>🎉</Text>
          <Text className="text-foreground text-2xl font-bold text-center">
            {t('FLASHCARD_DONE')}
          </Text>
          <Text className="text-muted text-center mt-2">
            {t('FLASHCARD_DONE_DESCRIPTION')}
          </Text>
          <Button
            className='mt-6'
            onPress={onBackToDecks}
          >
            <Button.Label className="font-bold text-accent-foreground">
              {t('FLASHCARD_BACK_TO_DECKS')}
            </Button.Label>
          </Button>
        </View>
      </Animated.View>
    </View>
  );
}

export function StudyStep(props: StudyStepProps) {
  const { cards } = props;
  const total = cards.length;
  const [flipped, setFlipped] = useState(false);

  return (
    <StudyAnimationProvider total={total}>
      <CardAnimationProvider onCardResult={props.onCardResult}>
        <StudyContent
          {...props}
          flipped={flipped}
          setFlipped={setFlipped}
        />
      </CardAnimationProvider>
    </StudyAnimationProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  studyHint: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  stackWrapper: {
    flex: 1,
    position: 'relative',
  },
  stack: {
    flex: 1,
    position: 'relative',
  },
  footerFlipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 60,
  },
  flipIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: FLIP_BUTTON_LEMON,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipIconButtonPressed: {
    opacity: 0.9,
  },
  placeholder: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dontKnowBtn: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  knowBtn: {
    backgroundColor: '#d9fd0c',
  },
  pressed: { opacity: 0.9 },
  doneOverlay: {
    backgroundColor: '#fbfcfa',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  doneContent: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  doneBackButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  doneEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});
