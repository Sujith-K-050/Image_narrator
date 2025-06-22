
import { ReactNode } from "react";

interface AnimatedChipProps {
  children: ReactNode;
  delay?: number;
}

export default function AnimatedChip({ children, delay = 0 }: AnimatedChipProps) {
  return (
    <div 
      className="inline-block px-3 py-1 rounded-full bg-white/80 border border-gray-100 shadow-sm text-sm animate-scale-in"
      style={{ 
        animationDelay: `${delay}ms`,
        opacity: 0,
        animationFillMode: "forwards" 
      }}
    >
      {children}
    </div>
  );
}
