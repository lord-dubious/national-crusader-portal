import { Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button"; // Add this import

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm text-gray-300">
              National Crusader delivers the latest news with integrity and precision.
              Our commitment to truth and accuracy sets us apart in today's fast-paced
              media landscape.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <a href="/politics" className="text-sm hover:text-accent transition-colors">
                  Politics
                </a>
              </li>
              <li>
                <a href="/business" className="text-sm hover:text-accent transition-colors">
                  Business
                </a>
              </li>
              <li>
                <a href="/technology" className="text-sm hover:text-accent transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="/culture" className="text-sm hover:text-accent transition-colors">
                  Culture
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-sm hover:text-accent transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-sm hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm hover:text-accent transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Subscribe to our newsletter</h4>
              <form className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-white/10 rounded border border-white/20 text-sm placeholder:text-white/50"
                />
                <Button className="bg-accent hover:bg-accent/90">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} National Crusader. All rights reserved.
        </div>
      </div>
    </footer>
  );
};