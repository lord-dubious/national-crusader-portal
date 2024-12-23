import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Newspaper } from "lucide-react";
import { useEffect } from "react";

declare global {
  interface Window {
    DFlip: any;
  }
}

export const NewspaperSection = () => {
  const { toast } = useToast();
  const { 
    data: newspapers, 
    error, 
    isLoading 
  } = useQuery({
    queryKey: ["newspapers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newspapers")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching newspapers",
          description: error.message
        });
        console.error("Newspapers fetch error:", error);
        throw error;
      }
      console.log("Fetched newspapers:", data);
      return data;
    },
  });

  useEffect(() => {
    // Load DearFlip script
    const script = document.createElement("script");
    script.src = "https://cdn.dearflip.com/dearflip.js";
    script.async = true;
    document.body.appendChild(script);

    // Load DearFlip CSS
    const link = document.createElement("link");
    link.href = "https://cdn.dearflip.com/dearflip.css";
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (newspapers && window.DFlip) {
      console.log("Initializing DFlip for newspapers:", newspapers);
      newspapers.forEach((newspaper, index) => {
        console.log(`Creating DFlip instance for newspaper ${index}:`, newspaper);
        try {
          new window.DFlip(`#df-newspaper-${index}`, {
            webgl: true,
            height: 400,
            duration: 800,
            direction: 1,
            backgroundColor: "rgb(241, 241, 241)",
            soundEnable: true,
            autoEnableOutline: true,
            enableDownload: false,
            source: newspaper.pdf_url,
            autoPlay: false,
            autoPlayStart: false,
          });
        } catch (err) {
          console.error(`Error initializing DFlip for newspaper ${index}:`, err);
          toast({
            variant: "destructive",
            title: "Newspaper Viewer Error",
            description: `Could not load newspaper ${newspaper.title}`
          });
        }
      });
    }
  }, [newspapers, toast]);

  if (isLoading) {
    return (
      <section className="py-12 bg-muted animate-fade-up">
        <div className="container mx-auto text-center">
          Loading newspapers...
        </div>
      </section>
    );
  }

  if (error || !newspapers?.length) {
    console.log("No newspapers found or error occurred", { error, newspapers });
    return null;
  }

  return (
    <section className="py-12 bg-muted animate-fade-up">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Newspaper className="h-6 w-6 text-accent mr-2" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Latest Newspapers</h2>
          <div className="h-1 bg-accent flex-grow ml-4 rounded hidden sm:block" />
        </div>
        <div className="flex overflow-x-auto gap-8 pb-4 -mx-4 px-4">
          {newspapers.map((newspaper, index) => (
            <div 
              key={newspaper.id}
              className="flex-none w-[300px]"
            >
              <div 
                id={`df-newspaper-${index}`}
                className="dearflip-volume"
                style={{ width: "100%", height: "400px" }}
              />
              <h3 className="mt-4 font-medium text-lg">{newspaper.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(newspaper.published_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};