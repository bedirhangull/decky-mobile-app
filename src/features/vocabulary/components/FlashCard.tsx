import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import type { Card } from '../types';

const FLIP_DURATION = 280;

const LEMON = '#d9fd0c';

type FlashCardProps = {
  card: Card;
  showBack?: boolean;
  onFlipPress?: () => void;
};

export function FlashCard({ card, showBack: controlledShowBack, onFlipPress }: FlashCardProps) {
  const { t } = useTranslation();
  const [internalShowBack, setInternalShowBack] = useState(false);
  const isControlled = controlledShowBack !== undefined && onFlipPress !== undefined;
  const showBack = isControlled ? controlledShowBack : internalShowBack;

  const flipProgress = useSharedValue(showBack ? 1 : 0);

  useEffect(() => {
    flipProgress.set(withTiming(showBack ? 1 : 0, { duration: FLIP_DURATION }));
  }, [showBack, flipProgress]);

  const frontFaceStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    opacity: interpolate(flipProgress.value, [0, 0.5], [1, 0]),
    transform: [
      { scale: interpolate(flipProgress.value, [0, 0.5], [1, 0.96]) },
    ],
  }));

  const backFaceStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    opacity: interpolate(flipProgress.value, [0.5, 1], [0, 1]),
    transform: [
      { scale: interpolate(flipProgress.value, [0.5, 1], [0.96, 1]) },
    ],
  }));

  const handleToggle = () => {
    if (isControlled) {
      onFlipPress?.();
    } else {
      setInternalShowBack((prev) => !prev);
    }
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <View style={styles.cardInner}>
        <View style={styles.faceContainer}>
          <Animated.View style={[styles.face, frontFaceStyle]}>
            <Text style={[styles.word, styles.wordText]} numberOfLines={3}>
              {card.frontText}
            </Text>
          </Animated.View>
          <Animated.View style={[styles.face, backFaceStyle]}>
            <Text style={[styles.word, styles.wordText]} numberOfLines={3}>
              {card.backText}
            </Text>
          </Animated.View>
        </View>
      </View>
      <Pressable
        onPress={handleToggle}
        style={({ pressed }) => [styles.toggleHint, pressed && styles.toggleHintPressed]}
      >
        <Text style={styles.toggleHintText}>
          {showBack ? t('VOCAB_TAP_TO_FLIP_BACK') : t('VOCAB_TAP_TO_FLIP')}
        </Text>
      </Pressable>
    </View>
  );
}

export const FLIP_BUTTON_LEMON = LEMON;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInner: {
    width: '100%',
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceContainer: {
    width: '100%',
    minHeight: 180,
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  face: {
    width: '100%',
    minHeight: 180,
  },
  word: {
    paddingHorizontal: 20,
  },
  wordText: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1a1a1a',
  },
  toggleHint: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  toggleHintPressed: {
    opacity: 0.7,
  },
  toggleHintText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});
