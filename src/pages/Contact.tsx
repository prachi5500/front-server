import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { apiFetch } from "@/services/api";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) {
      toast("Please fill in all fields.");
      return;
    }
    try {
      setSubmitting(true);
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
      });
      toast("Thanks! We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      toast(err?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-6">
          Have questions or feature requests? Send us a message and we’ll respond shortly.
        </p>
        <form onSubmit={onSubmit} className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-[var(--shadow-card)]">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea id="contact-message" placeholder="How can we help?" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send Message"}</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
