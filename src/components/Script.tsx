import { useEffect } from 'react';

interface ScriptProps {
  src: string;
}

const Script = ({ src }: ScriptProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src]);

  return null;
};

export default Script;