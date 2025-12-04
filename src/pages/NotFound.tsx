import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in">
        {/* Illustration */}
        <div className="w-40 h-40 mx-auto mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-soft" />
          <div className="absolute inset-4 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-7xl">🥬</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Oops! Looks like this page went out of stock. Let's get you back to fresh groceries.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="btn-primary-gradient gap-2 rounded-xl"
          >
            <Home className="w-4 h-4" />
            Back to Shop
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
