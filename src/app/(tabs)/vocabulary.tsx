import { useState, useCallback } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DeckSelectStep,
  LanguageSelectStep,
  StudyStep,
  getCardsForDeck,
} from '@/src/features/vocabulary';
import type { Deck } from '@/src/features/vocabulary';
import type { CardResult } from '@/src/features/vocabulary';

type VocabularyStep = 1 | 2 | 3;

export default function VocabularyTab() {
  const [step, setStep] = useState<VocabularyStep>(1);
  const [selectedDeck, setSelectedDeck] = useState<Deck | undefined>(undefined);
  const [frontLangCode, setFrontLangCode] = useState<string>('');
  const [backLangCode, setBackLangCode] = useState<string>('');

  const handleSelectDeck = useCallback((deck: Deck) => {
    setSelectedDeck(deck);
    setStep(2);
  }, []);

  const handleConfirmLanguages = useCallback(
    (config: { frontLangCode: string; backLangCode: string }) => {
      setFrontLangCode(config.frontLangCode);
      setBackLangCode(config.backLangCode);
      setStep(3);
    },
    []
  );

  const handleBackToDecks = useCallback(() => {
    setStep(1);
    setSelectedDeck(undefined);
    setFrontLangCode('');
    setBackLangCode('');
  }, []);

  const handleCardResult = useCallback((_index: number, _result: CardResult) => {
    // Optional: persist result (e.g. to store or API)
  }, []);

  const cards = selectedDeck ? getCardsForDeck(selectedDeck.id) : [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fbfcfa' }}>
      {step === 1 && (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <DeckSelectStep onSelectDeck={handleSelectDeck} />
        </View>
      )}
      {step === 2 && (
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <LanguageSelectStep onConfirm={handleConfirmLanguages} />
        </View>
      )}
      {step === 3 && (
        <StudyStep
          cards={cards}
          onCardResult={handleCardResult}
          onBackToDecks={handleBackToDecks}
        />
      )}
    </SafeAreaView>
  );
}
