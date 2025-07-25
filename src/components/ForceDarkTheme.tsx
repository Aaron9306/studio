'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ForceBlueTheme() {
  const { setTheme } = useTheme();

  useEffect(() => {
    // This is a bit of a hack to apply the blue theme.
    // We set the dark theme, but we've styled .dark in globals.css to be our blue theme.
    document.documentElement.classList.add('theme-blue');
    return () => {
      document.documentElement.classList.remove('theme-blue');
    }
  }, []);

  return null;
}
