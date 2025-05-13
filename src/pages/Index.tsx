
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the landing page
    navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center">
        <div className="bg-kira-purple w-16 h-16 rounded-md flex items-center justify-center text-white font-bold text-3xl mb-4">
          K
        </div>
        <p className="text-xl text-muted-foreground">Loading KIRA AI...</p>
      </div>
    </div>
  );
};

export default Index;
