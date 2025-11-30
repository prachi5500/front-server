import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { BusinessCardForm, BusinessCardData } from "@/components/BusinessCardForm";
import { TemplateSelector } from "@/components/TemplateSelector";
import { PaymentBanner } from "@/components/PaymentBanner";
import { PaymentFeatures } from "@/components/PaymentFeatures";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import Footer from "@/components/Footer";

const Index = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Contact form
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-md' : 'bg-black/0'}`}>
        <div className="relative flex items-center justify-between px-4 py-2 md:px-8 lg:px-12">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/ChatGPT Image Nov 14, 2025, 10_52_55 AM.png"
              alt="BusinessCard"
              className="h-8 md:h-10 w-auto drop-shadow-lg"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <a 
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className={`px-5 py-2.5 ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'} hover:text-gray-900 rounded-full transition-all text-sm font-medium cursor-pointer`}
            >
              Services
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className={`px-5 py-2.5 ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'} hover:text-gray-900 rounded-full transition-all text-sm font-medium cursor-pointer`}
            >
              Contact
            </a>
            <Link to="/cart" className={`px-5 py-2.5 ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'} hover:text-gray-900 rounded-full transition-all text-sm font-medium cursor-pointer`}>
              Cart
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
              {user && (
                <Link
                  to="/my-account"
                  className="rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 shadow-sm transition-all hover:shadow-md whitespace-nowrap"
                >
                  My Account
                </Link>
              )}
              {user ? (
                <>
                  <Link
                    to="/my-orders"
                    className="rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 border border-white/20 shadow-sm transition-all hover:shadow-md whitespace-nowrap"
                  >
                    Orders
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                  className="px-6 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all text-sm shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition-all text-sm shadow-lg"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/70 backdrop-blur-2xl border-t border-white/10">
            <div className="px-6 py-6 space-y-3">
              <div className="flex flex-col gap-4 mt-6">
                <a 
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-white/90 hover:text-white text-lg py-2 block"
                >
                  Services
                </a>
                <a 
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    setMobileMenuOpen(false);
                  }}
                  className="text-white/90 hover:text-white text-lg py-2 block"
                >
                  Contact
                </a>
                <Link to="/cart" className="text-white/90 hover:text-white text-lg py-2">
                  Cart
                </Link>
              </div>
              {user && (
                <>
                  <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-white/90 hover:text-white text-lg">
                    Orders
                  </Link>
                  <Link
                    to="/my-account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all text-center"
                  >
                    My Account
                  </Link>
                  {profile?.role === "admin" && (
                    <Link to="/admin/templates" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-white/90 hover:text-white text-lg">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 bg-white text-black rounded-xl font-semibold"
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 bg-white text-black rounded-xl font-semibold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <Hero />

      <PaymentBanner />

      <main className="container mx-auto max-w-7xl px-4 py-12">
        {/* Only Form - Full Width on Mobile, Single Column */}
        <div className="max-w-2xl mx-auto">
          <BusinessCardForm data={businessData} onChange={setBusinessData} />
        </div>

        {/* Templates */}
        <div id="classic-templates" className="mt-16">
          <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-card)] border border-border">
            <TemplateSelector data={businessData} />
          </div>
        </div>
      </main>

      <PaymentFeatures />

      {/* Contact Section */}
      <section id="contact" className="border-t border-border bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-16 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Contact Us</h2>
            <p className="text-muted-foreground">
              Have questions or feature requests? Send us a message and we’ll respond shortly.
            </p>
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
              <Textarea
                id="contact-message"
                placeholder="How can we help?"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows={5}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;