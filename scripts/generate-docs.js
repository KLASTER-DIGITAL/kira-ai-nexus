
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Папка документации
const DOCS_DIR = path.resolve(__dirname, '../docs');
const HELP_FILES = {
  'user': path.resolve(__dirname, '../src/pages/UserHelpPage.tsx'),
  'admin': path.resolve(__dirname, '../src/pages/AdminHelpPage.tsx')
};

// Генерация чейнджлога на основе коммитов
function generateChangelog() {
  try {
    console.log('Генерация changelog...');
    execSync('npx conventional-changelog -p angular -i docs/changelog.md -s -r 0');
    console.log('Changelog успешно обновлен');
  } catch (error) {
    console.error('Ошибка при генерации changelog:', error);
    process.exit(1);
  }
}

// Создание необходимых директорий, если они отсутствуют
function ensureDirectories() {
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
    console.log('Создана директория docs/');
  }
}

// Синхронизация содержимого Help страниц с Mintlify документацией
function syncHelpContent() {
  try {
    console.log('Синхронизация содержимого справки с Mintlify...');
    
    // Создаем директорию для раздела помощи, если она отсутствует
    const helpDocsDir = path.join(DOCS_DIR, 'help');
    if (!fs.existsSync(helpDocsDir)) {
      fs.mkdirSync(helpDocsDir, { recursive: true });
    }

    // Обновляем файлы документации для разделов помощи
    syncUserHelpContent();
    syncAdminHelpContent();
    
    console.log('Содержимое справки успешно синхронизировано');
  } catch (error) {
    console.error('Ошибка при синхронизации содержимого справки:', error);
  }
}

// Синхронизация контента из UserHelpPage
function syncUserHelpContent() {
  const userHelpFile = path.join(DOCS_DIR, 'help', 'user-guide.mdx');
  
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

// Синхронизация контента из AdminHelpPage
function syncAdminHelpContent() {
  const adminHelpFile = path.join(DOCS_DIR, 'help', 'admin-guide.mdx');
  
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

// Обновление mint.json для включения новых файлов документации
function updateMintConfig() {
  try {
    console.log('Обновление конфигурации Mintlify...');
    const mintConfigPath = path.resolve(__dirname, '../mint.json');
    
    if (fs.existsSync(mintConfigPath)) {
      const mintConfig = JSON.parse(fs.readFileSync(mintConfigPath, 'utf8'));
      
      // Проверяем, есть ли раздел Help и добавляем, если нет
      const hasHelpSection = mintConfig.navigation.some(item => item.section === 'Справка');
      
      if (!hasHelpSection) {
        mintConfig.navigation.push({
          "section": "Справка",
          "pages": ["help/user-guide", "help/admin-guide"]
        });
        
        fs.writeFileSync(mintConfigPath, JSON.stringify(mintConfig, null, 2));
        console.log('Конфигурация Mintlify успешно обновлена');
      }
    }
  } catch (error) {
    console.error('Ошибка при обновлении конфигурации Mintlify:', error);
  }
}

// Локальный предпросмотр документации
function previewDocs() {
  try {
    console.log('Запуск локального сервера документации...');
    execSync('npx mintlify dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('Ошибка при запуске предпросмотра:', error);
  }
}

// Главная функция
async function main() {
  const args = process.argv.slice(2);
  ensureDirectories();
  
  if (args.includes('--changelog')) {
    generateChangelog();
  }
  
  if (args.includes('--sync')) {
    syncHelpContent();
    updateMintConfig();
  }
  
  if (args.includes('--preview')) {
    syncHelpContent();
    updateMintConfig();
    previewDocs();
  }
  
  if (args.length === 0) {
    generateChangelog();
    syncHelpContent();
    updateMintConfig();
    previewDocs();
  }
}

main();
