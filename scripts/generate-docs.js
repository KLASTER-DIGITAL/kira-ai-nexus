
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Папка документации
const DOCS_DIR = path.resolve(__dirname, '../docs');

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
  
  if (args.includes('--preview')) {
    previewDocs();
  }
  
  if (args.length === 0) {
    generateChangelog();
    previewDocs();
  }
}

main();
