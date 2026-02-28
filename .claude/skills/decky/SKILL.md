---
name: decky
description: "Decky — Language learning mobile app. Provides project context, conventions, architecture, and important rules for working on the Decky codebase. Use when building features, writing translations, creating components, or making any changes to this project."
metadata:
  author: bedirhan
  version: "1.0.0"
---

# Decky — Project Context & Conventions

## What is Decky?

**Decky** is a language learning mobile app. Users can add words and phrases from content they watch/read (videos, screenshots, etc.) to their personal vocabulary lists and practice them with flashcards, quizzes, and other exercises.

There is also a companion Chrome extension that works alongside the app.

**CRITICAL — Copyright Rule:** Due to copyright/trademark restrictions, you must **NEVER** mention specific company or platform names (YouTube, Netflix, Amazon Prime, etc.) in the mobile app — not in UI text, translations, marketing copy, or any user-facing strings. Use neutral descriptions like "video platforms", "streaming services", "content sources", "videos", etc.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React Native + Expo 54 |
| Routing | Expo Router v6 (file-based, `src/app/`) |
| Styling | Tailwind CSS v4 + Uniwind 1.3.0 |
| UI Components | HeroUI Native |
| Animations | React Native Reanimated v4 |
| Theming | Uniwind (8 themes, OKLCH colors) |
| i18n | i18next + react-i18next (EN, TR) |
| Language | TypeScript (strict mode) |
| Package Manager | npm (use npm, not bun/yarn for installs) |
| New Architecture | Enabled (`newArchEnabled: true`) |

---

## Directory Structure

```
/
├── src/
│   ├── app/                    # Expo Router pages
│   │   ├── _layout.tsx         # Root layout (theme setup, i18n init)
│   │   └── index.tsx           # Home/welcome screen
│   ├── components/             # App-level shared components
│   │   └── PageProvider.tsx    # Page wrapper (SafeAreaView + scroll)
│   └── lang/                   # Internationalization
│       ├── 18n.ts              # i18next configuration
│       └── translation-files/
│           ├── en.json         # English translations
│           └── tr.json         # Turkish translations
├── components/                 # Reusable molecules/atoms
│   └── molecules/
│       └── dynamic-text/       # Animated text rotation component
│           ├── index.tsx
│           ├── types.ts
│           ├── helpers.ts
│           └── const.ts
├── themes/                     # CSS theme files (OKLCH colors)
│   ├── decky.css               # Main Decky theme (lime accent)
│   ├── lavander.css            # Lavender theme
│   ├── mint.css                # Mint theme
│   ├── sky.css                 # Sky blue theme
│   └── alpha.css               # Alpha theme
├── assets/
│   ├── images/                 # App icons, splash screen, logo.png
│   └── fonts/                  # Custom fonts (Inter, SN Pro, etc.)
├── global.css                  # Global CSS entry (imports themes)
├── metro.config.js             # Uniwind + Metro config
├── app.json                    # Expo app config
└── tsconfig.json               # TypeScript config (path alias: @/*)
```

---

## Active Theme

The active theme is **`decky-light`** (set in `src/app/_layout.tsx`):

```tsx
Uniwind.setTheme('decky-light');
```

