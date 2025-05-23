
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { 
  generateChangelog,
  ensureDirectories, 
  copyMintConfig, 
  syncHelpContent, 
  updateMintConfig, 
  previewDocs 
} = require('./docs/utils');
const { generateAPIDocumentation } = require('./docs/api');

/**
 * Главная функция
 */
async function main() {
  const args = process.argv.slice(2);
  ensureDirectories();
  
  // Всегда копируем mint.json в директорию docs
  copyMintConfig();
  
  if (args.includes('--changelog')) {
    generateChangelog();
  }
  
  if (args.includes('--sync')) {
    syncHelpContent();
    updateMintConfig();
  }
  
  if (args.includes('--api')) {
    generateAPIDocumentation();
  }
  
  if (args.includes('--preview')) {
    syncHelpContent();
    updateMintConfig();
    if (args.includes('--api')) {
      generateAPIDocumentation();
    }
    previewDocs();
  }
  
  if (args.length === 0) {
    generateChangelog();
    syncHelpContent();
    updateMintConfig();
    generateAPIDocumentation();
    previewDocs();
  }
}

main();
