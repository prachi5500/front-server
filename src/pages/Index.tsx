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
import { Search, Menu, X, User, ChevronDown, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [businessData, setBusinessData] = useState<BusinessCardData>({
    name: "", title: "", company: "", email: "", phone: "", website: "", address: "", logo: "",
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

  // Common nav link styles
  const navLinkClass = `px-5 py-2.5 ${isScrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'} hover:text-gray-900 rounded-full transition-all text-sm font-medium cursor-pointer`;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-md' : 'bg-black/0'
        }`}>
        <div className="flex items-center justify-between px-4 py-4 md:px-8 lg:px-12 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="BusinessCard"
              className="h-28 md:h-14 w-auto drop-shadow-lg"  // 40px on mobile, 56px on desktop
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Home, Services, Contact Links (Same as before) */}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={navLinkClass}
            >
              Home
            </a>
            <a
              href="#services"
              onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={navLinkClass}
            >
              Services
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={navLinkClass}
            >
              Contact
            </a>

            <div className="flex items-center gap-4">
              <Link to="/cart" className={navLinkClass}>
                Cart
              </Link>

              {user ? (
                <div className="relative">
                  {/* Dropdown Trigger Button (Icon + Name) */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center gap-2 ${isScrolled
                        ? 'text-gray-700 hover:text-gray-900'
                        : 'text-white hover:text-white/80'
                      } transition-colors focus:outline-none`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isScrolled
                        ? 'bg-gray-100 hover:bg-gray-200'
                        : 'bg-white/10 hover:bg-white/20'
                      } border ${isScrolled ? 'border-gray-200' : 'border-white/20'
                      }`}>
                      <User size={18} className={isScrolled ? 'text-gray-600' : 'text-white'} />
                    </div>
                    <span className={`font-medium text-sm ${isScrolled ? 'text-gray-700' : 'text-white'
                      }`}>
                      {profile?.name}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                        } ${isScrolled ? 'text-gray-600' : 'text-white'}`}
                    />
                  </button>
                  {/* Dropdown Menu Box */}
                  {isDropdownOpen && (
                    <div
                      className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 ${isScrolled ? 'bg-white' : 'bg-gray-800'
                        }`}
                    >
                      {/* Menu items */}
                      <Link
                        to="/my-orders"
                        className={`flex items-center gap-2 px-4 py-2 text-sm ${isScrolled
                            ? 'text-gray-700 hover:bg-gray-100 hover:text-black'
                            : 'text-gray-200 hover:bg-gray-700 hover:text-white'
                          } w-full`}
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <ShoppingBag size={16} />
                        Orders
                      </Link>

                      {/* Account */}
                      <Link
                        to="/my-account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black w-full"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User size={16} />
                        Account
                      </Link>

                      {/* Admin (Only if admin) */}
                      {profile?.role === "admin" && (
                        <Link
                          to="/admin/templates"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black w-full"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <LayoutDashboard size={16} />
                          Admin
                        </Link>
                      )}

                      <div className={`h-px my-1 mx-2 ${isScrolled ? 'bg-gray-200' : 'bg-gray-700'
                        }`}></div>
                        {/* Logout */}
                      <button
                        onClick={async () => {
                          setIsDropdownOpen(false);
                          await signOut();
                          navigate("/");
                        }}
                        className={`flex items-center gap-2 px-4 py-2 text-sm ${isScrolled
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                          } w-full text-left`}
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login">
                  <Button className="bg-white text-black hover:bg-white/90 font-semibold">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>


          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 mr-2 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-2xl border-t border-white/10">
            <div className="px-6 py-8 space-y-6">
              <a href="#services" onClick={(e) => { e.preventDefault(); document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="block text-white text-lg py-2">
                Services
              </a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }} className="block text-white text-lg py-2">
                Contact
              </a>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block text-white text-lg py-2">
                Cart
              </Link>
              {user ? (
                <>
                  <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="block text-white text-lg py-2">Orders</Link>
                  <Link to="/my-account" onClick={() => setMobileMenuOpen(false)} className="block text-white text-lg py-2">My Account</Link>
                  {profile?.role === "admin" && (
                    <Link to="/admin/templates" onClick={() => setMobileMenuOpen(false)} className="block text-white text-lg py-2">Admin Panel</Link>
                  )}
                  <Button onClick={async () => { await signOut(); navigate("/"); setMobileMenuOpen(false); }} className="w-full bg-white text-black hover:bg-gray-200">
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-white text-black hover:bg-gray-200">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <Hero id="hero" />
      <PaymentBanner />

      <main className="container mx-auto max-w-7xl px-4 py-12">
        <div className="w-full">
          <BusinessCardForm data={businessData} onChange={setBusinessData} />
        </div>

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
              <Textarea id="contact-message" placeholder="How can we help?" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows={5} />
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