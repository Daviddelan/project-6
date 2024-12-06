let inactivityTimer: NodeJS.Timeout;
const INACTIVE_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function setupInactivityCheck(onTimeout: () => void) {
  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(onTimeout, INACTIVE_TIMEOUT);
  };

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