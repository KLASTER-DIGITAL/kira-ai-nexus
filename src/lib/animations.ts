
import { keyframes } from "@emotion/react";

// Пульсирующая анимация
export const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

// Плавное появление
export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Скользящее появление снизу
export const slideIn = keyframes`
  from { 
    transform: translateY(20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
`;

// Увеличение масштаба
export const scaleIn = keyframes`
  from { 
    transform: scale(0.9);
    opacity: 0;
  }
  to { 
    transform: scale(1);
    opacity: 1;
  }
`;

// Волновая анимация для "печатания"
export const typing = keyframes`
  0% { width: 0 }
  100% { width: 100% }
`;

// Анимация для курсора печатающего текста
export const blink = keyframes`
  from, to { border-color: transparent }
  50% { border-color: currentColor; }
`;
