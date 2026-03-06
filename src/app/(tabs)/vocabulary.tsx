import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VocabularyTab() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fbfcfa' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <Text style={{ fontSize: 48 }}>📚</Text>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#0f1a00' }}>Vocabulary</Text>
      </View>
    </SafeAreaView>
  );
}
