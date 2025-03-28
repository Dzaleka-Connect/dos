// Content health checking functions
export function checkContentHealth(items, type) {
  const healthData = {
    total: 0,
    missingImages: [],
    incompleteMetadata: [],
    brokenLinks: []
  };

  items.forEach(item => {
    healthData.total++;
    
    // Check for missing images
    if (
      (type === 'services' && !item.data.logo) ||
      (type === 'photos' && !item.data.image) ||
      (type === 'profiles' && !item.data.profileImage) ||
      (type === 'talents' && !item.data.photo)
    ) {
      healthData.missingImages.push({
        id: item.id,
        title: item.data.title || item.data.name || 'Untitled',
        type: type
      });
    }
    
    // Check for incomplete metadata
    const requiredFields = {
      services: ['title', 'category', 'description', 'status'],
      resources: ['title', 'category', 'description'],
      events: ['title', 'date', 'description'],
      photos: ['title', 'date', 'description'],
      talents: ['name', 'category', 'description'],
      jobs: ['title', 'company', 'description'],
      profiles: ['name', 'category', 'description'],
      news: ['title', 'date', 'content'],
      pages: ['title', 'description']
    };
    
    if (requiredFields[type]) {
      const missingFields = requiredFields[type].filter(field => !item.data[field]);
      if (missingFields.length > 0) {
        healthData.incompleteMetadata.push({
          id: item.id,
          title: item.data.title || item.data.name || 'Untitled',
          type: type,
          missingFields: missingFields
        });
      }
    }
    
    // Check for broken links
    const urlFields = ['website', 'url', 'link', 'externalLink'];
    urlFields.forEach(field => {
      if (item.data[field] && !isValidUrl(item.data[field])) {
        healthData.brokenLinks.push({
          id: item.id,
          title: item.data.title || item.data.name || 'Untitled',
          type: type,
          brokenUrl: item.data[field]
        });
      }
    });
  });

  return healthData;
}

// Helper function to validate URLs
export function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// API health checking functions
export async function checkApiHealth() {
  const endpoints = [
    { name: 'Export API', path: '/api/export' },
    { name: 'Content API', path: '/api/services' },
    { name: 'Search API', path: '/api/search' },
    { name: 'Auth API', path: '/api/auth' }
  ];

  const results = await Promise.all(endpoints.map(async endpoint => {
    const start = performance.now();
    try {
      const response = await fetch(endpoint.path);
      const latency = Math.round(performance.now() - start);
      return {
        name: endpoint.name,
        status: response.ok ? 'operational' : 'error',
        latency: `${latency}ms`
      };
    } catch (error) {
      return {
        name: endpoint.name,
        status: 'error',
        latency: 'N/A'
      };
    }
  }));

  return results;
}

// Calculate overall system health
export function calculateSystemHealth(apiResults) {
  const operational = apiResults.filter(result => result.status === 'operational').length;
  const total = apiResults.length;
  return {
    status: operational === total ? 'All Systems Operational' : `${operational}/${total} Systems Operational`,
    isHealthy: operational === total
  };
} 