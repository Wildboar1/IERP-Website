import React from "react";
import { FileText, Home, ClipboardList, Settings, Palette, Sun, Moon, LayoutDashboard } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-border p-4 space-y-2">
        <div className="flex items-center gap-2 mb-6">
          <img src="/ierp-bgremoved.png" alt="IERP Logo" className="h-10 w-10" />
          <div>
            <h1 className="text-lg font-bold leading-tight">IERP Guide</h1>
            <p className="text-xs text-muted-foreground">Law Enforcement Roleplay</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <a href="/" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <Home className="w-5 h-5" /> Home
          </a>
          <a href="/documents" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <FileText className="w-5 h-5" /> Legal Documents
          </a>
          <a href="/applications" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <ClipboardList className="w-5 h-5" /> Applications
          </a>
          <a href="/admin" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <LayoutDashboard className="w-5 h-5" /> Admin Dashboard
          </a>
          <div className="mt-4 mb-1 text-xs text-muted-foreground font-semibold px-3">Themes</div>
          <a href="/theme-warm" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <Sun className="w-5 h-5" /> Warm Theme
          </a>
          <a href="/theme-mono" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <Palette className="w-5 h-5" /> Mono Theme
          </a>
          <a href="/theme-ocean" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-accent">
            <Moon className="w-5 h-5" /> Ocean Theme
          </a>
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
            <button className="btn btn-sm">Theme</button>
          </div>
        </header>
        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
