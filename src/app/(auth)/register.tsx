import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { SlideInLeft, SlideInRight, SlideOutLeft, SlideOutRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthBackground } from '@/components/auth-background';
import { ChipSelector } from '@/components/form/chip-selector';
import { PrimaryButton } from '@/components/form/primary-button';
import { TextField } from '@/components/form/text-field';
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress';
import { StepIcon } from '@/components/onboarding/step-icon';
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

const STEPS = [
  { icon: 'mail-outline', title: 'Créons ton compte', subtitle: 'Ton email étudiant et un mot de passe' },
  { icon: 'happy-outline', title: 'Comment tu t’appelles ?', subtitle: 'Et quel âge as-tu ?' },
  { icon: 'school-outline', title: 'Tu étudies où ?', subtitle: 'Choisis ton école ou ta fac' },
  { icon: 'chatbubble-ellipses-outline', title: 'Parle-nous un peu de toi', subtitle: 'Optionnel, quelques mots suffisent' },
  { icon: 'sparkles-outline', title: 'Tes centres d’intérêt', subtitle: 'Pour te proposer les bons plans qui te correspondent' },
  { icon: 'rocket-outline', title: 'Prêt·e à décoller ?', subtitle: 'Vérifie tes infos avant de rejoindre l’aventure' },
] as const;

type FormErrors = Partial<Record<'email' | 'password' | 'firstName' | 'age' | 'school' | 'submit', string>>;

export default function RegisterScreen() {
  const { register } = useAuth();
  const theme = useTheme();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
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

  function validateStep(target: number): FormErrors {
    const nextErrors: FormErrors = {};
    if (target === 0) {
      if (!isValidEmail(email)) nextErrors.email = 'Entre une adresse email valide.';
      if (password.length < 6) nextErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    if (target === 1) {
      if (!firstName.trim()) nextErrors.firstName = 'Ton prénom est requis.';
      const ageNumber = Number(age);
      if (!age || Number.isNaN(ageNumber) || ageNumber < 16 || ageNumber > 99) {
        nextErrors.age = 'Entre un âge valide (16-99).';
      }
    }
    if (target === 2 && !school) {
      nextErrors.school = 'Choisis ton école ou faculté.';
    }
    return nextErrors;
  }

  function handleNext() {
    const nextErrors = validateStep(step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setDirection('forward');
    setStep((current) => current + 1);
  }

  function handleBack() {
    setErrors({});
    setDirection('backward');
    setStep((current) => current - 1);
  }

  async function handleSubmit() {
    if (!school) return;

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
      <AuthBackground>
        <SafeAreaView style={styles.confirmationSafeArea}>
          <StepIcon name="mail-open-outline" stepKey={-1} />
          <ThemedText type="title" style={styles.confirmationTitle}>
            Vérifie ta boîte mail 📬
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.confirmationText}>
            On t&apos;a envoyé un email de confirmation à {email}. Clique sur le lien puis reviens
            te connecter.
          </ThemedText>
          <PrimaryButton label="Retour à la connexion" onPress={() => router.replace('/(auth)')} />
        </SafeAreaView>
      </AuthBackground>
    );
  }

  const current = STEPS[step];
  const isLastStep = step === STEPS.length - 1;
  const AnimatedStep = direction === 'forward' ? SlideInRight : SlideInLeft;
  const AnimatedStepOut = direction === 'forward' ? SlideOutLeft : SlideOutRight;

  return (
    <AuthBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <SafeAreaView style={styles.flex}>
          <View style={styles.header}>
            {step > 0 ? (
              <Pressable onPress={handleBack} hitSlop={12} style={styles.backButton}>
                <Ionicons name="chevron-back" size={22} color={theme.text} />
              </Pressable>
            ) : (
              <View style={styles.backButtonPlaceholder} />
            )}
            <OnboardingProgress step={step + 1} total={STEPS.length} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <StepIcon name={current.icon} stepKey={step} />

            <Animated.View key={step} entering={AnimatedStep.duration(280)} exiting={AnimatedStepOut.duration(200)}>
              <View style={styles.stepHeader}>
                <ThemedText type="title" style={styles.title}>
                  {current.title}
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.subtitle}>
                  {current.subtitle}
                </ThemedText>
              </View>

              <View style={styles.form}>
                {step === 0 ? (
                  <>
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
                  </>
                ) : null}

                {step === 1 ? (
                  <>
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
                  </>
                ) : null}

                {step === 2 ? (
                  <View style={styles.fieldGroup}>
                    <ChipSelector chips={SCHOOL_CHIPS} selected={school ? [school] : []} onToggle={setSchool} />
                    {errors.school ? (
                      <ThemedText type="small" style={{ color: theme.danger }}>
                        {errors.school}
                      </ThemedText>
                    ) : null}
                  </View>
                ) : null}

                {step === 3 ? (
                  <TextField
                    label="Bio"
                    placeholder="Quelques mots sur toi..."
                    multiline
                    numberOfLines={4}
                    maxLength={200}
                    value={bio}
                    onChangeText={setBio}
                    style={styles.bioInput}
                  />
                ) : null}

                {step === 4 ? (
                  <ChipSelector chips={TAG_CHIPS} selected={tags} onToggle={toggleTag} />
                ) : null}

                {isLastStep ? (
                  <ThemedView type="backgroundElement" style={[styles.recapCard, { borderColor: theme.border }]}>
                    <ThemedText type="smallBold">
                      {firstName}, {age} ans
                    </ThemedText>
                    <ThemedText themeColor="textSecondary" type="small">
                      {school}
                    </ThemedText>
                    {bio ? <ThemedText type="small">{bio}</ThemedText> : null}
                    {tags.length > 0 ? (
                      <View style={styles.recapTags}>
                        {tags.map((tagId) => {
                          const tag = INTEREST_TAGS.find((item) => item.id === tagId);
                          return (
                            <ThemedView key={tagId} type="backgroundSelected" style={styles.recapTag}>
                              <ThemedText type="small">{tag?.label ?? tagId}</ThemedText>
                            </ThemedView>
                          );
                        })}
                      </View>
                    ) : null}
                  </ThemedView>
                ) : null}

                {errors.submit ? (
                  <ThemedText type="small" style={{ color: theme.danger }}>
                    {errors.submit}
                  </ThemedText>
                ) : null}

                <PrimaryButton
                  label={isLastStep ? 'Créer mon compte' : 'Continuer'}
                  onPress={isLastStep ? handleSubmit : handleNext}
                  loading={isSubmitting}
                />
              </View>
            </Animated.View>

            {step === 0 ? (
              <View style={styles.footer}>
                <ThemedText themeColor="textSecondary">Déjà un compte ?</ThemedText>
                <Link href="/(auth)" asChild>
                  <ThemedText type="linkPrimary">Se connecter</ThemedText>
                </Link>
              </View>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPlaceholder: {
    width: 32,
    height: 32,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    gap: Spacing.four,
  },
  stepHeader: {
    alignItems: 'center',
    gap: Spacing.one,
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    gap: Spacing.three,
  },
  fieldGroup: {
    gap: Spacing.two,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  recapCard: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  recapTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  recapTag: {
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
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
  confirmationTitle: {
    fontSize: 26,
    lineHeight: 32,
    textAlign: 'center',
  },
  confirmationText: {
    textAlign: 'center',
  },
});
