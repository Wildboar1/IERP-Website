import React, { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";

export function FeedbackForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send feedback to your backend or service
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold mb-2 text-green-700">Thank you for your feedback!</h3>
        <p className="text-green-800">We appreciate your input and will use it to improve our service.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 w-full max-w-xl mx-auto mt-12">
      <h3 className="text-lg font-semibold mb-2">Feedback</h3>
      <Input
        placeholder="Your Name (optional)"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Input
        type="email"
        placeholder="Your Email (optional)"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Textarea
        placeholder="Your feedback..."
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
        rows={4}
      />
      <Button type="submit" className="w-full mt-2">Submit Feedback</Button>
    </form>
  );
}
