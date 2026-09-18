import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChipSelector } from '@/components/form/chip-selector';
import { PrimaryButton } from '@/components/form/primary-button';
import { TextField } from '@/components/form/text-field';
import { StatusSuggestions } from '@/components/statuses/status-suggestions';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { STATUS_CATEGORIES } from '@/constants/status-categories';
import { Spacing } from '@/constants/theme';
import { useStatuses } from '@/context/statuses-context';
import type { StatusCategory } from '@/types/status';

const CATEGORY_CHIPS = STATUS_CATEGORIES.map((category) => ({ id: category.id, label: category.label }));

export default function NewStatusScreen() {
  const { addStatus } = useStatuses();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<StatusCategory>('bar');
  const [error, setError] = useState<string | null>(null);

  async function handlePublish() {
    if (!content.trim()) {
      setError('Écris un petit message pour lancer ton statut.');
      return;
    }
    await addStatus(content.trim(), category);
    if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.replace('/(tabs)');
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <SafeAreaView style={styles.flex}>
          <ThemedView style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              Nouveau statut
            </ThemedText>
            <ThemedText themeColor="textSecondary" type="small">
              Visible 12h par les autres étudiants, puis disparaît automatiquement.
            </ThemedText>

            <ThemedView style={styles.fieldGroup}>
              <ThemedText type="smallBold">Catégorie</ThemedText>
              <ChipSelector chips={CATEGORY_CHIPS} selected={[category]} onToggle={(id) => setCategory(id as StatusCategory)} />
            </ThemedView>

            <ThemedView style={styles.fieldGroup}>
              <ThemedText type="smallBold">Besoin d&apos;inspiration ?</ThemedText>
              <StatusSuggestions category={category} onSelect={setContent} />
            </ThemedView>

            <TextField
              label="Ton message"
              placeholder="Qui pour une bière ce soir place du Ralliement ?"
              multiline
              numberOfLines={4}
              maxLength={200}
              value={content}
              onChangeText={setContent}
              error={error ?? undefined}
              style={styles.textArea}
            />

            <PrimaryButton label="Publier" onPress={handlePublish} />
          </ThemedView>
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
  content: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
  },
  fieldGroup: {
    gap: Spacing.two,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
