
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, profile, isLoading } = useAuth();

  // Redirect authenticated users to appropriate dashboard
  React.useEffect(() => {
    if (isAuthenticated && !isLoading && profile) {
      const dashboardPath = profile?.role === 'superadmin' ? '/dashboard/admin' : '/dashboard/user';
      console.log(`User authenticated, redirecting to ${dashboardPath}`);
      navigate(dashboardPath, { replace: true });
    }
  }, [isAuthenticated, profile, navigate, isLoading]);

  // Don't render anything while checking auth state
  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 bg-kira-purple w-20 h-20 rounded-xl flex items-center justify-center">
          <span className="text-4xl font-bold text-white">K</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-kira-purple to-kira-blue bg-clip-text text-transparent">
          KIRA AI
        </h1>
        <p className="text-slate-400 mt-2">
          AI-ассистент с задачами, заметками, календарем и MiniApps
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          size="lg" 
          className="bg-kira-purple hover:bg-kira-purple/90"
          onClick={() => navigate('/auth')}
        >
          Начать работу
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => navigate('/auth')}
        >
          Войти в систему
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
