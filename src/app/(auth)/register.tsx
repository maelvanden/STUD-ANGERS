import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChipSelector } from '@/components/form/chip-selector';
import { PrimaryButton } from '@/components/form/primary-button';
import { TextField } from '@/components/form/text-field';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { INTEREST_TAGS, SCHOOLS } from '@/constants/profile-options';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { translateAuthError } from '@/lib/auth-errors';
import { isValidEmail } from '@/lib/validation';
import type { InterestTagId } from '@/types/profile';

const SCHOOL_CHIPS = SCHOOLS.map((school) => ({ id: school, label: school }));
const TAG_CHIPS = INTEREST_TAGS.map((tag) => ({ id: tag.id, label: tag.label }));

type FormErrors = Partial<Record<'email' | 'password' | 'firstName' | 'age' | 'school' | 'submit', string>>;

export default function RegisterScreen() {
  const { register } = useAuth();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [school, setSchool] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState<InterestTagId[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);

  function toggleTag(id: string) {
    const tagId = id as InterestTagId;
    setTags((current) =>
      current.includes(tagId) ? current.filter((t) => t !== tagId) : [...current, tagId]
    );
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!isValidEmail(email)) nextErrors.email = 'Entre une adresse email valide.';
    if (password.length < 6) nextErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    if (!firstName.trim()) nextErrors.firstName = 'Ton prénom est requis.';
    const ageNumber = Number(age);
    if (!age || Number.isNaN(ageNumber) || ageNumber < 16 || ageNumber > 99) {
      nextErrors.age = 'Entre un âge valide (16-99).';
    }
    if (!school) nextErrors.school = 'Choisis ton école ou faculté.';
    return nextErrors;
  }

  async function handleSubmit() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !school) return;

    setIsSubmitting(true);
    const result = await register({
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      age: Number(age),
      school,
      bio: bio.trim(),
      tags,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setErrors({ submit: translateAuthError(result.error) });
      return;
    }
    if (result.needsEmailConfirmation) {
      setNeedsEmailConfirmation(true);
    }
  }

  if (needsEmailConfirmation) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.confirmationSafeArea}>
          <ThemedText type="title" style={styles.title}>
            Vérifie ta boîte mail 📬
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.confirmationText}>
            On t&apos;a envoyé un email de confirmation à {email}. Clique sur le lien puis reviens
            te connecter.
          </ThemedText>
          <PrimaryButton label="Retour à la connexion" onPress={() => router.replace('/(auth)')} />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <SafeAreaView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <ThemedView style={styles.hero}>
              <ThemedText type="title" style={styles.title}>
                Crée ton profil
              </ThemedText>
              <ThemedText themeColor="textSecondary">
                Quelques infos pour rejoindre la communauté étudiante angevine.
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
                error={errors.email}
              />
              <TextField
                label="Mot de passe"
                placeholder="6 caractères minimum"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password-new"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
              />
              <TextField
                label="Prénom"
                placeholder="Camille"
                value={firstName}
                onChangeText={setFirstName}
                error={errors.firstName}
              />
              <TextField
                label="Âge"
                placeholder="20"
                keyboardType="number-pad"
                value={age}
                onChangeText={setAge}
                error={errors.age}
              />

              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="smallBold">École / Faculté</ThemedText>
                <ChipSelector chips={SCHOOL_CHIPS} selected={school ? [school] : []} onToggle={setSchool} />
                {errors.school ? (
                  <ThemedText type="small" style={{ color: theme.danger }}>
                    {errors.school}
                  </ThemedText>
                ) : null}
              </ThemedView>

              <TextField
                label="Bio (optionnel)"
                placeholder="Quelques mots sur toi..."
                multiline
                numberOfLines={3}
                maxLength={200}
                value={bio}
                onChangeText={setBio}
                style={styles.bioInput}
              />

              <ThemedView style={styles.fieldGroup}>
                <ThemedText type="smallBold">Centres d&apos;intérêt</ThemedText>
                <ChipSelector chips={TAG_CHIPS} selected={tags} onToggle={toggleTag} />
              </ThemedView>

              {errors.submit ? (
                <ThemedText type="small" style={{ color: theme.danger }}>
                  {errors.submit}
                </ThemedText>
              ) : null}

              <PrimaryButton label="Créer mon compte" onPress={handleSubmit} loading={isSubmitting} />
            </ThemedView>

            <ThemedView style={styles.footer}>
              <ThemedText themeColor="textSecondary">Déjà un compte ?</ThemedText>
              <Link href="/(auth)" asChild>
                <ThemedText type="linkPrimary">Se connecter</ThemedText>
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
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
    gap: Spacing.five,
  },
  hero: {
    gap: Spacing.one,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  form: {
    gap: Spacing.four,
  },
  fieldGroup: {
    gap: Spacing.two,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.one,
  },
  confirmationSafeArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  confirmationText: {
    textAlign: 'center',
  },
});
