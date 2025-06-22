
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";
import { ImageProvider } from "./context/ImageContext";

const queryClient = new QueryClient();

const PageTransition = () => {
  const location = useLocation();
  
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        timeout={400}
        classNames="page-transition"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ImageProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
            <PageTransition />
          </div>
        </BrowserRouter>
      </ImageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
