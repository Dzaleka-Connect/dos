import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const servicesDir = join(__dirname, '..', 'src', 'content', 'services');

// Read all .md files in the services directory
const files = readdirSync(servicesDir).filter(file => file.endsWith('.md'));

files.forEach(file => {
  const filePath = join(servicesDir, file);
  let content = readFileSync(filePath, 'utf8');
  
  // Remove the status line from frontmatter
  content = content.replace(/status: active\n/, '');
  
  writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});

console.log('All files updated!');
