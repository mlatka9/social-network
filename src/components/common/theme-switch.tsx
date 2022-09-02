import { useState, useEffect } from 'react';
import ThemeSwitcherButton from './theme-switcher-button';

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 text-sm">
      <ThemeSwitcherButton label="light" />
      <ThemeSwitcherButton label="dark" />
      <ThemeSwitcherButton label="system" />
    </div>
  );
};

export default ThemeSwitch;
