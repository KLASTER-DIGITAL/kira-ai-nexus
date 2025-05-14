
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Добавляем скрипты для Mintlify и Conventional Commits
packageJson.scripts = {
  ...packageJson.scripts,
  "docs": "node scripts/generate-docs.js",
  "docs:preview": "node scripts/generate-docs.js --preview",
  "docs:changelog": "node scripts/generate-docs.js --changelog",
  "docs:sync": "node scripts/generate-docs.js --sync",
  "docs:deploy": "mintlify deploy",
  "docs:manual-deploy": "node scripts/deploy-mintlify.js",
  "prepare": "husky install",
  "commitlint": "commitlint --edit"
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('package.json успешно обновлен');
