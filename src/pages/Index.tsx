import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { BusinessCardForm, BusinessCardData } from "@/components/BusinessCardForm";
import { TemplateSelector } from "@/components/TemplateSelector";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { PaymentBanner } from "@/components/PaymentBanner";
import { PaymentFeatures } from "@/components/PaymentFeatures";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Facebook, Twitter, Instagram, Linkedin, Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [businessData, setBusinessData] = useState<BusinessCardData>({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    logo: "",
  });

  const [selectedFont, setSelectedFont] = useState<string>("Arial, sans-serif");
  const [fontSize, setFontSize] = useState<number>(16);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [accentColor, setAccentColor] = useState<string>("#0ea5e9");

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      toast("Please fill in all fields.");
      return;
    }
    try {
      setSubmitting(true);
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage }),
      });
      toast("Thanks! We'll get back to you soon.");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (err: any) {
      toast(err?.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-transparent">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/10 dark:bg-neutral-900/40 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-4 py-2">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/ChatGPT Image Nov 14, 2025, 10_52_55 AM.png" alt="BusinessCard" className="h-10 sm:h-14 w-auto select-none" />
            </Link>
            <div className="hidden md:flex flex-1 justify-center px-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                <Input
                  type="search"
                  placeholder="Search templates..."
                  aria-label="Search"
                  className="pl-10 rounded-full bg-white/10 border-white/20 placeholder-white/60 focus-visible:ring-0 focus:bg-white/15"
                />
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/cart"
                className="rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 shadow-sm transition-all hover:shadow-md whitespace-nowrap"
              >
                Cart
              </Link>
              {user ? (
                <>
                  <Link
                    to="/my-orders"
                    className="rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 shadow-sm transition-all hover:shadow-md whitespace-nowrap"
                  >
                    Orders
                  </Link>
                  {profile?.role === "admin" && (
                    <Link
                      to="/admin/templates"
                      className="rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 shadow-sm transition-all hover:shadow-md whitespace-nowrap"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate("/");
                    }}
                    className="rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 shadow-sm transition-all hover:shadow-md whitespace-nowrap"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 shadow-sm transition-all hover:shadow-md whitespace-nowrap"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-3 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 space-y-2">
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
              >
                Cart
              </Link>
              {user ? (
                <>
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
                  >
                    Orders
                  </Link>
                  {profile?.role === "admin" && (
                    <Link
                      to="/admin/templates"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      <Hero />
      <PaymentBanner />

      <main className="container mx-auto max-w-7xl px-4 py-12">
        {/* Form + Customization */}
      
          <div>
            <BusinessCardForm data={businessData} onChange={setBusinessData} />
          </div>

            {/* Customization Panel */}
            {/* <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
              <CustomizationPanel
                selectedFont={selectedFont}
                onFontSelect={setSelectedFont}
                fontSize={fontSize}
                onFontSizeChange={setFontSize}
                textColor={textColor}
                onTextColorChange={setTextColor}
                accentColor={accentColor}
                onAccentColorChange={setAccentColor}
              />
            </div> */}
        
      

        {/* Classic Templates Only */}
        <div id="classic-templates" className="animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
          <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border">
            <TemplateSelector
              data={businessData}
              selectedFont={selectedFont}
              fontSize={fontSize}
              textColor={textColor}
              accentColor={accentColor}
            />
          </div>
        </div>

      {/* Payment Features */}
      <PaymentFeatures />


      {/* Contact Section */}
      <section id="contact" className="border-t border-border bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Contact Us</h2>
            <p className="text-muted-foreground">Have questions or feature requests? Send us a message and we’ll respond shortly.</p>
          </div>
          <form onSubmit={handleContactSubmit} className="space-y-4 bg-card p-6 rounded-xl border border-border shadow-[var(--shadow-card)]">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" placeholder="Your name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" placeholder="you@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" placeholder="How can we help?" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows={5} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send Message"}</Button>
            </div>
          </form>
        </div>
      </section>

      {/* Import and use the Footer component */}
      <Footer />

    </div>
  );
};

export default Index;