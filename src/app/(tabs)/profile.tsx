import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/form/primary-button';
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
        <ThemedView type="backgroundElement" style={[styles.avatar, { borderColor: theme.tint }]}>
          <Ionicons name="person" size={36} color={theme.tint} />
        </ThemedView>

        <ThemedText type="title" style={styles.name}>
          {profile.firstName}, {profile.age} ans
        </ThemedText>
        <ThemedText themeColor="textSecondary">{profile.school}</ThemedText>

        {profile.bio ? (
          <ThemedText style={styles.bio}>{profile.bio}</ThemedText>
        ) : null}

        {tagLabels.length > 0 ? (
          <ThemedView style={styles.tagRow}>
            {tagLabels.map((label) => (
              <ThemedView key={label} type="backgroundSelected" style={styles.tag}>
                <ThemedText type="small">{label}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        ) : null}

        <ThemedView type="backgroundElement" style={styles.comingSoonPill}>
          <Ionicons name="qr-code-outline" size={14} color={theme.accent} />
          <ThemedText type="small" style={{ color: theme.accent }}>
            Carte membre & QR code — Étape 3
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.signOut}>
          <PrimaryButton label="Se déconnecter" onPress={signOut} variant="ghost" />
        </ThemedView>
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
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    gap: Spacing.two,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
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
    marginTop: Spacing.three,
  },
  tag: {
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  comingSoonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    marginTop: Spacing.four,
  },
  signOut: {
    marginTop: 'auto',
    alignSelf: 'stretch',
    paddingBottom: Spacing.four,
  },
});
