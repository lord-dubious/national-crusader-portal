import { NewsletterSection } from "./footer/NewsletterSection";
import { FooterLinks } from "./footer/FooterLinks";
import { SocialLinks } from "./footer/SocialLinks";

export const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <NewsletterSection />
      <div className="container mx-auto px-4">
        <FooterLinks />
        <div className="border-t border-white/10">
          <SocialLinks />
          <div className="py-6 text-center text-sm text-white/70">
            © {new Date().getFullYear()} National Crusader. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};