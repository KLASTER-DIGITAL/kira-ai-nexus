
const fs = require('fs');
const path = require('path');
const { DOCS_DIR, HELP_FILES } = require('./constants');

/**
 * Извлекает контент справки из React компонента
 * @param {string} componentPath - путь к файлу компонента
 * @returns {Object} - объект с извлеченными данными
 */
function extractHelpContentFromComponent(componentPath) {
  try {
    const content = fs.readFileSync(componentPath, 'utf8');
    const result = {
      title: '',
      description: '',
      sections: []
    };
    
    // Извлекаем заголовок страницы
    const titleMatch = content.match(/<CardTitle>(.*?)<\/CardTitle>/);
    if (titleMatch && titleMatch[1]) {
      result.title = titleMatch[1].trim();
    } else {
      // Запасной вариант - ищем через h1
      const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
      if (h1Match && h1Match[1]) {
        result.title = h1Match[1].trim();
      }
    }
    
    // Извлекаем описание
    const descriptionMatch = content.match(/<p[^>]*class="text-sm[^"]*"[^>]*>(.*?)<\/p>/);
    if (descriptionMatch && descriptionMatch[1]) {
      result.description = descriptionMatch[1].trim();
    }
    
    // Извлекаем секции - ищем заголовки TabsTrigger
    const tabsPattern = /<TabsTrigger value="([^"]+)">(.*?)<\/TabsTrigger>/g;
    let tabsMatch;
    
    while ((tabsMatch = tabsPattern.exec(content)) !== null) {
      const sectionId = tabsMatch[1];
      const sectionTitle = tabsMatch[2].trim();
      
      // Ищем контент для этой вкладки
      const contentPattern = new RegExp(`<TabsContent value="${sectionId}"[^>]*>([\\s\\S]*?)<\/TabsContent>`);
      const contentMatch = contentPattern.exec(content);
      
      if (contentMatch) {
        const sectionContent = contentMatch[1];
        
        // Извлекаем подзаголовки и параграфы
        const section = {
          id: sectionId,
          title: sectionTitle,
          content: [],
          subsections: []
        };
        
        // Ищем заголовки второго уровня
        const h3Pattern = /<h3[^>]*class="text-lg[^"]*"[^>]*>(.*?)<\/h3>/g;
        let lastIndex = 0;
        let h3Match;
        
        while ((h3Match = h3Pattern.exec(sectionContent)) !== null) {
          const subsectionTitle = h3Match[1].trim();
          const startIndex = h3Match.index;
          
          // Ищем следующий h3 или конец секции
          const nextH3 = h3Pattern.exec(sectionContent);
          const endIndex = nextH3 ? nextH3.index : sectionContent.length;
          
          // Извлекаем текст между заголовками
          const subsectionContent = sectionContent.substring(startIndex, endIndex);
          
          // Извлекаем параграфы
          const paragraphs = [];
          const pPattern = /<p[^>]*>(.*?)<\/p>/g;
          let pMatch;
          
          while ((pMatch = pPattern.exec(subsectionContent)) !== null) {
            paragraphs.push(pMatch[1].trim());
          }
          
          section.subsections.push({
            title: subsectionTitle,
            paragraphs
          });
          
          if (nextH3) {
            // Возвращаем указатель назад, чтобы не пропустить следующий заголовок
            h3Pattern.lastIndex = nextH3.index;
          } else {
            break;
          }
        }
        
        result.sections.push(section);
      }
    }
    
    return result;
  } catch (error) {
    console.error(`Ошибка при извлечении контента из компонента ${componentPath}:`, error);
    return null;
  }
}

/**
 * Синхронизация контента из UserHelpPage
 */
