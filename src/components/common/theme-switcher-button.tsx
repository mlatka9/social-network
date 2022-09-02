import clsx from 'clsx';
import { useTheme } from 'next-themes';

interface ThemeSwitcherButtonProps {
  label: 'system' | 'light' | 'dark';
}
const ThemeSwitcherButton = ({ label }: ThemeSwitcherButtonProps) => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      className={clsx(
        'rounded-md  dark:text-primary-dark-800 capitalize p-2',
        theme === label &&
          'bg-primary-200 dark:bg-primary-dark-200  text-neutral-800'
      )}
      onClick={() => setTheme(label)}
    >
      {label}
    </button>
  );
};

export default ThemeSwitcherButton;
