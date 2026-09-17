import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { isHappyHourActive } from '@/lib/happy-hour';
import type { Partner } from '@/types/partner';

type Props = {
  partner: Partner;
};

export function PartnerCard({ partner }: Props) {
  const theme = useTheme();
  const isActive = isHappyHourActive(partner);

  return (
    <Pressable onPress={() => router.push(`/partner/${partner.id}`)}>
      {({ pressed }) => (
        <ThemedView
          type="backgroundElement"
          style={[styles.card, { borderColor: theme.border, opacity: pressed ? 0.85 : 1 }]}>
          <ThemedView type="backgroundElement" style={styles.headerRow}>
            <ThemedText type="smallBold" style={styles.name}>
              {partner.name}
            </ThemedText>
            <ThemedView
              type="backgroundElement"
              style={[styles.badge, { backgroundColor: isActive ? theme.success : theme.backgroundSelected }]}>
              <ThemedText type="small" style={{ color: isActive ? theme.background : theme.textSecondary }}>
                {isActive ? 'En cours' : 'Fermé'}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.addressRow}>
            <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary">
              {partner.address}
            </ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.promoRow}>
            <Ionicons name="pricetag-outline" size={14} color={theme.accent} />
            <ThemedText type="small" style={{ color: theme.accent }}>
              {partner.exclusivePromo}
            </ThemedText>
          </ThemedView>

          <ThemedText type="small" themeColor="textSecondary">
            Happy Hour {partner.happyHourStart} - {partner.happyHourEnd}
          </ThemedText>
        </ThemedView>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
  },
  badge: {
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
