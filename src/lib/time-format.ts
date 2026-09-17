export function formatEventDate(isoDate: string) {
  const date = new Date(isoDate);
  const day = date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${day} à ${time}`;
}

export function formatRelativeTime(isoDate: string, now: Date = new Date()) {
  const diffMs = now.getTime() - new Date(isoDate).getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "à l'instant";
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`;

  const diffHours = Math.round(diffMinutes / 60);
  return `il y a ${diffHours} h`;
}
