export type VocabularyStep = 1 | 2 | 3;

export type Deck = {
  id: string;
  langKey: string;
  flag: string;
  wordCount: number;
};

export type Card = {
  id: string;
  frontText: string;
  backText: string;
};

export type StudyConfig = {
  deckId: string;
  frontLangCode: string;
  backLangCode: string;
};

export type CardResult = 'know' | 'dont_know';

export type LanguageOption = {
  code: string;
  nameKey: string;
  flag: string;
};
