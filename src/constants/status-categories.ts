import type { Ionicons } from '@expo/vector-icons';

import type { StatusCategory } from '@/types/status';

export const STATUS_CATEGORIES: { id: StatusCategory; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'bar', label: 'Bar', icon: 'beer-outline' },
  { id: 'sport', label: 'Sport', icon: 'football-outline' },
  { id: 'etude', label: 'Révisions', icon: 'book-outline' },
];

export const EPHEMERAL_DURATION_HOURS = 12;
