
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutDashboard, MessageCircle, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated, profile, isSuperAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-kira-purple w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xl">
            K
          </div>
          <span className="text-xl font-bold text-white">KIRA AI</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button asChild variant="outline" className="text-white border-white/20">
              <Link to={isSuperAdmin() ? "/dashboard/admin" : "/dashboard/user"}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Перейти в дашборд
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                <Link to="/auth">Войти</Link>
              </Button>
              <Button asChild className="bg-kira-purple hover:bg-kira-purple/90">
                <Link to="/auth?tab=register">Регистрация</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-kira-purple to-kira-blue bg-clip-text text-transparent mb-6">
            Интеллектуальный помощник
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mb-8">
            KIRA AI - ваш интеллектуальный помощник для управления задачами, заметками и информацией в одном месте
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {isAuthenticated ? (
              <>
                <Button asChild size="lg" className="bg-kira-purple hover:bg-kira-purple/90">
                  <Link to={isSuperAdmin() ? "/dashboard/admin" : "/dashboard/user"}>
                    {isSuperAdmin() ? (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Админ панель
                      </>
                    ) : (
                      <>
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        Мой дашборд
                      </>
                    )}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/20">
                  <Link to="/chat">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Открыть чат с ИИ
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="bg-kira-purple hover:bg-kira-purple/90">
                  <Link to="/auth?tab=register">
                    Начать бесплатно
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/20">
                  <Link to="/auth">Войти в аккаунт</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
