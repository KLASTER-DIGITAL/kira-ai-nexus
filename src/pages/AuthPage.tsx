
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Mail } from 'lucide-react';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(6, { message: 'Пароль должен быть не менее 6 символов' }),
});

const registerSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z.string().min(6, { message: 'Пароль должен быть не менее 6 символов' }),
  confirmPassword: z.string().min(6, { message: 'Подтвердите пароль' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

const resetSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, requestPasswordReset, isAuthenticated } = useAuth();

  // Reset error when changing tabs
  useEffect(() => {
    setError(null);
  }, [activeTab]);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Reset password form
  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle login
  const onLogin = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        setError(error.message || 'Ошибка входа');
      }
    } catch (err) {
      setError('Неизвестная ошибка при входе');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle registration
  const onRegister = async (data: RegisterFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const { error } = await signUp(data.email, data.password);
      
      if (error) {
        setError(error.message || 'Ошибка регистрации');
      } else {
        // Switch to login tab after successful registration
        setActiveTab('login');
      }
    } catch (err) {
      setError('Неизвестная ошибка при регистрации');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reset password request
  const onReset = async (data: ResetFormValues) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const { error } = await requestPasswordReset(data.email);
      
      if (error) {
        setError(error.message || 'Ошибка сброса пароля');
      }
    } catch (err) {
      setError('Неизвестная ошибка при сбросе пароля');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 bg-kira-purple w-20 h-20 rounded-xl flex items-center justify-center">
            <span className="text-4xl font-bold text-white">K</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-kira-purple to-kira-blue bg-clip-text text-transparent">
            KIRA AI
          </h1>
          <p className="text-slate-400 mt-2">
            Интеллектуальный помощник для управления задачами и информацией
          </p>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-xl text-center">
              {activeTab === 'login' && 'Вход в систему'}
              {activeTab === 'register' && 'Регистрация'}
              {activeTab === 'reset' && 'Сброс пароля'}
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              {activeTab === 'login' && 'Введите данные для входа'}
              {activeTab === 'register' && 'Создайте новую учетную запись'}
              {activeTab === 'reset' && 'Введите email для сброса пароля'}
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mx-4">
              <TabsTrigger value="login">Вход</TabsTrigger>
              <TabsTrigger value="register">Регистрация</TabsTrigger>
              <TabsTrigger value="reset">Сброс</TabsTrigger>
            </TabsList>
            
            {error && (
              <div className="p-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
            
            <CardContent className="pt-6">
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="example@kira.ai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Пароль</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-kira-purple hover:bg-kira-purple/90" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Выполняется вход...
                        </>
                      ) : "Войти"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="example@kira.ai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Пароль</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Подтверждение пароля</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-kira-purple hover:bg-kira-purple/90" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Регистрация...
                        </>
                      ) : "Зарегистрироваться"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="reset">
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onReset)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="example@kira.ai" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-kira-purple hover:bg-kira-purple/90" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Отправка запроса...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Отправить инструкции
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex-col space-y-4 pt-0">
              <div className="text-xs text-slate-500 text-center">
                Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности KIRA AI
              </div>
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
