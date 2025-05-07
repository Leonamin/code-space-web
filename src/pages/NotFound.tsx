
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF9]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-4">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <p className="text-gray-500 mb-6">
          The path <code className="bg-secondary p-1 rounded">{location.pathname}</code> was not found.
        </p>
        <Button onClick={() => window.location.href = "/"} className="bg-accent hover:bg-accent/90">
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
