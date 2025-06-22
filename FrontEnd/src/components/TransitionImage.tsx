
import { useState } from "react";

interface TransitionImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function TransitionImage({ src, alt, className = "" }: TransitionImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 image-placeholder rounded-xl" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
