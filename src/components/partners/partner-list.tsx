import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { PartnerCard } from '@/components/partners/partner-card';
import { SearchBar } from '@/components/search-bar';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { usePartners } from '@/hooks/use-partners';
import { useTheme } from '@/hooks/use-theme';
import { isHappyHourActive } from '@/lib/happy-hour';

export function PartnerList() {
  const { partners, isLoading } = usePartners();
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);

  const filteredPartners = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return partners.filter((partner) => {
      const matchesQuery = !normalizedQuery || partner.name.toLowerCase().includes(normalizedQuery);
      const matchesOpenNow = !onlyOpenNow || isHappyHourActive(partner);
      return matchesQuery && matchesOpenNow;
    });
  }, [partners, query, onlyOpenNow]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <FlatList
      data={filteredPartners}
      keyExtractor={(partner) => partner.id}
      renderItem={({ item }) => <PartnerCard partner={item} />}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View style={styles.filters}>
          <SearchBar value={query} onChangeText={setQuery} placeholder="Chercher un bar..." />
          <Pressable
            onPress={() => setOnlyOpenNow((current) => !current)}
            style={[
              styles.openNowChip,
              {
                backgroundColor: onlyOpenNow ? theme.tint : theme.backgroundElement,
                borderColor: onlyOpenNow ? theme.tint : theme.border,
              },
            ]}>
            <ThemedText type="small" style={{ color: onlyOpenNow ? theme.background : theme.text }}>
              Ouvert maintenant
            </ThemedText>
          </Pressable>
        </View>
      }
      ListEmptyComponent={
        <ThemedText themeColor="textSecondary" style={styles.emptyText}>
          Aucun partenaire ne correspond à ta recherche.
        </ThemedText>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    flexGrow: 1,
  },
  filters: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  openNowChip: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.six,
  },
});
