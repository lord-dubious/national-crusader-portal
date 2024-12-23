import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SCRIPTS = [
  {
    id: "jquery",
    src: "https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.js",
  },
  {
    id: "jquery-ui",
    src: "https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js",
    depends: "jquery",
  },
  {
    id: "three",
    src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
  },
  {
    id: "pdf",
    src: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js",
  },
  {
    id: "html2canvas",
    src: "https://raw.githack.com/Showkiip/3d-flipbook-jquery/main/3d-flip-book/js/html2canvas.min.js",
  },
  {
    id: "flip-book",
    src: "https://raw.githack.com/Showkiip/3d-flipbook-jquery/main/3d-flip-book/js/3d-flip-book.min.js",
    depends: ["jquery", "jquery-ui", "three", "pdf", "html2canvas"],
  },
];

export const useScriptLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadedScripts = new Set<string>();

    const loadScript = async (script: typeof SCRIPTS[0]) => {
      if (document.getElementById(script.id)) {
        loadedScripts.add(script.id);
        return;
      }

      const element = document.createElement("script");
      element.id = script.id;
      element.src = script.src;
      element.async = true;

      const loadPromise = new Promise((resolve, reject) => {
        element.onload = resolve;
        element.onerror = reject;
      });

      document.body.appendChild(element);
      await loadPromise;
      loadedScripts.add(script.id);
    };

    const loadScripts = async () => {
      try {
        setIsLoading(true);
        for (const script of SCRIPTS) {
          if (script.depends) {
            const dependencies = Array.isArray(script.depends) ? script.depends : [script.depends];
            const allDependenciesLoaded = dependencies.every(dep => loadedScripts.has(dep));
            if (!allDependenciesLoaded) {
              continue;
            }
          }
          await loadScript(script);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading scripts:", err);
        setError(err instanceof Error ? err : new Error("Failed to load scripts"));
        toast({
          variant: "destructive",
          title: "Error Loading PDF Viewer",
          description: "Could not initialize the PDF viewer"
        });
      }
    };

    loadScripts();

    return () => {
      // Cleanup scripts on unmount
      SCRIPTS.forEach(script => {
        const element = document.getElementById(script.id);
        if (element) {
          document.body.removeChild(element);
        }
      });
    };
  }, [toast]);

  return { isLoading, error };
};