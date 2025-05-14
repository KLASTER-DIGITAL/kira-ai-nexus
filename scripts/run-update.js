
#!/usr/bin/env node

const { execSync } = require('child_process');

try {
  console.log('Обновление package.json...');
  execSync('node scripts/update-package.js', { stdio: 'inherit' });
  
  console.log('Создание структуры документации...');
  execSync('node scripts/generate-docs.js --sync', { stdio: 'inherit' });
  
  console.log('Установка зависимостей...');
  execSync('npm install -g mintlify conventional-changelog-cli', { stdio: 'inherit' });
  
  console.log('Готово! Теперь вы можете запустить npm run docs:deploy для деплоя документации.');
} catch (error) {
  console.error('Произошла ошибка:', error.message);
}
