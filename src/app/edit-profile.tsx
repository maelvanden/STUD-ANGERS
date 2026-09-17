import { router } from 'expo-router';
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
import { successHaptic } from '@/lib/haptics';
import type { InterestTagId } from '@/types/profile';

const SCHOOL_CHIPS = SCHOOLS.map((school) => ({ id: school, label: school }));
const TAG_CHIPS = INTEREST_TAGS.map((tag) => ({ id: tag.id, label: tag.label }));

type FormErrors = Partial<Record<'firstName' | 'age' | 'school' | 'submit', string>>;

export default function EditProfileScreen() {
  const { profile, updateProfile } = useAuth();
  const theme = useTheme();

  const [firstName, setFirstName] = useState(profile?.firstName ?? '');
  const [age, setAge] = useState(String(profile?.age ?? ''));
  const [school, setSchool] = useState<string | null>(profile?.school ?? null);
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [tags, setTags] = useState<InterestTagId[]>(profile?.tags ?? []);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!profile) {
    return null;
  }

  function toggleTag(id: string) {
    const tagId = id as InterestTagId;
    setTags((current) =>
      current.includes(tagId) ? current.filter((t) => t !== tagId) : [...current, tagId]
    );
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!firstName.trim()) nextErrors.firstName = 'Ton prénom est requis.';
    const ageNumber = Number(age);
    if (!age || Number.isNaN(ageNumber) || ageNumber < 16 || ageNumber > 99) {
      nextErrors.age = 'Entre un âge valide (16-99).';
    }
    if (!school) nextErrors.school = 'Choisis ton école ou faculté.';
    return nextErrors;
  }

  async function handleSave() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !school) return;

    setIsSaving(true);
    const result = await updateProfile({
      firstName: firstName.trim(),
      age: Number(age),
      school,
      bio: bio.trim(),
      tags,
    });
    setIsSaving(false);

    if (!result.success) {
      setErrors({ submit: result.error });
      return;
    }
    successHaptic();
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.replace('/(tabs)/profile');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <SafeAreaView style={styles.flex} edges={['bottom']}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
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
              label="Bio"
              placeholder="Quelques mots sur toi..."
              multiline
              numberOfLines={4}
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

            <PrimaryButton label="Enregistrer" onPress={handleSave} loading={isSaving} />
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
    padding: Spacing.four,
    gap: Spacing.four,
  },
  fieldGroup: {
    gap: Spacing.two,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
