import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { usePartners } from '@/hooks/use-partners';
import { useTheme } from '@/hooks/use-theme';
import { isHappyHourActive } from '@/lib/happy-hour';

export default function PartnerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { partners, isLoading } = usePartners();
  const partner = partners.find((item) => item.id === id);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!partner) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.notFound}>Partenaire introuvable.</ThemedText>
      </ThemedView>
    );
  }

  const isActive = isHappyHourActive(partner);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.headerRow}>
          <ThemedText type="title" style={styles.name}>
            {partner.name}
          </ThemedText>
          <ThemedView
            type="backgroundElement"
            style={[styles.badge, { backgroundColor: isActive ? theme.success : theme.backgroundSelected }]}>
            <ThemedText type="small" style={{ color: isActive ? theme.background : theme.textSecondary }}>
              {isActive ? 'Happy Hour en cours' : 'Happy Hour terminée'}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedText themeColor="textSecondary">{partner.description}</ThemedText>

        <ThemedView type="backgroundElement" style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={theme.textSecondary} />
          <ThemedText type="small">{partner.address}</ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.infoRow}>
          <Ionicons name="time-outline" size={18} color={theme.textSecondary} />
          <ThemedText type="small">
            Happy Hour tous les jours de {partner.happyHourStart} à {partner.happyHourEnd}
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.promoCard}>
          <Ionicons name="pricetag" size={20} color={theme.accent} />
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {partner.exclusivePromo}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.promoHint}>
            Présente ta carte membre Stud&apos;Angers (onglet Profil) au bar pour en profiter.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  notFound: {
    padding: Spacing.four,
  },
  headerRow: {
    gap: Spacing.two,
  },
  name: {
    fontSize: 26,
    lineHeight: 32,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  promoCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
    marginTop: Spacing.two,
  },
  promoHint: {
    marginTop: Spacing.one,
  },
});
