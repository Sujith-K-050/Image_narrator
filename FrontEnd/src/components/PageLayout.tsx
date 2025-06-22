import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function PageLayout({
  children,
  className = "",
}: PageLayoutProps) {
  const location = useLocation();

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-6 md:p-12 ${className}`}
    >
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute h-full w-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)] -z-10" />
        <div
          className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 animate-spotlight"
          style={{
            filter: "blur(150px)",
          }}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto relative z-10">{children}</div>

      <div className="bottom-4 w-full flex justify-center text-xs text-gray-400 mt-5">
        <p className="font-light">
          Image Analyzer • {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
