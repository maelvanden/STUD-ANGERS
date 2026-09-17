import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/form/primary-button';
import { AvatarPicker } from '@/components/profile/avatar-picker';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { INTEREST_TAGS } from '@/constants/profile-options';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();
  const theme = useTheme();

  if (!profile) {
    return null;
  }

  const tagLabels = profile.tags.map((id) => INTEREST_TAGS.find((tag) => tag.id === id)?.label ?? id);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.centered}>
            <AvatarPicker />

            <ThemedText type="title" style={styles.name}>
              {profile.firstName}, {profile.age} ans
            </ThemedText>
            <ThemedText themeColor="textSecondary">{profile.school}</ThemedText>

            {profile.bio ? <ThemedText style={styles.bio}>{profile.bio}</ThemedText> : null}

            {tagLabels.length > 0 ? (
              <ThemedView style={styles.tagRow}>
                {tagLabels.map((label) => (
                  <ThemedView key={label} type="backgroundSelected" style={styles.tag}>
                    <ThemedText type="small">{label}</ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            ) : null}
          </ThemedView>

          <ThemedView type="backgroundElement" style={[styles.memberCard, { borderColor: theme.tint }]}>
            <ThemedText type="smallBold">Carte membre Stud&apos;Angers</ThemedText>
            <ThemedView type="backgroundElement" style={styles.qrWrapper}>
              <QRCode value={`STUDANGERS-MEMBER:${profile.email}`} size={140} backgroundColor="transparent" color={theme.text} />
            </ThemedView>
            <ThemedText type="small" themeColor="textSecondary" style={styles.qrHint}>
              Présente ce QR code chez nos partenaires pour profiter des bons plans.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.actions}>
            <PrimaryButton label="Modifier mon profil" onPress={() => router.push('/edit-profile')} variant="ghost" />
            <PrimaryButton label="Se déconnecter" onPress={signOut} variant="ghost" />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.four,
    gap: Spacing.four,
  },
  centered: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
  },
  bio: {
    textAlign: 'center',
    marginTop: Spacing.two,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  tag: {
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  memberCard: {
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.four,
    padding: Spacing.four,
  },
  qrWrapper: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  qrHint: {
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: Spacing.two,
  },
});
