import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet, Button } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { PageProvider } from '@/src/components/PageProvider';

// ── Types ───────────────────────────────────────────────────────────────────
interface PodcastItem {
  id: string;
  title: string;
  words: string[];
  episode: number;
  duration: string;
  color: string;
  language: string;
  flag: string;
}

interface RecentlyPlayedItem extends PodcastItem {
  remaining: string;
}

// ── Data ────────────────────────────────────────────────────────────────────
const FEATURED: PodcastItem = {
  id: 'f1',
  title: 'Spanish Tech Talk',
  words: ['algoritmo', 'interfaz', 'red'],
  episode: 3,
  duration: '24 min',
  color: '#0f1a00',
  language: 'Spanish',
  flag: '🇪🇸',
};

const RECENTLY_PLAYED: RecentlyPlayedItem[] = [
  {
    id: 'r1',
    title: 'French Cuisine',
    words: ['sauté', 'julienne', 'mise en place'],
    episode: 2,
    duration: '31 min',
    remaining: '18 mins',
    color: '#1a1a2e',
    language: 'French',
    flag: '🇫🇷',
  },
  {
    id: 'r2',
    title: 'German Science Digest',
    words: ['Quantenphysik', 'Mitochondrien', 'Algorithmus'],
    episode: 5,
    duration: '22 min',
    remaining: '22 mins',
    color: '#1e293b',
    language: 'German',
    flag: '🇩🇪',
  },
];

const RECENT_PODCASTS: PodcastItem[] = [
  {
    id: 'p1',
    title: 'Japanese Daily Life',
    words: ['yokatta', 'otsukaresama', 'sumimasen'],
    episode: 7,
    duration: '18 min',
    color: '#2d1b1b',
    language: 'Japanese',
    flag: '🇯🇵',
  },
  {
    id: 'p2',
    title: 'Italian Art & Culture',
    words: ['rinascimento', 'affresco', 'chiaroscuro'],
    episode: 4,
    duration: '27 min',
    color: '#1b2d1b',
    language: 'Italian',
    flag: '🇮🇹',
  },
  {
    id: 'p3',
    title: 'Spanish Business Talk',
    words: ['reunión', 'presupuesto', 'negociar'],
    episode: 1,
    duration: '20 min',
    color: '#2d2b1b',
    language: 'Spanish',
    flag: '🇪🇸',
  },
  {
    id: 'p4',
    title: 'English Literature',
    words: ['ephemeral', 'melancholy', 'serendipity'],
    episode: 2,
    duration: '33 min',
    color: '#1b1b2d',
    language: 'English',
    flag: '🇺🇸',
  },
];

// ── Word Chips ───────────────────────────────────────────────────────────────
function WordChips({ words, light = false }: { words: string[]; light?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
      {words.slice(0, 3).map((w) => (
        <View
          key={w}
          style={{
            backgroundColor: light ? 'rgba(255,255,255,0.12)' : 'rgba(15,26,0,0.07)',
            borderRadius: 6,
            paddingHorizontal: 7,
            paddingVertical: 3,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: '500',
              color: light ? 'rgba(255,255,255,0.75)' : 'rgba(15,26,0,0.55)',
            }}
          >
            {w}
          </Text>
        </View>
      ))}
    </View>
  );
}

