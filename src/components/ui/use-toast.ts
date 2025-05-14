
import { toast } from "sonner";

type ToastProps = {
  title: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
};

export const useToast = () => {
  return {
    toast: ({ title, description, variant = "default" }: ToastProps) => {
      switch (variant) {
        case "destructive":
          return toast.error(title, {
            description,
          });
        case "success":
          return toast.success(title, {
            description,
          });
        default:
          return toast(title, {
            description,
          });
      }
    },
    toasts: [], // Добавляем пустой массив toasts для совместимости с toaster.tsx
  };
};

export { toast };
