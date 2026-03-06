import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

const ACCENT_FOREGROUND = '#0f1a00';
const INACTIVE_COLOR = '#9ca3af';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  name,
  focusedName,
  color,
  focused,
}: {
  name: IoniconName;
  focusedName: IoniconName;
  color: string;
  focused: boolean;
}) {
  return (
    <Ionicons
      name={focused ? focusedName : name}
      size={24}
      color={focused ? ACCENT_FOREGROUND : color}
      style={
        focused
          ? {
              borderRadius: 10,
              padding: 4,
              overflow: 'hidden',
            }
          : undefined
      }
    />
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      initialRouteName="feed"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: ACCENT_FOREGROUND,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: Platform.OS === 'ios' ? 0 : 8,
          paddingTop: 8,
          height: Platform.OS === 'ios' ? 84 : 68,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('TAB_HOME'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home-outline" focusedName="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="podcast"
        options={{
          title: t('TAB_PODCAST'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="mic-outline" focusedName="mic" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: t('TAB_FEED'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="albums-outline" focusedName="albums" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: t('TAB_VOCABULARY'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="book-outline" focusedName="book" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('TAB_PROFILE'),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person-outline" focusedName="person" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