// ── Section Header — mirrors index.tsx SectionHeader exactly ────────────────
function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  const { t } = useTranslation();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}
    >
      <Text className="text-foreground" style={{ fontSize: 18, fontWeight: '700', letterSpacing: -0.2 }}>
        {title}
      </Text>
      {onSeeAll && (
        <Pressable onPress={onSeeAll} hitSlop={12}>
          <Text style={{ color: '#3d4700', fontSize: 13, fontWeight: '600' }}>
            {t('PODCAST_SEE_ALL')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ── Generate CTA Card ────────────────────────────────────────────────────────
function GenerateCTACard() {
  const { t } = useTranslation();
  return (
    <Pressable
      style={({ pressed }) => ({ opacity: pressed ? 0.88 : 1, marginBottom: 20 })}
      onPress={() => {}}
    >
      <View
        style={{
          borderRadius: 16,
          padding: 18,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#d9fd0c',
        }}
      >
        <View style={{ flex: 1, marginRight: 14 }}>
          <Text
            style={{ fontSize: 16, fontWeight: '700', color: '#0f1a00', marginBottom: 4 }}
            numberOfLines={1}
          >
            {t('PODCAST_GENERATE_TITLE')}
          </Text>
          <Text
            style={{ fontSize: 13, color: 'rgba(15,26,0,0.65)', fontWeight: '500' }}
            numberOfLines={1}
          >
            {t('PODCAST_GENERATE_SUBTITLE')}
          </Text>
        </View>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#0f1a00',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="color-wand-outline" size={20} color="#d9fd0c" />
        </View>
      </View>
    </Pressable>
  );
}

// ── Featured Card ────────────────────────────────────────────────────────────
function FeaturedCard({ item }: { item: PodcastItem }) {
  const { t } = useTranslation();
  return (
    <Pressable
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, marginBottom: 28 })}
      onPress={() => {}}
    >
      <View
        style={{
          borderRadius: 20,
          padding: 20,
          height: 170,
          backgroundColor: item.color,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 20,
              paddingHorizontal: 10,
              paddingVertical: 5,
              gap: 5,
            }}
          >
            <Text style={{ fontSize: 13 }}>{item.flag}</Text>
            <Text style={{ fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.85)' }}>
              {item.language}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 2 }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.55)' }}>
              {t('PODCAST_EPISODE', { n: item.episode })}
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{item.duration}</Text>
          </View>
        </View>

        <Text
          style={{ fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.5, lineHeight: 27 }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <WordChips words={item.words} light />
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#d9fd0c',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 12,
            }}
          >
            <Ionicons name="play" size={16} color="#0f1a00" style={{ marginLeft: 2 }} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ── Recently Played Row ──────────────────────────────────────────────────────
function RecentlyPlayedRow({
  item,
  onMorePress,
}: {
  item: RecentlyPlayedItem;
  onMorePress: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })} onPress={() => {}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingVertical: 10,
          gap: 14,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            backgroundColor: item.color,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Text style={{ fontSize: 24 }}>{item.flag}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            className="text-foreground"
            style={{ fontSize: 14, fontWeight: '700', letterSpacing: -0.1 }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#d9fd0c', marginTop: 2 }}>
            {t('PODCAST_EPISODE', { n: item.episode })}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Ionicons name="time-outline" size={12} color="#999" />
            <Text className="text-muted-foreground" style={{ fontSize: 12 }}>
              {t('PODCAST_REMAINING', { duration: item.remaining })}
            </Text>
          </View>
          <WordChips words={item.words} />
        </View>

        <Pressable hitSlop={10} onPress={() => onMorePress(item.id)} style={{ paddingTop: 2 }}>
          <Ionicons name="ellipsis-vertical" size={18} color="#bbb" />
        </Pressable>
      </View>
    </Pressable>
  );
}

// ── Recent Podcast Grid Card ─────────────────────────────────────────────────
function RecentPodcastCard({
  item,
  onMorePress,
}: {
  item: PodcastItem;
  onMorePress: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <Pressable
      style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, width: '47%' })}
      onPress={() => {}}
    >
      <View>
        <View
          style={{
            aspectRatio: 1,
            backgroundColor: item.color,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 36 }}>{item.flag}</Text>
        </View>

        <View style={{ paddingTop: 8, paddingBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Text
              className="text-foreground"
              style={{ fontSize: 14, fontWeight: '700', flex: 1, marginRight: 6 }}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Pressable hitSlop={10} onPress={() => onMorePress(item.id)} style={{ paddingTop: 2 }}>
              <Ionicons name="ellipsis-vertical" size={16} color="#bbb" />
            </Pressable>
          </View>
          <Text className="text-muted-foreground" style={{ fontSize: 12, marginTop: 2 }}>
            {t('PODCAST_EPISODE', { n: item.episode })} · {item.duration}
          </Text>
          <WordChips words={item.words} />
        </View>
      </View>
    </Pressable>
  );
}

