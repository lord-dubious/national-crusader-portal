import { NewsletterSection } from "./footer/NewsletterSection";
import { FooterLinks } from "./footer/FooterLinks";
import { SocialLinks } from "./footer/SocialLinks";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <NewsletterSection />
      <div className="container mx-auto px-4">
        <FooterLinks />
        <div className="border-t border-primary-foreground/10">
          <SocialLinks />
          <div className="py-6 text-center text-sm text-primary-foreground/70">
            © {new Date().getFullYear()} National Crusader. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};