import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system" | "dark-warm" | "dark-mono" | "dark-ocean";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const customClasses = ["theme-warm", "theme-mono", "theme-ocean"] as const;

  // Reset custom theme classes
  for (const cls of customClasses) root.classList.remove(cls);

  const isDarkBase = theme === "dark" || theme.startsWith("dark-") || (theme === "system" && prefersDark);
  root.classList.toggle("dark", isDarkBase);

  // Apply preset accents on top of dark
  if (theme === "dark-warm") root.classList.add("theme-warm");
  if (theme === "dark-mono") root.classList.add("theme-mono");
  if (theme === "dark-ocean") root.classList.add("theme-ocean");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved ?? "system";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
  }, [theme]);

  const value = useMemo(
    () => ({ theme, setTheme: (t: Theme) => setThemeState(t) }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
