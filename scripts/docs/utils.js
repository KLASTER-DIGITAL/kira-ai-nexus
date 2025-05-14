
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { syncUserHelpContent, syncAdminHelpContent } = require('./content');

// Папка документации
const DOCS_DIR = path.resolve(__dirname, '../../docs');
const HELP_FILES = {
  'user': path.resolve(__dirname, '../../src/pages/UserHelpPage.tsx'),
  'admin': path.resolve(__dirname, '../../src/pages/AdminHelpPage.tsx')
};

/**
 * Генерация чейнджлога на основе коммитов
 */
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

/**
 * Создание необходимых директорий, если они отсутствуют
 */
function ensureDirectories() {
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
    console.log('Создана директория docs/');
  }
  
  // Создаем директорию для раздела помощи, если она отсутствует
  const helpDocsDir = path.join(DOCS_DIR, 'help');
  if (!fs.existsSync(helpDocsDir)) {
    fs.mkdirSync(helpDocsDir, { recursive: true });
    console.log('Создана директория docs/help/');
  }
}

/**
 * Копирование mint.json в директорию docs
 */
function copyMintConfig() {
  try {
    console.log('Копирование mint.json в директорию docs...');
    const sourcePath = path.resolve(__dirname, '../../mint.json');
    const targetPath = path.resolve(__dirname, '../../docs/mint.json');
    
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
      console.log('mint.json успешно скопирован в директорию docs/');
    } else {
      console.error('Файл mint.json не найден в корне проекта');
    }
  } catch (error) {
    console.error('Ошибка при копировании mint.json:', error);
  }
}

/**
 * Синхронизация содержимого Help страниц с Mintlify документацией
 */
function syncHelpContent() {
  try {
    console.log('Синхронизация содержимого справки с Mintlify...');
    
    // Обновляем файлы документации для разделов помощи
    syncUserHelpContent();
    syncAdminHelpContent();
    
    console.log('Содержимое справки успешно синхронизировано');
  } catch (error) {
    console.error('Ошибка при синхронизации содержимого справки:', error);
  }
}

/**
 * Обновление mint.json для включения новых файлов документации
 */
function updateMintConfig() {
  try {
    console.log('Обновление конфигурации Mintlify...');
    const mintConfigPath = path.resolve(__dirname, '../../mint.json');
    
    if (fs.existsSync(mintConfigPath)) {
      const mintConfig = JSON.parse(fs.readFileSync(mintConfigPath, 'utf8'));
      
      // Проверяем, есть ли раздел Help и добавляем, если нет
      const hasHelpSection = mintConfig.navigation.some(item => item.group === 'Справка');
      
      if (!hasHelpSection) {
        mintConfig.navigation.push({
          "group": "Справка",
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

/**
 * Локальный предпросмотр документации
 */
function previewDocs() {
  try {
    console.log('Запуск локального сервера документации...');
    execSync('npx mintlify dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('Ошибка при запуске предпросмотра:', error);
  }
}

module.exports = {
  generateChangelog,
  ensureDirectories,
  copyMintConfig,
  syncHelpContent,
  updateMintConfig,
  previewDocs,
  DOCS_DIR
};
