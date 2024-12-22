import { useEffect } from "react";

interface ScriptProps {
  src: string;
  onLoad?: () => void;
}

const Script = ({ src, onLoad }: ScriptProps) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    if (onLoad) {
      script.onload = onLoad;
    }
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [src, onLoad]);

  return null;
};

export default Script;