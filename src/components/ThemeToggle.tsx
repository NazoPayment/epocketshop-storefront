import {Moon, Sun} from 'lucide-react';
import {Icon} from '@astryxdesign/core/Icon';
import {IconButton} from '@astryxdesign/core/IconButton';
import {useThemeMode} from '@/contexts/ThemeModeContext';

/** Quick light / dark switch. */
export function ThemeToggle() {
  const {resolvedMode, setMode} = useThemeMode();
  const isDark = resolvedMode === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <IconButton
      label={label}
      tooltip={label}
      variant="ghost"
      icon={<Icon icon={isDark ? Sun : Moon} />}
      onClick={() => setMode(isDark ? 'light' : 'dark')}
    />
  );
}
