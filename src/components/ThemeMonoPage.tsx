import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export function ThemeMonoPage() {
  const { setTheme } = useTheme();
  useEffect(() => { setTheme("dark-mono"); }, [setTheme]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Mono Theme</h1>
      <p className="text-muted-foreground mb-6">Desaturated, neutral accents for a pure monochrome feel.</p>
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
  );
}
