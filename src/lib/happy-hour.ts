import type { Partner } from '@/types/partner';

function toMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function isHappyHourActive(partner: Partner, now: Date = new Date()) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const start = toMinutes(partner.happyHourStart);
  const end = toMinutes(partner.happyHourEnd);
  return nowMinutes >= start && nowMinutes < end;
}
