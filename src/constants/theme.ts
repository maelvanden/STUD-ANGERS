/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Identité Stud'Angers : violet électrique + cyan, pensée dark-mode-first.
export const Brand = {
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  accent: '#22D3EE',
  success: '#34D399',
  danger: '#F87171',
} as const;

export const Colors = {
  light: {
    text: '#16121F',
    background: '#FAF9FC',
    backgroundElement: '#F0EEF6',
    backgroundSelected: '#E7E1F7',
    textSecondary: '#5C5568',
    border: '#E2DEEB',
    tint: Brand.primary,
    accent: Brand.accent,
    success: Brand.success,
    danger: Brand.danger,
  },
  dark: {
    text: '#F5F3FA',
    background: '#0F0B1A',
    backgroundElement: '#1C1730',
    backgroundSelected: '#2A2246',
    textSecondary: '#A9A3BD',
    border: '#2A2446',
    tint: Brand.primaryLight,
    accent: Brand.accent,
    success: Brand.success,
    danger: Brand.danger,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
