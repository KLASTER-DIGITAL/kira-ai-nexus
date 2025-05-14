
const { execSync } = require('child_process');

try {
  // Установка husky
  execSync('npx husky install');
  
  // Добавление hook для проверки коммитов
  execSync('npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"');
  
  console.log('Husky hooks успешно установлены');
} catch (error) {
  console.error('Ошибка при установке Husky:', error);
  process.exit(1);
}
