import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Newspaper } from "lucide-react";
import Script from "@/components/ui/script";

declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

export const NewspaperSection = () => {
  const [selectedNewspaper, setSelectedNewspaper] = useState<string | null>(null);
  const [flipBookInitialized, setFlipBookInitialized] = useState(false);

  const { data: newspapers } = useQuery({
    queryKey: ["published-newspapers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newspapers")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    // Load jQuery and dFlip scripts
    const loadScripts = async () => {
      if (!window.jQuery) {
        await import('jquery').then(jquery => {
          window.jQuery = window.$ = jquery.default;
        });
      }
      
      if (!flipBookInitialized && window.jQuery) {
        const dflipScript = document.createElement('script');
        dflipScript.src = 'https://cdn.jsdelivr.net/gh/deepak-ghimire/dearflip-jquery-flipbook/dflip/js/dflip.min.js';
        dflipScript.async = true;
        
        const dflipCss = document.createElement('link');
        dflipCss.rel = 'stylesheet';
        dflipCss.href = 'https://cdn.jsdelivr.net/gh/deepak-ghimire/dearflip-jquery-flipbook/dflip/css/dflip.min.css';
        
        const dflipUiCss = document.createElement('link');
        dflipUiCss.rel = 'stylesheet';
        dflipUiCss.href = 'https://cdn.jsdelivr.net/gh/deepak-ghimire/dearflip-jquery-flipbook/dflip/css/themify-icons.min.css';
        
        document.head.appendChild(dflipCss);
        document.head.appendChild(dflipUiCss);
        document.body.appendChild(dflipScript);
        
        dflipScript.onload = () => {
          setFlipBookInitialized(true);
        };
      }
    };
    
    loadScripts();
  }, [flipBookInitialized]);

  useEffect(() => {
    if (selectedNewspaper && flipBookInitialized && window.jQuery) {
      const flipBookContainer = document.getElementById('flipbook');
      if (flipBookContainer) {
        // Destroy existing flipbook instance if any
        if (window.jQuery(flipBookContainer).data('dflip')) {
          window.jQuery(flipBookContainer).data('dflip').destroy();
        }

        // Initialize new flipbook
        window.jQuery(flipBookContainer).html('');
        window.jQuery(flipBookContainer).dflip({
          source: selectedNewspaper,
          height: 800,
          duration: 800,
          autoEnableOutline: true,
          webgl: true,
          mobileAutoEnable: true,
          transparent: false,
          hard: "none",
          pageSize: "auto",
          backgroundColor: "rgb(34, 34, 34)",
          autoPlay: false,
          autoPlayDuration: 3000,
          soundEnable: false,
        });
      }
    }
  }, [selectedNewspaper, flipBookInitialized]);

  return (
    <section className="py-12 bg-[#222222]">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Newspaper className="h-6 w-6 text-[#DC2626] mr-2" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Digital Newspapers</h2>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {newspapers?.map((newspaper) => (
              <div
                key={newspaper.id}
                onClick={() => setSelectedNewspaper(newspaper.pdf_url)}
                className="cursor-pointer group"
              >
                <div className="w-48 h-64 bg-[#333333] rounded-lg overflow-hidden transition-transform transform group-hover:scale-105">
                  <iframe
                    src={`${newspaper.pdf_url}#page=1&toolbar=0`}
                    className="w-full h-full pointer-events-none"
                    title={newspaper.title}
                  />
                </div>
                <p className="mt-2 text-white text-center text-sm truncate">
                  {newspaper.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedNewspaper && (
          <div 
            id="flipbook" 
            className="mt-8 bg-[#333333] rounded-lg overflow-hidden"
            style={{ height: selectedNewspaper ? '800px' : '0' }}
          />
        )}
      </div>
    </section>
  );
};