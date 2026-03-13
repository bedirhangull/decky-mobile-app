import { useState } from 'react';
import { Text, View, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from 'heroui-native';
import type { LanguageOption } from '../types';
import { VOCAB_LANGUAGES } from '../constants';

type LanguageSelectStepProps = {
  onConfirm: (config: { frontLangCode: string; backLangCode: string }) => void;
};

export function LanguageSelectStep({ onConfirm }: LanguageSelectStepProps) {
  const { t } = useTranslation();
  const [frontLang, setFrontLang] = useState<LanguageOption | undefined>(undefined);
  const [backLang, setBackLang] = useState<LanguageOption | undefined>(undefined);

  const canStart = frontLang !== undefined && backLang !== undefined;

  const handleConfirm = () => {
    if (frontLang === undefined || backLang === undefined) return;
    onConfirm({ frontLangCode: frontLang.code, backLangCode: backLang.code });
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-foreground text-xl font-bold mb-1">
        {t('VOCAB_FRONT_LANGUAGE')}
      </Text>
      <Text className="text-muted text-sm mb-3">
        {t('VOCAB_FRONT_LANGUAGE')}
      </Text>
      <View style={styles.chipRow}>
        {VOCAB_LANGUAGES.map((lang) => (
          <Pressable
            key={lang.code}
            onPress={() => setFrontLang(lang)}
            style={[
              styles.chip,
              frontLang?.code === lang.code && styles.chipSelected,
            ]}
          >
            <Text style={styles.chipFlag}>{lang.flag}</Text>
            <Text
              className={frontLang?.code === lang.code ? 'text-foreground font-semibold' : 'text-muted'}
              style={styles.chipText}
              numberOfLines={1}
            >
              {t(lang.nameKey as Parameters<typeof t>[0])}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="text-foreground text-xl font-bold mt-8 mb-1">
        {t('VOCAB_BACK_LANGUAGE')}
      </Text>
      <Text className="text-muted text-sm mb-3">
        {t('VOCAB_BACK_LANGUAGE')}
      </Text>
      <View style={styles.chipRow}>
        {VOCAB_LANGUAGES.map((lang) => (
          <Pressable
            key={lang.code}
            onPress={() => setBackLang(lang)}
            style={[
              styles.chip,
              backLang?.code === lang.code && styles.chipSelected,
            ]}
          >
            <Text style={styles.chipFlag}>{lang.flag}</Text>
            <Text
              className={backLang?.code === lang.code ? 'text-foreground font-semibold' : 'text-muted'}
              style={styles.chipText}
              numberOfLines={1}
            >
              {t(lang.nameKey as Parameters<typeof t>[0])}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button
        className="mt-8 w-full bg-accent"
        onPress={handleConfirm}
        isDisabled={!canStart}
      >
        <Button.Label className="font-bold text-accent-foreground">
          {t('VOCAB_CONFIRM')}
        </Button.Label>
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'transparent',
  },
  chipSelected: {
    borderColor: '#d9fd0c',
    backgroundColor: 'rgba(217, 253, 12, 0.2)',
  },
  chipFlag: { fontSize: 18 },
  chipText: { fontSize: 14, maxWidth: 80 },
});
