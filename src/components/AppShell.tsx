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
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-border p-4 space-y-2">
        <div className="flex items-center gap-2 mb-6">
          <img src="/ierp-bgremoved.png" alt="IERP Logo" className="h-10 w-10" />
          <div>
            <h1 className="text-lg font-bold leading-tight">IERP Law</h1>
            <p className="text-xs text-muted-foreground">Law Enforcement Roleplay</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <Home className="w-5 h-5" /> Home
          </Link>
          <Link to="/documents" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <FileText className="w-5 h-5" /> Legal Documents
          </Link>
          <Link to="/applications" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <ClipboardList className="w-5 h-5" /> Applications
          </Link>
          <Link to="/department-officials" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <Users className="w-5 h-5" /> Department Officials
          </Link>
          <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <LayoutDashboard className="w-5 h-5" /> Admin Dashboard
          </Link>
        </nav>
        <div className="mt-auto text-xs text-muted-foreground">Made by ...</div>
      </aside>
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="flex items-center justify-between h-16 px-4 border-b border-border bg-sidebar/80 backdrop-blur sticky top-0 z-40">
          <div className="flex-1 flex items-center">
            <input
              type="text"
              placeholder="Search codes, procedures..."
              className="w-full max-w-md px-3 py-2 rounded bg-background border border-border text-foreground"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="btn btn-sm">Start Learning</button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="btn btn-sm flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  {theme === "lspd" && "LSPD"}
                  {theme === "warm" && "Warm"}
                  {theme === "mono" && "Mono"}
                  {theme === "ocean" && "Ocean"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleThemeChange("lspd")}>LSPD</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("warm")}>Warm</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("mono")}>Mono</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleThemeChange("ocean")}>Ocean</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
