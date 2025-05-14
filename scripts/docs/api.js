
const fs = require('fs');
const path = require('path');
const { DOCS_DIR } = require('./constants');

/**
 * Анализирует файл и извлекает документацию API
 * @param {string} filePath - путь к файлу
 * @returns {Object} объект с информацией об API
 */
function parseAPIFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileInfo = {
    name: path.basename(filePath, path.extname(filePath)),
    functions: [],
    types: []
  };

  // Анализ экспортируемых функций
  const functionRegex = /export\s+(const|function|async function)\s+(\w+)\s*=?\s*(\([^)]*\)|\([^)]*\)\s*:\s*[^=;]+)?/g;
  let match;

  while ((match = functionRegex.exec(content)) !== null) {
    const funcName = match[2];
    const params = match[3] || '';
    
    // Поиск комментария перед функцией
    const commentRegex = new RegExp(`\\/\\*\\*([\\s\\S]*?)\\*\\/[\\s\\n]*export\\s+(const|function|async function)\\s+${funcName}`, 'g');
    const commentMatch = commentRegex.exec(content);
    
    const description = commentMatch ? extractDescription(commentMatch[1]) : '';
    
    // Определение параметров функции
    const paramsList = extractParams(params);
    
    fileInfo.functions.push({
      name: funcName,
      description,
      params: paramsList,
      returnType: extractReturnType(params, content, funcName)
    });
  }

  // Анализ экспортируемых типов
  const typeRegex = /export\s+type\s+(\w+)\s*=\s*([^;]+);/g;
  while ((match = typeRegex.exec(content)) !== null) {
    fileInfo.types.push({
      name: match[1],
      definition: match[2].trim()
    });
  }

  return fileInfo;
}

/**
 * Извлекает описание из JSDoc комментария
 * @param {string} comment - JSDoc комментарий
 * @returns {string} описание функции
 */
function extractDescription(comment) {
  if (!comment) return '';
  
  // Удаляем * в начале строк и разделяем на строки
  const lines = comment
    .split('\n')
    .map(line => line.trim().replace(/^\*\s*/, ''))
    .filter(line => !line.startsWith('@')); // Исключаем строки с тегами JSDoc
  
  return lines.join(' ').trim();
}

/**
 * Извлекает параметры функции
 * @param {string} paramsString - строка с параметрами функции
 * @returns {Array} массив параметров
 */
