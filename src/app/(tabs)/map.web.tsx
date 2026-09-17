import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { PartnerList } from '@/components/partners/partner-list';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function MapScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Happy Hours à Angers
          </ThemedText>
          <ThemedText themeColor="textSecondary" type="small">
            La carte interactive est disponible dans l&apos;app mobile.
          </ThemedText>
        </ThemedView>
        <PartnerList />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: 2,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
});
