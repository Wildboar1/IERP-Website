import React from "react";

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border text-muted-foreground py-6 px-4 flex flex-col md:flex-row items-center justify-between gap-4 mt-12">
      <div className="text-sm">Created by Preet Joshi © 2026. All rights reserved.</div>
      <div className="flex gap-4 text-xs">
        <a href="mailto:feedback@ierp.com" className="hover:underline">Feedback</a>
        <a href="/privacy" className="hover:underline">Privacy Policy</a>
        <a href="/terms" className="hover:underline">Terms of Service</a>
      </div>
    </footer>
  );
}