function syncUserHelpContent() {
  const userHelpFile = path.join(DOCS_DIR, 'help', 'user-guide.mdx');
  
  // В будущем можно использовать extractHelpContentFromComponent(HELP_FILES['user'])
  // для автоматического извлечения контента
  
  fs.writeFileSync(userHelpFile, `---
title: 'Руководство пользователя'
description: 'Подробное руководство по использованию KIRA AI'
---

# Руководство пользователя

Добро пожаловать в руководство пользователя KIRA AI. Здесь вы найдете всю необходимую информацию для эффективной работы с платформой.

## Общая информация

KIRA AI — это персональный AI-ассистент с встроенным управлением задачами, заметками и календарем. 

### Навигация

Используйте боковую панель для перехода между разделами приложения:
- Дашборд — сводка ваших текущих задач и событий
- Чат — общение с AI-ассистентом
- Задачи — управление вашими задачами
- Заметки — создание и редактирование заметок
- Календарь — просмотр и планирование событий

## Работа с задачами

### Создание задач
Чтобы создать новую задачу, нажмите кнопку "Создать задачу" в разделе Задачи.

### Управление задачами
Вы можете:
- Отмечать задачи как выполненные
- Устанавливать приоритеты
- Добавлять сроки выполнения
- Группировать задачи по проектам

## Работа с заметками

### Создание заметок
Создавайте заметки с помощью встроенного редактора. Поддерживается Markdown форматирование.

### Связи между заметками
Вы можете связывать заметки между собой, создавая Wiki-ссылки. Для просмотра связей используйте Graph View.

## Использование AI-ассистента

### Возможности AI-ассистента
KIRA AI может:
- Отвечать на вопросы
- Помогать с планированием задач
- Создавать заметки по вашим запросам
- Искать информацию в ваших данных

### Команды
Используйте специальные команды для управления приложением через чат:
- \`/task\` — создать задачу
- \`/note\` — создать заметку
- \`/event\` — создать событие в календаре
- \`/help\` — показать список команд

`);
  console.log('Обновлен файл user-guide.mdx');
}

/**
 * Синхронизация контента из AdminHelpPage
 */
function syncAdminHelpContent() {
  const adminHelpFile = path.join(DOCS_DIR, 'help', 'admin-guide.mdx');
  
  // В будущем можно использовать extractHelpContentFromComponent(HELP_FILES['admin'])
  // для автоматического извлечения контента
  
  fs.writeFileSync(adminHelpFile, `---
title: 'Руководство администратора'
description: 'Руководство по администрированию платформы KIRA AI'
---

# Руководство администратора

Это руководство предназначено для пользователей с ролью SUPER_ADMIN и содержит информацию об административных функциях KIRA AI.

## Обзор панели администратора

Как супер-администратор KIRA AI, вы имеете доступ к расширенным функциям:
- Управление пользователями и правами доступа
- Настройка параметров AI-ассистента
- Мониторинг системы и аналитика использования
- Управление интеграциями и API

## Управление пользователями

### Создание и редактирование пользователей
Вы можете создавать новых пользователей, редактировать их данные и назначать роли.

### Роли доступа
Система поддерживает следующие роли:
- **Пользователь (user)** — стандартный доступ к функциям платформы
- **Суперадмин (superadmin)** — полный доступ ко всем функциям и настройкам

## Настройка AI-ассистента

### Параметры AI
Настройте поведение AI-ассистента:
- Выберите модель языка (GPT-4, GPT-3.5)
- Настройте контекстный промпт для AI
- Управляйте доступными командами
- Настройте ограничения запросов

### MiniApps
Управление миниприложениями для расширения функциональности платформы.

## Системные настройки

### Интеграции
Настройка внешних интеграций:
- OpenAI API
- Google Calendar
- Telegram
- GitHub и др.

### Мониторинг
Отслеживайте производительность системы, использование ресурсов и активность пользователей.

`);
  console.log('Обновлен файл admin-guide.mdx');
}

module.exports = {
  syncUserHelpContent,
  syncAdminHelpContent,
  extractHelpContentFromComponent
};
