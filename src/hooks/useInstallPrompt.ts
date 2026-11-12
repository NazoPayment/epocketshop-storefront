import {useCallback, useSyncExternalStore} from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{outcome: 'accepted' | 'dismissed'}>;
}

interface InstallState {
  deferred: BeforeInstallPromptEvent | null;
  installed: boolean;
}

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  (window.navigator as Navigator & {standalone?: boolean}).standalone === true;

const detectIos = () =>
  /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
  // iPadOS reports itself as a Mac; touch support gives it away.
  (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

/*
 * The browser fires `beforeinstallprompt` once, shortly after load. It must be captured at
 * startup (this module is imported from main.tsx), otherwise lazily rendered screens miss it.
 */
let state: InstallState = {deferred: null, installed: isStandalone()};
const listeners = new Set<() => void>();

function setState(next: Partial<InstallState>) {
  state = {...state, ...next};
  listeners.forEach((listener) => listener());
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  setState({deferred: event as BeforeInstallPromptEvent});
});
window.addEventListener('appinstalled', () => setState({installed: true, deferred: null}));

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => state;

/**
 * "Install app" support. Chrome / Edge / Android expose a prompt we can trigger;
 * iOS has no prompt, so we report `isIos` and the UI shows the manual steps.
 */
export function useInstallPrompt() {
  const {deferred, installed} = useSyncExternalStore(subscribe, getSnapshot);

  const install = useCallback(async () => {
    const prompt = state.deferred;
    if (!prompt) return;
    await prompt.prompt();
    const choice = await prompt.userChoice;
    setState({deferred: null, installed: choice.outcome === 'accepted' || state.installed});
  }, []);

  return {canInstall: Boolean(deferred), installed, isIos: detectIos(), install};
}
