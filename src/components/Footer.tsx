import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
   <footer className="border-t border-neutral-800 bg-neutral-900 py-8 mt-16 text-neutral-300">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 py-6 text-sm">
            <div>
              <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">About</h4>
              <ul className="space-y-2">
                <li><a className="hover:text-white" href="#about">About Us</a></li>
                <li><a className="hover:text-white" href="#contact">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Help</h4>
              <ul className="space-y-2">
                <li><Link className="hover:text-white" to="/faq">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Consumer Policy</h4>
              <ul className="space-y-2">
                <li><Link className="hover:text-white" to="/return-policy">Return Policy</Link></li>
                <li><Link className="hover:text-white" to="/refund-policy">Refund Policy</Link></li>
                <li><Link className="hover:text-white" to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link className="hover:text-white" to="/terms">Terms of Use</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">Social</h4>
              <ul className="flex items-center gap-4">
                <li>
                  <a aria-label="Facebook" href="https://www.facebook.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full p-2 hover:bg-neutral-800">
                    <Facebook className="w-5 h-5" strokeWidth={2.5} />
                  </a>
                </li>
                <li>
                  <a aria-label="Twitter" href="https://www.twitter.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full p-2 hover:bg-neutral-800">
                    <Twitter className="w-5 h-5" strokeWidth={2.5} />
                  </a>
                </li>
                <li>
                  <a aria-label="Instagram" href="https://www.instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full p-2 hover:bg-neutral-800">
                    <Instagram className="w-5 h-5" strokeWidth={2.5} />
                  </a>
                </li>
                <li>
                  <a aria-label="LinkedIn" href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full p-2 hover:bg-neutral-800">
                    <Linkedin className="w-5 h-5" strokeWidth={2.5} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-800 py-4 flex items-center justify-start text-xs">
            <p className="text-neutral-400">© 2025 Business Card Creator</p>
          </div>
        </div>
      </footer>
  );
};

export default Footer;