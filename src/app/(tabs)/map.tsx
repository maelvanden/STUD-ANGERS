import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullScreenLoader } from '@/components/full-screen-loader';
import { PartnerList } from '@/components/partners/partner-list';
import { SegmentedControl } from '@/components/segmented-control';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { usePartners } from '@/hooks/use-partners';
import { useTheme } from '@/hooks/use-theme';
import { isHappyHourActive } from '@/lib/happy-hour';

const ANGERS_REGION = {
  latitude: 47.4784,
  longitude: -0.5632,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

const VIEW_OPTIONS = [
  { id: 'map', label: 'Carte' },
  { id: 'list', label: 'Liste' },
] as const;

export default function MapScreen() {
  const theme = useTheme();
  const { partners, isLoading } = usePartners();
  const [view, setView] = useState<(typeof VIEW_OPTIONS)[number]['id']>('map');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Happy Hours à Angers
          </ThemedText>
          <SegmentedControl options={VIEW_OPTIONS} selectedId={view} onChange={(id) => setView(id as typeof view)} />
        </ThemedView>

        {isLoading ? (
          <FullScreenLoader />
        ) : view === 'map' ? (
          <MapView style={styles.map} initialRegion={ANGERS_REGION}>
            {partners.map((partner) => (
              <Marker
                key={partner.id}
                coordinate={{ latitude: partner.latitude, longitude: partner.longitude }}
                title={partner.name}
                description={partner.exclusivePromo}
                onPress={() => router.push(`/partner/${partner.id}`)}>
                <View
                  style={[
                    styles.markerDot,
                    {
                      backgroundColor: isHappyHourActive(partner) ? theme.success : theme.tint,
                      borderColor: theme.background,
                    },
                  ]}
                />
              </Marker>
            ))}
          </MapView>
        ) : (
          <PartnerList />
        )}
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
    paddingBottom: Spacing.three,
    gap: Spacing.three,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
  map: {
    flex: 1,
  },
  markerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
});
