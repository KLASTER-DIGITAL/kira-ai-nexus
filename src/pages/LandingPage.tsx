
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, MessageCircle, Calendar, FileText, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-kira-purple w-10 h-10 rounded-md flex items-center justify-center text-white font-bold text-xl">
              K
            </div>
            <span className="text-xl font-bold">KIRA AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-foreground hover:text-kira-purple">
              Войти
            </Link>
            <Link to="/dashboard">
              <Button className="bg-kira-purple hover:bg-kira-purple-dark">
                Попробовать бесплатно
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-kira-purple-light/10 to-kira-blue/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Ваш <span className="text-kira-purple">интеллектуальный</span> рабочий ассистент
            </h1>
            <p className="text-xl mb-10 max-w-3xl mx-auto text-muted-foreground">
              KIRA AI объединяет задачи, заметки, календарь и AI-помощника в единой персонализированной рабочей среде
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-kira-purple hover:bg-kira-purple-dark">
                  Начать работу <ArrowRight className="ml-2" size={16} />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Узнать больше
              </Button>
            </div>
            
            <div className="mt-16 max-w-6xl mx-auto bg-card border rounded-xl p-3 shadow-lg">
              <img 
                src="https://via.placeholder.com/1200x600?text=KIRA+AI+Dashboard+Screenshot" 
                alt="KIRA AI Dashboard" 
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Все необходимое в одном месте</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 border rounded-xl hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-kira-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle size={24} className="text-kira-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-помощник</h3>
                <p className="text-muted-foreground">
                  Встроенный AI-помощник для ответов на вопросы и выполнения задач
                </p>
              </div>
              
              <div className="p-6 border rounded-xl hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-kira-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <Check size={24} className="text-kira-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Управление задачами</h3>
                <p className="text-muted-foreground">
                  Создавайте, организуйте и отслеживайте задачи в удобном интерфейсе
                </p>
              </div>
              
              <div className="p-6 border rounded-xl hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-kira-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText size={24} className="text-kira-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Умные заметки</h3>
                <p className="text-muted-foreground">
                  Создавайте заметки с поддержкой markdown и связями между документами
                </p>
              </div>
              
              <div className="p-6 border rounded-xl hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-kira-purple/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar size={24} className="text-kira-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Интегрированный календарь</h3>
                <p className="text-muted-foreground">
                  Управляйте своим расписанием и интегрируйте его с задачами
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-kira-purple text-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Готовы повысить свою продуктивность?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к KIRA AI сегодня и откройте новый уровень организации и эффективности
            </p>
            <Link to="/dashboard">
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-white text-kira-purple hover:bg-white/90 border-white"
              >
                Начать бесплатно
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="bg-kira-purple w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-lg">
                K
              </div>
              <span className="text-lg font-bold">KIRA AI</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-muted-foreground hover:text-kira-purple">О нас</a>
              <a href="#" className="text-muted-foreground hover:text-kira-purple">Блог</a>
              <a href="#" className="text-muted-foreground hover:text-kira-purple">Документация</a>
              <a href="#" className="text-muted-foreground hover:text-kira-purple">Поддержка</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} KIRA AI. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
