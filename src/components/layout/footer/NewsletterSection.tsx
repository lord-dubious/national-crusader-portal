import { Button } from "@/components/ui/button";

export const NewsletterSection = () => {
  return (
    <div className="w-full bg-accent/5 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary animate-fade-down">
            Stay Informed, Stay Ahead
          </h3>
          <p className="text-muted-foreground mb-6 animate-fade-up">
            Subscribe to our newsletter for breaking news and exclusive stories
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};