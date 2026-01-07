import { MessageSquare } from "lucide-react";
import { Button } from "./button";

export function GlobalFeedbackSection() {
  return (
    <section className="w-full py-16 px-4 flex flex-col items-center bg-gradient-to-b from-background/80 to-background/95 border-t border-border">
      <div className="flex flex-col items-center max-w-2xl w-full">
        <MessageSquare className="w-12 h-12 mb-4 text-primary" />
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Help Us Improve</h2>
        <p className="text-lg text-muted-foreground mb-6 text-center">
          Your feedback is invaluable in making this guide better for the entire community. Share your thoughts, report issues, or suggest new features.
        </p>
        <Button size="lg" variant="outline" className="text-base px-8 py-3">
          <MessageSquare className="w-5 h-5 mr-2" /> Share Feedback
        </Button>
      </div>
    </section>
  );
}
