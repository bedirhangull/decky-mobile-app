import type { Card, Deck, LanguageOption } from './types';

export const VOCAB_DECKS: Deck[] = [
  { id: '1', langKey: 'LANG_ES', flag: '🇪🇸', wordCount: 142 },
  { id: '2', langKey: 'LANG_EN', flag: '🇬🇧', wordCount: 89 },
  { id: '3', langKey: 'LANG_FR', flag: '🇫🇷', wordCount: 34 },
  { id: '4', langKey: 'LANG_DE', flag: '🇩🇪', wordCount: 56 },
  { id: '5', langKey: 'LANG_TR', flag: '🇹🇷', wordCount: 78 },
];

export const VOCAB_LANGUAGES: LanguageOption[] = [
  { code: 'en', nameKey: 'LANG_EN', flag: '🇺🇸' },
  { code: 'es', nameKey: 'LANG_ES', flag: '🇪🇸' },
  { code: 'fr', nameKey: 'LANG_FR', flag: '🇫🇷' },
  { code: 'de', nameKey: 'LANG_DE', flag: '🇩🇪' },
  { code: 'tr', nameKey: 'LANG_TR', flag: '🇹🇷' },
  { code: 'ja', nameKey: 'LANG_JA', flag: '🇯🇵' },
  { code: 'it', nameKey: 'LANG_IT', flag: '🇮🇹' },
  { code: 'pt', nameKey: 'LANG_PT', flag: '🇧🇷' },
];

// Mock cards per deck (id). In real app, fetch by deckId.
const MOCK_CARDS_BY_DECK: Record<string, Card[]> = {
  '1': [
    { id: '1-1', frontText: 'hola', backText: 'hello' },
    { id: '1-2', frontText: 'gracias', backText: 'thank you' },
    { id: '1-3', frontText: 'agua', backText: 'water' },
    { id: '1-4', frontText: 'buenos días', backText: 'good morning' },
    { id: '1-5', frontText: 'adiós', backText: 'goodbye' },
  ],
  '2': [
    { id: '2-1', frontText: 'hello', backText: 'merhaba' },
    { id: '2-2', frontText: 'thank you', backText: 'teşekkürler' },
    { id: '2-3', frontText: 'water', backText: 'su' },
    { id: '2-4', frontText: 'good morning', backText: 'günaydın' },
    { id: '2-5', frontText: 'goodbye', backText: 'hoşça kal' },
  ],
  '3': [
    { id: '3-1', frontText: 'bonjour', backText: 'hello' },
    { id: '3-2', frontText: 'merci', backText: 'thank you' },
    { id: '3-3', frontText: 'eau', backText: 'water' },
    { id: '3-4', frontText: 'au revoir', backText: 'goodbye' },
  ],
  '4': [
    { id: '4-1', frontText: 'Hallo', backText: 'hello' },
    { id: '4-2', frontText: 'Danke', backText: 'thank you' },
    { id: '4-3', frontText: 'Wasser', backText: 'water' },
  ],
  '5': [
    { id: '5-1', frontText: 'merhaba', backText: 'hello' },
    { id: '5-2', frontText: 'teşekkürler', backText: 'thank you' },
    { id: '5-3', frontText: 'su', backText: 'water' },
    { id: '5-4', frontText: 'günaydın', backText: 'good morning' },
  ],
};

export function getCardsForDeck(deckId: string): Card[] {
  return MOCK_CARDS_BY_DECK[deckId] ?? MOCK_CARDS_BY_DECK['1'];
}
