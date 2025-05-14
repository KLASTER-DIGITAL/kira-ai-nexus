
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Rocket, Loader2 } from 'lucide-react';

interface DeployDocButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
}

const DeployDocButton: React.FC<DeployDocButtonProps> = ({ 
  variant = 'outline' 
}) => {
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    setIsDeploying(true);
    toast({
      title: "Запуск деплоя...",
      description: "Начинается развертывание документации в Mintlify",
    });

    try {
      // In a real implementation, this would call an API endpoint
      // For demo purposes, we're simulating the deployment with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // After successful deployment (simulated)
      localStorage.setItem('docsLastDeploy', Date.now().toString());
      
      toast({
        title: "Деплой успешно запущен!",
        description: "Документация будет доступна в Mintlify в течение нескольких минут",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Ошибка деплоя",
        description: "Не удалось выполнить деплой документации. Попробуйте позже.",
        variant: "destructive",
      });
      console.error("Deployment error:", error);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <Button 
      variant={variant}
      onClick={handleDeploy}
      disabled={isDeploying}
      className="flex items-center gap-2"
    >
      {isDeploying ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Rocket size={16} />
      )}
      {isDeploying ? "Деплой..." : "Деплой в Mintlify"}
    </Button>
  );
};

export default DeployDocButton;
