'use client';

import { useEffect } from 'react';

export function ForceBlueTheme() {
  useEffect(() => {
    document.documentElement.classList.add('theme-blue');
    return () => {
      document.documentElement.classList.remove('theme-blue');
    }
  }, []);

  return null;
}
