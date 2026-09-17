export function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Email ou mot de passe incorrect.';
  if (message.includes('User already registered')) return 'Un compte existe déjà avec cet email.';
  if (message.includes('Password should be at least')) return 'Le mot de passe doit contenir au moins 6 caractères.';
  if (message.includes('Email not confirmed')) return 'Confirme ton email avant de te connecter (vérifie ta boîte de réception).';
  return message;
}
