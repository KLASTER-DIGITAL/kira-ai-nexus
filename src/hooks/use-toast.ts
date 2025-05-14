
// В зависимости от вашей настройки, вы можете использовать sonner напрямую
// или нашу обертку на основе shadcn/ui
import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  switch (variant) {
    case "destructive":
      return sonnerToast.error(title, {
        description,
      });
    case "success":
      return sonnerToast.success(title, {
        description,
      });
    default:
      return sonnerToast(title, {
        description,
      });
  }
};

// Добавляем фиктивный массив toasts для совместимости с toaster.tsx
export const useToast = () => {
  return { 
    toast,
    toasts: [] // Это поле нужно для совместимости с toaster.tsx
  };
};
