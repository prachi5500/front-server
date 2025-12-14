import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-900 py-8 text-neutral-300 font-sans">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        {/* Mobile: 1 Column | Small Tablet: 2 Columns | Desktop: 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 text-sm">
          
          {/* Section 1: About */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-blue-400 font-semibold text-xs tracking-wider uppercase mb-4">About</h4>
            <ul className="space-y-2.5">
              <li><a className="hover:text-white transition-colors duration-200" href="#about">About Us</a></li>
              <li><a className="hover:text-white transition-colors duration-200" href="#contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Section 2: Help */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-blue-400 font-semibold text-xs tracking-wider uppercase mb-4">Help</h4>
            <ul className="space-y-2.5">
              <li><Link className="hover:text-white transition-colors duration-200" to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Section 3: Consumer Policy */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-blue-400 font-semibold text-xs tracking-wider uppercase mb-4">Consumer Policy</h4>
            <ul className="space-y-2.5">
              <li><Link className="hover:text-white transition-colors duration-200" to="/return-policy">Return Policy</Link></li>
              <li><Link className="hover:text-white transition-colors duration-200" to="/refund-policy">Refund Policy</Link></li>
              <li><Link className="hover:text-white transition-colors duration-200" to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link className="hover:text-white transition-colors duration-200" to="/terms">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Section 4: Social */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-blue-400 font-semibold text-xs tracking-wider uppercase mb-4">Social</h4>
            <ul className="flex items-center gap-4">
              <li>
                <a 
                  aria-label="Facebook" 
                  href="https://www.facebook.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center justify-center rounded-full p-2 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-all duration-200"
                >
                  <Facebook className="w-5 h-5" strokeWidth={2} />
                </a>
              </li>
              <li>
                <a 
                  aria-label="Twitter" 
                  href="https://www.twitter.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center justify-center rounded-full p-2 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-all duration-200"
                >
                  <Twitter className="w-5 h-5" strokeWidth={2} />
                </a>
              </li>
              <li>
                <a 
                  aria-label="Instagram" 
                  href="https://www.instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center justify-center rounded-full p-2 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-all duration-200"
                >
                  <Instagram className="w-5 h-5" strokeWidth={2} />
                </a>
              </li>
              <li>
                <a 
                  aria-label="LinkedIn" 
                  href="https://www.linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center justify-center rounded-full p-2 bg-neutral-800 hover:bg-neutral-700 hover:text-white transition-all duration-200"
                >
                  <Linkedin className="w-5 h-5" strokeWidth={2} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 py-6 mt-2 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-neutral-500 text-center md:text-left">
            © {new Date().getFullYear()} Business Card Creator. All rights reserved.
          </p>
          
          {/* Optional: Bottom small links if needed */}
          <div className="flex gap-4">
             <Link to="/privacy" className="hover:text-white">Privacy</Link>
             <Link to="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;