import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

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

export function ThemeWarmPage() {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme("dark-warm"); }, [setTheme]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Warm Theme</h1>
      <p className="text-muted-foreground mb-6">Amber-accented dark theme for a cozy look.</p>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h3 className="text-xl">Sample Card</h3>
          <p className="text-sm">This card reflects the warm accent colors.</p>
          <Button>Primary Action</Button>
        </Card>
        <Card className="p-6 space-y-4">
          <h3 className="text-xl">Another Card</h3>
          <Button variant="outline">Secondary</Button>
        </Card>
      </div>
    </div>
  );
}


