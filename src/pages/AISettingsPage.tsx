
import React from "react";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useWebhookSettings } from "@/hooks/useWebhookSettings";
import { Loader2 } from "lucide-react";

const webhookSchema = z.object({
  n8n_webhook_test: z
    .string()
    .url("Должен быть валидным URL")
    .nonempty("Обязательное поле"),
  n8n_webhook_production: z
    .string()
    .url("Должен быть валидным URL")
    .nullable()
    .optional(),
  n8n_mode: z.enum(["test", "production"])
});

const AISettingsPage: React.FC = () => {
  const { settings, isLoading, isSaving, saveSettings } = useWebhookSettings();

  const form = useForm<z.infer<typeof webhookSchema>>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      n8n_webhook_test: "",
      n8n_webhook_production: "",
      n8n_mode: "test"
    }
  });

  // Update form when settings load
  React.useEffect(() => {
    if (settings) {
      form.reset({
        n8n_webhook_test: settings.n8n_webhook_test || "",
        n8n_webhook_production: settings.n8n_webhook_production || "",
        n8n_mode: settings.n8n_mode
      });
    }
  }, [settings, form]);

  const onSubmit = async (data: z.infer<typeof webhookSchema>) => {
    await saveSettings(data);
  };

  if (isLoading) {
    return (
      <Layout title="Настройки AI">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-kira-purple" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Настройки AI">
      <div className="container mx-auto py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Настройки n8n Webhook</CardTitle>
            <CardDescription>
              Настройте интеграцию с n8n для обработки запросов AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="n8n_webhook_test"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тестовый Webhook URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://n8n.example.com/webhook/xxx" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL для тестового режима взаимодействия с n8n
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="n8n_webhook_production"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Рабочий Webhook URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://n8n.example.com/webhook/xxx" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        URL для боевого режима взаимодействия с n8n
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="n8n_mode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Активный режим</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите режим" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="test">Тестовый режим</SelectItem>
                          <SelectItem value="production">Боевой режим</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Выберите активный режим работы с n8n
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    'Сохранить настройки'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AISettingsPage;
