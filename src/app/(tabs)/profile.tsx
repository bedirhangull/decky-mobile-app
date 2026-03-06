import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

// ── Styles ─────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  squircle: { borderCurve: 'continuous' } as object,
});

// ── Sub-Components ─────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 12,
        fontWeight: '600',
        color: '#888',
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        marginBottom: 7,
        marginLeft: 4,
      }}
    >
      {label}
    </Text>
  );
}

type SettingsRowProps = {
  icon: string;
  label: string;
  iconBg: string;
  iconColor: string;
  onPress?: () => void;
  danger?: boolean;
};

function SettingsRow({ icon, label, iconBg, iconColor, onPress, danger = false }: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingHorizontal: 14,
          paddingVertical: 13,
          gap: 13,
        }}
      >
        <View
          style={[
            s.squircle,
            {
              width: 33,
              height: 33,
              borderRadius: 8,
              backgroundColor: iconBg,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Ionicons name={icon as any} size={17} color={iconColor} />
        </View>
        <Text style={{ flex: 1, fontSize: 15, color: danger ? '#dc2626' : '#0f1a00', fontWeight: '500' }}>
          {label}
        </Text>
        <Ionicons name="chevron-forward" size={15} color="#ccc" />
      </View>
    </Pressable>
  );
}

// gap-[2px] grouped rows — mirrors github-profile screen pattern
function SettingsGroup({ children }: { children: React.ReactNode }) {
  return <View style={{ gap: 2 }}>{children}</View>;
}

// Each row independently rounded (opal + GitHub pattern)
function RowWrapper({ children }: { children: React.ReactNode }) {
  return (
    <View style={[s.squircle, { borderRadius: 14, overflow: 'hidden' }]}>
      {children}
    </View>
  );
}

// ── Main Screen ────────────────────────────────────────────────────────────────
export default function ProfileTab() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // Scroll tracking — same pattern as useScrollViewOffset in ready-to-use-screens
  const scrollOffsetY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollOffsetY.set(e.contentOffset.y);
    },
  });

  const HEADER_HEIGHT = insets.top + 44;

  // Header border appears on scroll — github-profile-header-background-animation
  const rHeaderStyle = useAnimatedStyle(() => ({
    backgroundColor: '#fbfcfa',
    borderBottomWidth: withTiming(scrollOffsetY.value > 4 ? StyleSheet.hairlineWidth : 0, {
      duration: 200,
    }),
  }));

  // Name fades + slides up when avatar scrolls away — github-profile-header-title-animation
  const rHeaderNameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollOffsetY.value, [75, 105], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollOffsetY.value, [75, 105], [12, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: '#fbfcfa' }}>
      <Animated.View
        style={[
          rHeaderStyle,
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: HEADER_HEIGHT,
            paddingTop: insets.top,
            backgroundColor: '#f2f2f7',
            alignItems: 'center',
            justifyContent: 'flex-end',
            zIndex: 100,
            borderBottomColor: 'rgba(0,0,0,0.08)',
          },
        ]}
      >
        <Animated.View style={[rHeaderNameStyle, { paddingBottom: 10, overflow: 'hidden' }]}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f1a00' }}>
            Alex Johnson
          </Text>
        </Animated.View>
      </Animated.View>

      {/* ── Scrollable content ── */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + 24,
          paddingBottom: 110,
          paddingHorizontal: 16,
          gap: 22,
        }}
      >

        {/* ── 1. Avatar + User Info ── */}
        <View style={{ alignItems: 'center', gap: 14 }}>
          <View
            style={[
              s.squircle,
              {
                width: 82,
                height: 82,
                borderRadius: 26,
                backgroundColor: '#0f1a00',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <Text style={{ fontSize: 34, fontWeight: '800', color: '#d9fd0c' }}>A</Text>
          </View>

          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0f1a00', letterSpacing: -0.4 }}>
              Alex Johnson
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <Text style={{ fontSize: 14, color: '#888' }}>@alex</Text>
              <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: '#ccc' }} />
              <Text style={{ fontSize: 14, color: '#888' }}>{t('PROFILE_FREE_MEMBER')}</Text>
            </View>
          </View>
        </View>

        {/* ── 2. Connect to Extension ── */}
        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          onPress={() => {}}
        >
          <View
            style={[
              s.squircle,
              {
                backgroundColor: '#fff',
                borderRadius: 18,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: 'rgba(0,0,0,0.07)',
              },
            ]}
          >
            <View
              style={[
                s.squircle,
                {
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  backgroundColor: '#f0f0f0',
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <Ionicons name="extension-puzzle-outline" size={24} color="#444" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#0f1a00', marginBottom: 3 }}>
                {t('PROFILE_CONNECT_TITLE')}
              </Text>
              <Text style={{ fontSize: 13, color: '#888', lineHeight: 18 }}>
                {t('PROFILE_CONNECT_DESC')}
              </Text>
            </View>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: '#f0f0f0',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="chevron-forward" size={15} color="#555" />
            </View>
          </View>
        </Pressable>

        {/* ── 3. Premium Card ── */}
        <Pressable
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
          onPress={() => {}}
        >
          <LinearGradient
            colors={['#d9fd0c', '#b5d100']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[s.squircle, { borderRadius: 20, padding: 20, overflow: 'hidden' }]}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 18,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: '900',
                    color: '#0f1a00',
                    letterSpacing: -0.5,
                    marginBottom: 7,
                    lineHeight: 24,
                  }}
                >
                  {t('PROFILE_PREMIUM_TITLE')}
                </Text>
                <Text style={{ fontSize: 13, color: '#3a4600', lineHeight: 19 }}>
                  {t('PROFILE_PREMIUM_DESC')}
                </Text>
              </View>
            </View>

            {/* Dark CTA button */}
            <View
              style={[
                s.squircle,
                {
                  backgroundColor: '#0f1a00',
                  borderRadius: 13,
                  paddingVertical: 13,
                  alignItems: 'center',
                },
              ]}
            >
              <Text style={{ color: '#d9fd0c', fontSize: 15, fontWeight: '800' }}>
                {t('PROFILE_PREMIUM_CTA')}
              </Text>
            </View>
          </LinearGradient>
        </Pressable>

        {/* ── 4. General Section ── */}
        <View>
          <SectionLabel label={t('PROFILE_GENERAL')} />
          <SettingsGroup>
            <RowWrapper>
              <SettingsRow
                icon="shield-checkmark-outline"
                label={t('PROFILE_PERMISSIONS')}
                iconBg="#f0f0f0"
                iconColor="#444"
              />
            </RowWrapper>
            <RowWrapper>
              <SettingsRow
                icon="star-outline"
                label={t('PROFILE_RATE_APP')}
                iconBg="#f0f0f0"
                iconColor="#444"
              />
            </RowWrapper>
            <RowWrapper>
              <SettingsRow
                icon="mail-outline"
                label={t('PROFILE_CONTACT')}
                iconBg="#f0f0f0"
                iconColor="#444"
              />
            </RowWrapper>
          </SettingsGroup>
        </View>

        {/* ── 5. Account Section ── */}
        <View>
          <SectionLabel label={t('PROFILE_ACCOUNT')} />
          <SettingsGroup>
            <RowWrapper>
              <SettingsRow
                icon="log-out-outline"
                label={t('PROFILE_LOGOUT')}
                iconBg="#F5F5F5"
                iconColor="#555"
              />
            </RowWrapper>
            <RowWrapper>
              <SettingsRow
                icon="trash-outline"
                label={t('PROFILE_DELETE_ACCOUNT')}
                iconBg="#FEF2F2"
                iconColor="#dc2626"
                danger
              />
            </RowWrapper>
          </SettingsGroup>
        </View>

      </Animated.ScrollView>
    </View>
  );
}