function extractParams(paramsString) {
  if (!paramsString) return [];
  
  // Удаляем скобки и разделяем по запятым
  const paramsContent = paramsString.replace(/[()]/g, '').split(':')[0];
  
  // Если строка пустая, возвращаем пустой массив
  if (!paramsContent.trim()) return [];
  
  return paramsContent.split(',')
    .map(param => {
      const p = param.trim();
      if (p) {
        // Извлекаем имя параметра и его тип, если указан
        const [name, type] = p.split(':').map(s => s.trim());
        return { name, type: type || '' };
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Извлекает тип возвращаемого значения
 * @param {string} signature - сигнатура функции
 * @param {string} content - содержимое файла
 * @param {string} funcName - имя функции
 * @returns {string} тип возвращаемого значения
 */
function extractReturnType(signature, content, funcName) {
  if (!signature) return '';
  
  // Проверяем наличие явного указания типа возвращаемого значения
  if (signature.includes(':')) {
    const returnMatch = signature.match(/\)\s*:\s*([^=;]+)/);
    if (returnMatch) {
      return returnMatch[1].trim();
    }
  }
  
  // Поиск JSDoc для определения типа возвращаемого значения
  const jsdocRegex = new RegExp(`\\/\\*\\*([\\s\\S]*?)\\*\\/[\\s\\n]*export\\s+(const|function|async function)\\s+${funcName}`, 'g');
  const jsdocMatch = jsdocRegex.exec(content);
  
  if (jsdocMatch) {
    const jsdoc = jsdocMatch[1];
    const returnMatch = jsdoc.match(/@returns?\s+\{([^}]+)\}/);
    if (returnMatch) {
      return returnMatch[1];
    }
  }
  
  return '';
}

/**
 * Генерирует MDX документацию на основе информации об API
 * @param {Object} apiInfo - объект с информацией об API
 * @returns {string} содержимое MDX файла
 */
function generateMDXContent(apiInfo) {
  let content = `---
title: '${apiInfo.name} API'
description: 'Документация по API модуля ${apiInfo.name}'
---

# ${apiInfo.name} API

`;

  // Добавляем информацию о функциях
  if (apiInfo.functions.length > 0) {
    content += '## Функции\n\n';
    
    apiInfo.functions.forEach(func => {
      content += `### \`${func.name}(${func.params.map(p => p.name).join(', ')})\`\n\n`;
      
      if (func.description) {
        content += `${func.description}\n\n`;
      }
      
      // Параметры
      if (func.params.length > 0) {
        content += '#### Параметры\n\n';
        content += '| Название | Тип | Описание |\n';
        content += '|----------|-----|----------|\n';
        func.params.forEach(param => {
          content += `| \`${param.name}\` | \`${param.type || 'не указан'}\` | - |\n`;
        });
        content += '\n';
      }
      
      // Возвращаемое значение
      if (func.returnType) {
        content += '#### Возвращаемое значение\n\n';
        content += `\`${func.returnType}\`\n\n`;
      }
      
      // Добавляем пример использования
      content += '#### Пример использования\n\n';
      content += '```typescript\n';
      content += `import { ${func.name} } from '@/services/${apiInfo.name}';\n\n`;
      
      // Генерируем пример вызова функции
      const paramValues = func.params.map(param => {
        if (param.type && param.type.toLowerCase().includes('string')) return `'example'`;
        if (param.type && param.type.toLowerCase().includes('number')) return '123';
        if (param.type && param.type.toLowerCase().includes('boolean')) return 'true';
        if (param.name.toLowerCase().includes('id')) return `'user-id'`;
        return '{}';
      });
      
      content += `const result = await ${func.name}(${paramValues.join(', ')});\n`;
      content += '```\n\n';
      
      content += '---\n\n';
    });
  }
  
  // Добавляем информацию о типах
  if (apiInfo.types.length > 0) {
    content += '## Типы данных\n\n';
    
    apiInfo.types.forEach(type => {
      content += `### \`${type.name}\`\n\n`;
      content += '```typescript\n';
      content += `type ${type.name} = ${type.definition};\n`;
      content += '```\n\n';
    });
  }
  
  return content;
}

/**
 * Генерирует документацию API на основе кода в директории сервисов
 */
function generateAPIDocumentation() {
  const servicesDir = path.resolve(__dirname, '../../src/services');
  const apiDocsDir = path.join(DOCS_DIR, 'api');
  
  // Создаем директорию для API документации, если она не существует
  if (!fs.existsSync(apiDocsDir)) {
    fs.mkdirSync(apiDocsDir, { recursive: true });
  }
  
  try {
    // Получаем список файлов в директории services
    const files = fs.readdirSync(servicesDir);
    
    // Фильтруем только JS/TS файлы
    const serviceFiles = files.filter(
      file => file.endsWith('.js') || file.endsWith('.ts')
    );
    
    // Создаем индексный файл для API документации
    let indexContent = `---
title: 'API Reference'
description: 'Документация по API сервисам KIRA AI'
---

# API Reference

## Доступные сервисы

`;
    
    // Генерируем документацию для каждого файла
    serviceFiles.forEach(file => {
      const filePath = path.join(servicesDir, file);
      const apiInfo = parseAPIFile(filePath);
      const mdxContent = generateMDXContent(apiInfo);
      
      const mdxFileName = `${apiInfo.name}.mdx`;
      fs.writeFileSync(path.join(apiDocsDir, mdxFileName), mdxContent);
      
      console.log(`Создана документация API для ${apiInfo.name}`);
      
      // Добавляем ссылку на созданный файл в индекс
      indexContent += `- [${apiInfo.name}](/api/${apiInfo.name})\n`;
    });
    
    // Записываем индексный файл
    fs.writeFileSync(path.join(apiDocsDir, 'index.mdx'), indexContent);
    
    console.log('API документация успешно создана');
    
    // Обновляем mint.json для включения API документации
    const mintConfigPath = path.resolve(__dirname, '../../mint.json');
    if (fs.existsSync(mintConfigPath)) {
      const mintConfig = JSON.parse(fs.readFileSync(mintConfigPath, 'utf8'));
      
      // Проверяем, есть ли раздел API и обновляем его страницы
      const apiGroupIndex = mintConfig.navigation.findIndex(nav => nav.group === 'API');
      
      if (apiGroupIndex !== -1) {
        // Обновляем существующую группу API
        const apiPages = ['api/index'];
        serviceFiles.forEach(file => {
          const fileName = path.basename(file, path.extname(file));
          apiPages.push(`api/${fileName}`);
        });
        
        mintConfig.navigation[apiGroupIndex].pages = apiPages;
      }
      
      fs.writeFileSync(mintConfigPath, JSON.stringify(mintConfig, null, 2));
      console.log('mint.json обновлен с API документацией');
    }
  } catch (error) {
    console.error('Ошибка при генерации API документации:', error);
  }
}

module.exports = {
  generateAPIDocumentation,
  parseAPIFile
};
