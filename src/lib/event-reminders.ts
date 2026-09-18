import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

function reminderId(eventId: string) {
  return `event-reminder-${eventId}`;
}

export async function scheduleEventReminder(eventId: string, title: string, dateIso: string) {
  if (Platform.OS === 'web') return;

  const eventDate = new Date(dateIso);
  const triggerDate = new Date(eventDate.getTime() - 60 * 60 * 1000);
  if (triggerDate.getTime() <= Date.now()) return;

  await cancelEventReminder(eventId);
  await Notifications.scheduleNotificationAsync({
    identifier: reminderId(eventId),
    content: {
      title: 'Ça commence bientôt ✨',
      body: `${title} commence dans 1h.`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate },
  });
}

export async function cancelEventReminder(eventId: string) {
  if (Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(reminderId(eventId));
}
