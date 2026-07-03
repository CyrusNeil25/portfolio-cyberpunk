import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('portfolio-theme') || 'cyber'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'cyber' ? 'nebula' : 'cyber'));

  return { theme, toggle };
}
