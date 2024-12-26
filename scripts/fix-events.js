import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eventsDir = join(__dirname, '..', 'src', 'content', 'events');

// Read all .md files in the events directory
const files = readdirSync(eventsDir).filter(file => file.endsWith('.md'));

files.forEach(file => {
  const filePath = join(eventsDir, file);
  let content = readFileSync(filePath, 'utf8');
  
  // Extract frontmatter
  const frontmatterMatch = content.match(/^---([\s\S]*?)---/);
  if (!frontmatterMatch) return;
  
  const frontmatter = frontmatterMatch[1];
  const restOfContent = content.slice(frontmatterMatch[0].length);
  
  // Parse location object if it exists
  const locationMatch = frontmatter.match(/location:\s*{[\s\S]*?}/);
  if (locationMatch) {
    const locationObj = locationMatch[0].match(/venue: "(.*?)".*?city: "(.*?)"/s);
    if (locationObj) {
      const [_, venue, city] = locationObj;
      content = content.replace(
        locationMatch[0],
        `location: "${venue}, ${city}"`
      );
    }
  }
  
  // Parse organizer object if it exists
  const organizerMatch = frontmatter.match(/organizer:\s*{[\s\S]*?}/);
  if (organizerMatch) {
    const organizerObj = organizerMatch[0].match(/name: "(.*?)"/);
    if (organizerObj) {
      content = content.replace(
        organizerMatch[0],
        `organizer: "${organizerObj[1]}"`
      );
    }
  }
  
  // Remove non-schema fields
  content = content
    .replace(/time: ".*"\n/, '')
    .replace(/photographer:[\s\S]*?website: ".*"\n/, '')
    .replace(/status: ".*"\n/, '')
    .replace(/registrationLink: ".*"\n/, '');
  
  // Add registration field if missing
  if (!content.includes('registration:')) {
    const insertPoint = content.indexOf('---\n', 4);
    content = content.slice(0, insertPoint) + 
      'registration:\n  required: false\n  url: ""\n' +
      content.slice(insertPoint);
  }
  
  // Add tags if missing
  if (!content.includes('tags:')) {
    const insertPoint = content.indexOf('---\n', 4);
    content = content.slice(0, insertPoint) + 
      'tags: ["arts", "culture", "community"]\n' +
      content.slice(insertPoint);
  }
  
  writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});

console.log('All event files updated!');
