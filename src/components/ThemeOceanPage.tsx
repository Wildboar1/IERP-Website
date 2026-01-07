import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { GlobalFeedbackSection } from "./ui/global-feedback-section";

export function ThemeOceanPage() {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme("dark-ocean"); }, [setTheme]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-[#1e293b] text-foreground flex flex-col">
      <main className="flex-1">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4">Ocean Theme</h1>
          <p className="text-muted-foreground mb-6">Cool cyan/blue accented dark theme.</p>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="p-6 space-y-4">
              <h3 className="text-xl">Sample Card</h3>
              <Button>Primary Action</Button>
            </Card>
            <Card className="p-6 space-y-4">
              <h3 className="text-xl">Another Card</h3>
              <Button variant="outline">Secondary</Button>
            </Card>
          </div>
        </div>
      </main>
      <GlobalFeedbackSection />
    </div>
  );
}
