import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/form/primary-button';
import { TextField } from '@/components/form/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { isValidEmail } from '@/lib/validation';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!isValidEmail(email)) {
      setError('Entre une adresse email valide.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const success = await login(email);
    setIsSubmitting(false);
    if (!success) {
      setError("Aucun compte trouvé avec cet email sur cet appareil. Crée un compte ci-dessous.");
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <SafeAreaView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <ThemedView style={styles.hero}>
              <ThemedText type="title" style={styles.title}>
                Stud&apos;Angers
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                Bons plans étudiants et rencontres à Angers.
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.form}>
              <TextField
                label="Email étudiant"
                placeholder="prenom.nom@etu.univ-angers.fr"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                error={error ?? undefined}
              />
              <PrimaryButton label="Se connecter" onPress={handleSubmit} loading={isSubmitting} />
            </ThemedView>

            <ThemedView style={styles.footer}>
              <ThemedText themeColor="textSecondary">Pas encore de compte ?</ThemedText>
              <Link href="/(auth)/register" asChild>
                <ThemedText type="linkPrimary">Créer un compte</ThemedText>
              </Link>
            </ThemedView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.five,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    gap: Spacing.three,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
  },
});
