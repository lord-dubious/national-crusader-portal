import { useState, useEffect } from 'react';

export const useScriptLoader = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    let jQueryScript: HTMLScriptElement | null = null;
    let turnScript: HTMLScriptElement | null = null;

    const loadScripts = async () => {
      try {
        // Load jQuery first
        jQueryScript = document.createElement('script');
        jQueryScript.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
        await new Promise<void>((resolve, reject) => {
          if (jQueryScript) {
            jQueryScript.onload = () => resolve();
            jQueryScript.onerror = () => reject();
            document.body.appendChild(jQueryScript);
          }
        });

        // Then load turn.js
        turnScript = document.createElement('script');
        turnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/turn.js/3.0.0/turn.min.js';
        await new Promise<void>((resolve, reject) => {
          if (turnScript) {
            turnScript.onload = () => resolve();
            turnScript.onerror = () => reject();
            document.body.appendChild(turnScript);
          }
        });

        setScriptsLoaded(true);
      } catch (error) {
        console.error('Error loading scripts:', error);
      }
    };

    loadScripts();

    return () => {
      if (jQueryScript) document.body.removeChild(jQueryScript);
      if (turnScript) document.body.removeChild(turnScript);
    };
  }, []);

  return { scriptsLoaded };
};