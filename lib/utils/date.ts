import { User } from 'firebase/auth';

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export function formatUserName(user: User): string {
  return user.displayName || user.email?.split('@')[0] || 'there';
}

export function getGreeting(user: User | null): string {
  if (!user) return '';
  return `Good ${getTimeOfDay()}, ${formatUserName(user)}`;
}