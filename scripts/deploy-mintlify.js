
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Mintlify Deployment Tool');
console.log('===========================');

// Check if Mintlify CLI is installed
function checkMintlifyInstalled() {
  try {
    execSync('mintlify --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Main function
async function main() {
  // Check if mintlify is installed
  const isMintlifyInstalled = checkMintlifyInstalled();
  
  if (!isMintlifyInstalled) {
    console.log('⚠️  Mintlify CLI не установлен.');
    rl.question('Хотите установить Mintlify CLI глобально? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        try {
          console.log('📦 Установка Mintlify CLI...');
          execSync('npm install -g mintlify', { stdio: 'inherit' });
          console.log('✅ Mintlify CLI успешно установлен!');
          proceedWithDeployment();
        } catch (error) {
          console.error('❌ Ошибка установки Mintlify CLI:', error.message);
          rl.close();
        }
      } else {
        console.log('❌ Mintlify CLI требуется для деплоя. Установите его вручную и повторите попытку.');
        rl.close();
      }
    });
  } else {
    proceedWithDeployment();
  }
}

// Function to handle deployment
function proceedWithDeployment() {
  console.log('⚙️  Подготовка документации к деплою...');
  
  try {
    // Run the documentation generation script
    execSync('node scripts/generate-docs.js --sync --changelog', { stdio: 'inherit' });
    console.log('✅ Документация сгенерирована успешно!');
    
    console.log('🚀 Запуск деплоя в Mintlify...');
    rl.question('Вы уверены, что хотите выполнить деплой? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        try {
          execSync('mintlify deploy', { stdio: 'inherit' });
          console.log('✅ Деплой успешно выполнен!');
          console.log('📝 Документация будет доступна через несколько минут.');
          
          // Update last deploy time
          const deployTime = Date.now().toString();
          console.log(`Время деплоя: ${new Date(parseInt(deployTime)).toLocaleString()}`);
          console.log('Для просмотра документации перейдите на страницу вашего проекта в Mintlify.');
        } catch (error) {
          console.error('❌ Ошибка деплоя:', error.message);
        }
        rl.close();
      } else {
        console.log('❌ Деплой отменен.');
        rl.close();
      }
    });
  } catch (error) {
    console.error('❌ Ошибка подготовки документации:', error.message);
    rl.close();
  }
}

// Run the script
main();
