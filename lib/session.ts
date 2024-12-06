import { auth } from './firebase';
import { User } from 'firebase/auth';

const INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

let inactivityTimer: NodeJS.Timeout;

export function setupInactivityCheck(onTimeout: () => void) {
  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(onTimeout, INACTIVE_TIMEOUT);
  };

  // Reset timer on user activity
  if (typeof window !== 'undefined') {
    ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
      window.addEventListener(event, resetTimer);
    });
  }

  resetTimer();

  return () => {
    if (typeof window !== 'undefined') {
      ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    }
    clearTimeout(inactivityTimer);
  };
}

export function getGreeting(user: User | null): string {
  if (!user) return '';
  
  const hour = new Date().getHours();
  const name = user.displayName || user.email?.split('@')[0] || 'there';
  
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}