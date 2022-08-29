import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 text-sm">
      <button
        className={clsx(
          "rounded-sm  dark:text-primary-dark-800",
          theme === "system" &&
            "bg-slate-200 dark:bg-primary-dark-200  text-neutral-800"
        )}
        onClick={() => setTheme("system")}
      >
        System
      </button>
      <button
        className={clsx(
          "rounded-sm  dark:text-primary-dark-800",
          theme === "dark" &&
            "bg-slate-200 dark:bg-primary-dark-200 text-neutral-800"
        )}
        onClick={() => setTheme("dark")}
      >
        Dark
      </button>
      <button
        className={clsx(
          "rounded-sm  dark:text-primary-dark-800",
          theme === "light" &&
            "bg-slate-200 dark:bg-primary-dark-200 text-neutral-800"
        )}
        onClick={() => setTheme("light")}
      >
        Light
      </button>
    </div>
  );
};

export default ThemeSwitch;
