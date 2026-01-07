import { Button } from "./ui/button";
import { Home, FileText, ClipboardList, LogOut, LogIn, Settings, Sun, Moon, Laptop } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

interface NavigationProps {
  currentPage:
    | "home"
    | "documents"
    | "applications"
    | "admin"
    | "theme-warm"
    | "theme-mono"
    | "theme-ocean";
  onNavigate: (
    page:
      | "home"
      | "documents"
      | "applications"
      | "admin"
      | "theme-warm"
      | "theme-mono"
      | "theme-ocean"
  ) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { user, isAuthenticated, login, logout, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleApplicationsClick = () => {
    if (!isAuthenticated) {
      login();
    } else {
      onNavigate("applications");
    }
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/ierp-bgremoved.png" alt="IERP Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl">Indian Empire RP</h1>
              <p className="text-xs text-muted-foreground">Law Enforcement Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={currentPage === "home" ? "default" : "ghost"}
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button
              variant={currentPage === "documents" ? "default" : "ghost"}
              onClick={() => onNavigate("documents")}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Documents
            </Button>
            
            {isAuthenticated && (
              <>
                <Button
                  variant={currentPage === "applications" ? "default" : "ghost"}
                  onClick={() => onNavigate("applications")}
                  className="flex items-center gap-2"
                >
                  <ClipboardList className="w-4 h-4" />
                  Applications
                </Button>
                {isAdmin && (
                  <Button
                    variant={currentPage === "admin" ? "default" : "ghost"}
                    onClick={() => onNavigate("admin")}
                    className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20"
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </Button>
                )}
              </>
            )}

            <div className="flex items-center gap-2 ml-4 pl-4 border-l">
              {/* Theme toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2" title="Theme">
                    {theme === "dark" ? (
                      <Moon className="w-4 h-4" />
                    ) : theme === "light" ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Laptop className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="w-4 h-4" /> Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="w-4 h-4" /> Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark-warm")}>Dark (Warm)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark-mono")}>Dark (Mono)</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark-ocean")}>Dark (Ocean)</DropdownMenuItem>
                  <div className="h-px my-1 bg-border" />
                  <DropdownMenuItem onClick={() => { setTheme("dark-warm"); onNavigate("theme-warm"); }}>Open Warm Theme Page</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setTheme("dark-mono"); onNavigate("theme-mono"); }}>Open Mono Theme Page</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setTheme("dark-ocean"); onNavigate("theme-ocean"); }}>Open Ocean Theme Page</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Laptop className="w-4 h-4" /> System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-2">
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={login}
                  title="Configure VITE_DISCORD_CLIENT_ID in .env to enable Discord login"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                  <LogIn className="w-4 h-4" />
                  Login with Discord
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}