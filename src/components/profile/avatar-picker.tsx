import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { uploadAvatarImage } from '@/lib/avatar-upload';
import { errorHaptic, successHaptic } from '@/lib/haptics';

const SIZE = 96;

export function AvatarPicker() {
  const { profile, updateProfile } = useAuth();
  const theme = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePress() {
    if (!profile || isUploading) return;
    setError(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Autorise l’accès à tes photos pour changer ta photo de profil.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;

    setIsUploading(true);
    const { url, error: uploadError } = await uploadAvatarImage(profile.id, result.assets[0].uri);
    if (uploadError || !url) {
      setIsUploading(false);
      errorHaptic();
      setError(uploadError ?? 'Erreur lors de l’envoi de la photo.');
      return;
    }

    const updateResult = await updateProfile({ avatarUrl: url });
    setIsUploading(false);
    if (!updateResult.success) {
      errorHaptic();
      setError(updateResult.error);
      return;
    }
    successHaptic();
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress} style={styles.wrapper}>
        <ThemedView type="backgroundElement" style={[styles.avatar, { borderColor: theme.tint }]}>
          {profile?.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.image} />
          ) : (
            <Ionicons name="person" size={36} color={theme.tint} />
          )}
          {isUploading ? (
            <View style={styles.overlay}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : null}
        </ThemedView>
        <View style={[styles.editBadge, { backgroundColor: theme.tint, borderColor: theme.background }]}>
          <Ionicons name="camera" size={14} color={theme.background} />
        </View>
      </Pressable>
      {error ? (
        <ThemedText type="small" style={[styles.error, { color: theme.danger }]}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  wrapper: {
    width: SIZE,
    height: SIZE,
  },
  avatar: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: SIZE,
    height: SIZE,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    textAlign: 'center',
    maxWidth: 220,
  },
});
