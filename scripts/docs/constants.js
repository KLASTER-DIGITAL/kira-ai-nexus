
const path = require('path');

// Папка документации
const DOCS_DIR = path.resolve(__dirname, '../../docs');
const HELP_FILES = {
  'user': path.resolve(__dirname, '../../src/pages/UserHelpPage.tsx'),
  'admin': path.resolve(__dirname, '../../src/pages/AdminHelpPage.tsx')
};

module.exports = {
  DOCS_DIR,
  HELP_FILES
};
