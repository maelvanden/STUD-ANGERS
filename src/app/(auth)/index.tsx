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
import { translateAuthError } from '@/lib/auth-errors';
import { isValidEmail } from '@/lib/validation';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!isValidEmail(email)) {
      setError('Entre une adresse email valide.');
      return;
    }
    if (!password) {
      setError('Entre ton mot de passe.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);
    if (!result.success) {
      setError(translateAuthError(result.error));
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
              />
              <TextField
                label="Mot de passe"
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
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
