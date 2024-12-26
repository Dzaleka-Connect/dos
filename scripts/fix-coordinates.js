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
  
  // Replace latitude and longitude with lat and lng
  content = content.replace(/latitude: (-?\d+\.\d+)/, 'lat: $1');
  content = content.replace(/longitude: (-?\d+\.\d+)/, 'lng: $1');
  
  writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});

console.log('All files updated!');