### Decky Theme Colors (OKLCH)
- **Accent:** oklch(93.70% 0.2160 119.00) — bright lime/yellow-green (#d9fd0c-ish)
- **Accent Foreground:** oklch(15.00% 0.0500 119.00) — dark
- **Background:** Clean white (light) / Deep dark (dark)
- **Primary / Card / Border / Muted:** All defined in `themes/decky.css`

### Available Themes
```
light, dark,
lavender-light, lavender-dark,
mint-light, mint-dark,
sky-light, sky-dark,
decky-light, decky-dark
```

Registered in `metro.config.js` under `extraThemes`.

---

## Theming — Key Rules

- Always use CSS variable-based classes (`bg-background`, `text-foreground`, `bg-primary`) instead of hardcoded colors.
- Every theme variant must define the same set of CSS variables.
- Changes to `metro.config.js` require a Metro restart: `npm start` (script already uses `-c` flag for cache clearing).
- Theme CSS files live in `themes/` and are imported via `@import './themes/*.css';` in `global.css`.
- See the **uniwind** skill for full Uniwind API reference.

---

## Internationalization (i18n)

- **Library:** i18next + react-i18next
- **Languages:** English (`en`), Turkish (`tr`)
- **Config file:** `src/lang/18n.ts`
- **Translation files:** `src/lang/translation-files/{en,tr}.json`
- **Translation key format:** `UPPER_SNAKE_CASE` inside the `"translation"` namespace

### Translation Key Naming

Keys must be ALL_CAPS with underscores:
```json
{
  "translation": {
    "WELCOME_TITLE": "Decky",
    "WELCOME_DESCRIPTION": "Build your vocabulary from the content you love",
    "GET_STARTED": "Get Started",
    "ADD_WORD": "Add Word",
    "MY_VOCABULARY": "My Vocabulary"
  }
}
```

### Usage in Components

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<Text>{t('WELCOME_TITLE')}</Text>
```

### COPYRIGHT RULE for translations

Never mention specific platform names in translation strings. Use neutral terms:

| ❌ Avoid | ✅ Use instead |
|----------|---------------|
| "from YouTube" | "from videos", "from video content" |
| "Netflix shows" | "streaming content", "shows you watch" |
| "Amazon Prime" | "video platforms", "streaming services" |
| "while watching YouTube" | "while watching content", "from videos" |
| "screenshots from Netflix" | "screenshots", "captured text" |

---

## Component Conventions

### PageProvider

Every screen should be wrapped in `PageProvider`:

```tsx
import PageProvider from '@/src/components/PageProvider';

export default function MyScreen() {
  return (
    <PageProvider scrollable={false}>
      {/* screen content */}
    </PageProvider>
  );
}
```

Props:
- `children` — required
- `scrollable?: boolean` — enables KeyboardAwareScrollView (default: false)

### DynamicText

Animated text carousel component. Use on screens with rotating text/taglines:

```tsx
import { DynamicText } from '@/components/molecules/dynamic-text';

<DynamicText
  items={['Hello', 'Merhaba', 'Bonjour', 'Hola']}
  animationPreset="slide"
  animationDirection="up"
  timing={{ interval: 2200, animationDuration: 500 }}
  loop
  text={{ fontSize: 24, fontWeight: '600', color: primaryColor }}
/>
```

Props: `items`, `animationPreset` ('fade'|'slide'|'scale'), `animationDirection` ('up'|'down'|'left'|'right'), `timing`, `dot`, `text`, `loop`, `loopCount`, `paused`, `initialIndex`, `onAnimationComplete`, `onIndexChange`.

### Path Alias

Always use `@/` for imports (maps to project root):

```tsx
import PageProvider from '@/src/components/PageProvider';
import { DynamicText } from '@/components/molecules/dynamic-text';
import en from '@/src/lang/translation-files/en.json';
```

---

## Navigation

Expo Router file-based routing under `src/app/`:

- `src/app/_layout.tsx` — Root Stack layout (headerShown: false)
- `src/app/index.tsx` — Home screen (route: `/`)
- Add new screens as `src/app/[name].tsx` or `src/app/[name]/index.tsx`

The root layout sets up:
- `GestureHandlerRootView` (must wrap everything)
- `KeyboardProvider`
- `HeroUINativeProvider`
- Uniwind theme: `Uniwind.setTheme('decky-light')`
- i18n initialization (import from `@/src/lang/18n`)

---

## Styling Guidelines

1. **Always use `className`** — avoid `StyleSheet.create()` for new code
2. **Use semantic CSS variables** for colors: `bg-background`, `text-foreground`, `bg-primary`, `border-border`, etc.
3. **Font classes:** `font-normal`, `font-medium`, `font-semibold`, `font-bold` (mapped to Inter variants)
4. **No hardcoded colors** in className (except for illustrations/decorative elements)
5. **HeroUI Native** components are preferred for standard UI elements (Button, Input, Card, Modal, etc.)
6. **React Native built-ins** (`View`, `Text`, `Pressable`, `ScrollView`) support `className` directly via Uniwind
7. For third-party components needing className: use `withUniwind()` from `'uniwind'`

---

## Key Files Quick Reference

| File | Purpose |
|------|---------|
| [src/app/_layout.tsx](src/app/_layout.tsx) | Root layout, theme init, i18n init |
| [src/app/index.tsx](src/app/index.tsx) | Home/welcome screen |
| [src/components/PageProvider.tsx](src/components/PageProvider.tsx) | Screen wrapper |
| [src/lang/18n.ts](src/lang/18n.ts) | i18n setup |
| [src/lang/translation-files/en.json](src/lang/translation-files/en.json) | English translations |
| [src/lang/translation-files/tr.json](src/lang/translation-files/tr.json) | Turkish translations |
| [components/molecules/dynamic-text/index.tsx](components/molecules/dynamic-text/index.tsx) | Animated text component |
| [themes/decky.css](themes/decky.css) | Decky theme colors |
| [global.css](global.css) | Global CSS entry point |
| [metro.config.js](metro.config.js) | Uniwind + Metro config |
| [app.json](app.json) | Expo app config |

---

## Development Commands

```bash
npm start          # Start with cache clear (expo start -c)
npm run ios        # Run on iOS with cache clear
npm run android    # Run on Android with cache clear
npm run web        # Run on web with cache clear
npm run lint       # ESLint
```

---

## Important Reminders

1. **Copyright:** Never use YouTube, Netflix, Amazon Prime, or similar brand names in user-facing text
2. **Translations:** Add keys to BOTH `en.json` AND `tr.json` when adding new text
3. **Themes:** When adding theme CSS variables, add them to ALL theme variants (decky, lavender, mint, sky, alpha — both light and dark)
4. **TypeScript:** Strict mode is enabled — no `any` without justification
5. **New Architecture:** Enabled — use `Pressable` instead of `TouchableOpacity`
6. **Fonts:** Only single font per variable in `@theme` (no fallbacks — React Native limitation)
