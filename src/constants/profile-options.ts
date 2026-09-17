import type { Ionicons } from '@expo/vector-icons';

import type { InterestTagId } from '@/types/profile';

export const SCHOOLS = [
  "Université d'Angers",
  'UCO Angers',
  'ESSCA',
  'ESEO',
  'Agrocampus Ouest',
  'ESAIP',
] as const;

export const INTEREST_TAGS: { id: InterestTagId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'sport', label: 'Sport', icon: 'football-outline' },
  { id: 'fete', label: 'Fête', icon: 'sparkles-outline' },
  { id: 'revisions', label: 'Révisions', icon: 'book-outline' },
  { id: 'musique', label: 'Musique', icon: 'musical-notes-outline' },
  { id: 'culture', label: 'Culture', icon: 'color-palette-outline' },
  { id: 'benevolat', label: 'Bénévolat', icon: 'heart-outline' },
];
