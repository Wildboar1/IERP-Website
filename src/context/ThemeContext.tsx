import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme =
  | "light"
  | "dark"
  | "system"
  | "dark-warm"
  | "dark-mono"
  | "dark-ocean"
  | "lspd"
  | "saspr"
  | "bcso"
  | "police-red"
  | "sasp";


interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}


const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const customClasses = [
    "theme-warm",
    "theme-mono",
    "theme-ocean",
    "theme-lspd",
    "theme-saspr",
    "theme-bcso",
    "theme-police-red",
    "theme-sasp",
  ] as const;

  // Reset custom theme classes
  for (const cls of customClasses) root.classList.remove(cls);

  // Department themes are all dark base
  const isDarkBase =
    theme === "dark" ||
    theme.startsWith("dark-") ||
    ["lspd", "saspr", "bcso", "police-red", "sasp"].includes(theme) ||
    (theme === "system" && prefersDark);
  root.classList.toggle("dark", isDarkBase);

  // Apply preset accents on top of dark
  if (theme === "dark-warm") root.classList.add("theme-warm");
  if (theme === "dark-mono") root.classList.add("theme-mono");
  if (theme === "dark-ocean") root.classList.add("theme-ocean");
  if (theme === "lspd") root.classList.add("theme-lspd");
  if (theme === "saspr") root.classList.add("theme-saspr");
  if (theme === "bcso") root.classList.add("theme-bcso");
  if (theme === "police-red") root.classList.add("theme-police-red");
  if (theme === "sasp") root.classList.add("theme-sasp");
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
