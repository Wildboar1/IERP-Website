import React from "react";
import { FileText, Home, ClipboardList, Settings, Palette, Sun, Moon, LayoutDashboard, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { Link } from "react-router-dom";

export function AppShell({ children }: { children: React.ReactNode }) {
  // Theme state (for demo, replace with context or global state as needed)
  const [theme, setTheme] = useState("lspd");

  const handleThemeChange = (themeKey: string) => {
    setTheme(themeKey);
    // TODO: Integrate with actual theme switching logic (context, CSS vars, etc.)
    document.body.setAttribute("data-theme", themeKey);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground items-center justify-center">
      {/* Maintenance Banner Only */}
      <div className="w-full bg-yellow-400 text-black py-8 px-4 flex flex-col items-center justify-center gap-4 z-50 text-center font-semibold shadow-lg min-h-screen">
        <span className="text-2xl">Website Status: <span className="font-bold">Under Maintenance</span></span>
        <span className="text-lg">Join our Discord to apply and open a ticket.</span>
        <a
          href="https://discord.gg/qwcvpDKABe"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-indigo-700 text-white rounded shadow hover:bg-indigo-800 transition text-lg font-bold"
        >
          Join Discord
        </a>
      </div>
    </div>
  );
}
