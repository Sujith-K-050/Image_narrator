
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="text-center animate-fade-up">
        <h1 className="text-6xl font-bold mb-8">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for can't be found.
        </p>
        <Link to="/">
          <Button className="group flex items-center gap-2 transition-all duration-300 hover:gap-3">
            <Home className="h-4 w-4" />
            <span>Return to Home</span>
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default NotFound;