// ── Main Screen ──────────────────────────────────────────────────────────────
export default function PodcastTab() {
  const { t } = useTranslation();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleMorePress = (_id: string) => {
    setSheetOpen(true);
  };

  const handleDelete = () => {
    setSheetOpen(false);
  };

  const filteredRecent = useMemo(() => {
    if (!searchQuery.trim()) return RECENTLY_PLAYED;
    const q = searchQuery.toLowerCase();
    return RECENTLY_PLAYED.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.language.toLowerCase().includes(q) ||
        p.words.some((w) => w.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  const filteredPodcasts = useMemo(() => {
    if (!searchQuery.trim()) return RECENT_PODCASTS;
    const q = searchQuery.toLowerCase();
    return RECENT_PODCASTS.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.language.toLowerCase().includes(q) ||
        p.words.some((w) => w.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  return (
    <PageProvider scrollable>

      {/* ── Header — same vertical rhythm as index.tsx ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 6,
          paddingBottom: 20,
        }}
      >
        <View>
          <Text
            className="text-foreground"
            style={{ fontSize: 26, fontWeight: '800', letterSpacing: -0.5 }}
          >
            {t('PODCAST_GREETING')}
          </Text>
          <Text className="text-muted-foreground" style={{ fontSize: 14, marginTop: 2, fontWeight: '500' }}>
            {t('PODCAST_SUBTITLE')}
          </Text>
        </View>
        <Pressable
          hitSlop={10}
          onPress={() => {
            setSearchVisible((v) => !v);
            if (searchVisible) setSearchQuery('');
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: searchVisible ? '#d9fd0c' : 'rgba(15,26,0,0.06)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={searchVisible ? 'close' : 'search-outline'}
            size={20}
            color="#0f1a00"
          />
        </Pressable>
      </View>

      {/* ── Search bar ── */}
      {searchVisible && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(15,26,0,0.06)',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            gap: 10,
            marginBottom: 16,
          }}
        >
          <Ionicons name="search-outline" size={16} color="#999" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search podcasts or words..."
            placeholderTextColor="#999"
            autoFocus
            style={{ flex: 1, fontSize: 15, color: '#0f1a00' }}
          />
        </View>
      )}

      {/* ── Generate CTA ── */}
      <GenerateCTACard />

      {/* ── Featured ── */}
      <FeaturedCard item={FEATURED} />

      {/* ── Recently Played ── */}
      <View style={{ marginBottom: 28 }}>
        <SectionHeader title={t('PODCAST_RECENTLY_PLAYED')} onSeeAll={() => {}} />
        {filteredRecent.map((item) => (
          <RecentlyPlayedRow key={item.id} item={item} onMorePress={handleMorePress} />
        ))}
        {filteredRecent.length === 0 && (
          <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
            No results found.
          </Text>
        )}
      </View>

      {/* ── Recent Podcasts ── */}
      <View style={{ marginBottom: 10 }}>
        <SectionHeader title={t('PODCAST_RECENT_PODCASTS')} onSeeAll={() => {}} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          {filteredPodcasts.map((item) => (
            <RecentPodcastCard key={item.id} item={item} onMorePress={handleMorePress} />
          ))}
          {filteredPodcasts.length === 0 && (
            <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
              No results found.
            </Text>
          )}
        </View>
      </View>

      {/* Spacer for tab bar */}
      <View style={{ height: 80 }} />

      {/* ── Three-dots bottom sheet ── */}
      <BottomSheet isOpen={sheetOpen} onOpenChange={setSheetOpen}>
        <BottomSheet.Portal>
          <BottomSheet.Overlay />
          <BottomSheet.Content snapPoints={['30%']}>
            <View style={{ padding: 20, gap: 12 }}>
              <Button variant="danger" onPress={handleDelete}>
                Delete Podcast
              </Button>
              <Button variant="tertiary" onPress={() => setSheetOpen(false)}>
                Cancel
              </Button>
            </View>
          </BottomSheet.Content>
        </BottomSheet.Portal>
      </BottomSheet>

    </PageProvider>
  );
}
