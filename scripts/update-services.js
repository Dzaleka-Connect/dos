import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES_DIR = path.join(__dirname, '..', 'src', 'content', 'services');

// Get all .md files in the services directory
const serviceFiles = fs.readdirSync(SERVICES_DIR).filter(file => file.endsWith('.md'));

// Custom YAML schema for dates
const yamlSchema = yaml.DEFAULT_SCHEMA.extend({
  implicit: [
    new yaml.Type('tag:yaml.org,2002:timestamp', {
      kind: 'scalar',
      resolve: function(data) {
        return data !== null && data.length === 10; // YYYY-MM-DD
      },
      construct: function(data) {
        return data;
      },
      predicate: function(object) {
        return object instanceof Date;
      },
      represent: function(object) {
        return object.toISOString().split('T')[0];
      }
    })
  ]
});

// Update each service file
serviceFiles.forEach(filename => {
  const filePath = path.join(SERVICES_DIR, filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  // Create new frontmatter with required fields
  const newFrontmatter = {
    title: data.title,
    category: data.category,
    description: data.description,
    location: {
      address: data.address || 'Dzaleka Refugee Camp',
      city: 'Dowa',
      coordinates: {
        latitude: -13.7833,
        longitude: 33.9833
      }
    },
    contact: {
      email: data.email || '',
      phone: data.phone || '',
      hours: 'Monday-Friday, 8:00 AM - 5:00 PM'
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      website: data.website || ''
    },
    logo: data.logo || '',
    featured: data.featured || false,
    status: 'active',
    lastUpdated: new Date()
  };

  // Create new file content
  const newFileContent = matter.stringify(content, newFrontmatter, {
    schema: yamlSchema
  });

  // Write updated content back to file
  fs.writeFileSync(filePath, newFileContent);
  console.log(`Updated ${filename}`);
});

console.log('All service files have been updated!');
