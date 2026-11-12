// Light / dark / system colour mode, remembered per browser (same behaviour as epocketshop_admin).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {defaultThemeSlug, themes} from '../../astryx-themes';

const STORAGE_KEY = 'epocketshop_store.mode.v1';

export type ColorMode = 'light' | 'dark' | 'system';
const MODES: readonly ColorMode[] = ['light', 'dark', 'system'];

interface ThemeModeContextValue {
  mode: ColorMode;
  setMode: (mode: ColorMode) => void;
  /** The mode actually on screen once "system" is resolved. */
  resolvedMode: 'light' | 'dark';
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function readMode(): ColorMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return MODES.includes(saved as ColorMode) ? (saved as ColorMode) : 'light';
  } catch {
    return 'light';
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function ThemeModeProvider({children}: {children: ReactNode}) {
  const [mode, setModeState] = useState<ColorMode>(readMode);
  const [systemDark, setSystemDark] = useState(systemPrefersDark);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode: keep the choice for this session only */
    }
  }, []);

  // Follow the OS setting while the mode is "system".
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!query) return;
    const onChange = () => setSystemDark(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Keep the page background and browser UI (scrollbars, mobile address bar) in step.
  useEffect(() => {
    document.documentElement.style.colorScheme = mode === 'system' ? 'light dark' : mode;
  }, [mode]);

  const value = useMemo<ThemeModeContextValue>(
    () => ({
      mode,
      setMode,
      resolvedMode: mode === 'system' ? (systemDark ? 'dark' : 'light') : mode,
    }),
    [mode, setMode, systemDark],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <Theme theme={themes[defaultThemeSlug]} mode={mode}>
        {children}
      </Theme>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode(): ThemeModeContextValue {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeModeProvider');
  return ctx;
}
