import { FlatList, StyleSheet } from 'react-native';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { PartnerCard } from '@/components/partners/partner-card';
import { Spacing } from '@/constants/theme';
import { usePartners } from '@/hooks/use-partners';

export function PartnerList() {
  const { partners, isLoading } = usePartners();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <FlatList
      data={partners}
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
