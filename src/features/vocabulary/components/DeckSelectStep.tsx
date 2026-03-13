import { Text, View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { Deck } from '../types';
import { VOCAB_DECKS } from '../constants';

type DeckSelectStepProps = {
  onSelectDeck: (deck: Deck) => void;
};

export function DeckSelectStep({ onSelectDeck }: DeckSelectStepProps) {
  const { t } = useTranslation();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-foreground text-xl font-bold mb-1">
        {t('VOCAB_SELECT_DECK')}
      </Text>
      <Text className="text-muted text-sm mb-6">
        {t('VOCAB_SELECT_DECK_DESCRIPTION')}
      </Text>
      <View style={styles.deckList}>
        {VOCAB_DECKS.map((deck) => (
          <Pressable
            key={deck.id}
            onPress={() => onSelectDeck(deck)}
            style={({ pressed }) => [
              styles.deckCard,
              pressed && styles.deckCardPressed,
            ]}
          >
            <View style={styles.flagBox}>
              <Text style={styles.flagText}>{deck.flag}</Text>
            </View>
            <View style={styles.deckInfo}>
              <Text
                className="text-foreground font-semibold"
                style={styles.deckName}
                numberOfLines={1}
              >
                {t(deck.langKey as Parameters<typeof t>[0])}
              </Text>
              <Text className="text-muted" style={styles.wordCount}>
                {t('HOME_DECK_WORDS', { count: deck.wordCount })}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  deckList: { gap: 12 },
  deckCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.09)',
    gap: 12,
  },
  deckCardPressed: { opacity: 0.9 },
  flagBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagText: { fontSize: 22 },
  deckInfo: { flex: 1, gap: 3 },
  deckName: { fontSize: 15 },
  wordCount: { fontSize: 12 },
});
