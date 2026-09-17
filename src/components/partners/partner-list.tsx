import { FlatList, StyleSheet } from 'react-native';

import { PartnerCard } from '@/components/partners/partner-card';
import { Spacing } from '@/constants/theme';
import { PARTNERS } from '@/data/partners';

export function PartnerList() {
  return (
    <FlatList
      data={PARTNERS}
      keyExtractor={(partner) => partner.id}
      renderItem={({ item }) => <PartnerCard partner={item} />}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
