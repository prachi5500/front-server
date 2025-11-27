import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const { signOut, profile } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Top Navigation for Mobile */}
      <div className="lg:hidden sticky top-0 z-40 bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-semibold text-lg">Admin</Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar - Desktop and Mobile Dropdown */}
      <aside className={`${
        mobileMenuOpen ? "block" : "hidden"
      } lg:block lg:w-64 border-b lg:border-b-0 lg:border-r p-4 flex flex-col bg-background/50`}>
        <div className="flex items-center justify-between lg:block">
          <Link to="/" className="font-semibold hidden lg:block">Home</Link>
        </div>
        <nav className="mt-4 lg:mt-6 space-y-2">
          <Link
            to="/admin/templates"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded hover:bg-muted font-medium"
          >
            Templates
          </Link>
          <Link
            to="/admin/payments"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded hover:bg-muted font-medium"
          >
            Payments
          </Link>
          <Link
            to="/admin/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded hover:bg-muted font-medium"
          >
            Contact
          </Link>
        </nav>
        <div className="mt-auto pt-4 border-t flex items-center justify-between gap-2">
          <span className="text-sm text-muted-foreground">{profile?.role}</span>
          <button className="border rounded px-3 py-1 text-sm hover:bg-muted transition-all" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 w-full">
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
