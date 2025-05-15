
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-20 h-20 bg-kira-purple rounded-xl flex items-center justify-center mb-4">
        <span className="text-4xl font-bold text-white">K</span>
      </div>
      <Loader2 className="h-8 w-8 animate-spin text-kira-purple mb-4" />
      <h2 className="text-xl font-medium text-white">Загрузка...</h2>
      <p className="text-slate-400">Пожалуйста, подождите</p>
    </div>
  );
};

export default LoadingScreen;
