// Function to convert object to CSV string
export function convertToCSV(data, collections) {
  try {
    let csvContent = '';
    const processedCollections = new Set();

    // Process each collection
    for (const collection of collections) {
      if (!data[collection] || !Array.isArray(data[collection])) continue;
      processedCollections.add(collection);

      // Get all possible headers from the collection
      const headers = new Set();
      data[collection].forEach(item => {
        Object.keys(item).forEach(key => headers.add(key));
      });
      const headerArray = Array.from(headers);

      // Add collection name as section header
      csvContent += `${collection.toUpperCase()}\n`;

      // Add headers row with proper escaping
      const headerRow = headerArray.map(header => `"${header}"`).join(',');
      csvContent += headerRow + '\n';

      // Add data rows
      data[collection].forEach(item => {
        const row = headerArray.map(header => {
          const value = item[header];
          if (value === null || value === undefined) return '""';
          if (typeof value === 'object') {
            // Handle arrays and objects
            const stringValue = JSON.stringify(value);
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          // Handle strings, numbers, and other primitives
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvContent += row.join(',') + '\n';
      });

      // Add a blank line between collections
      csvContent += '\n';
    }

    // Add metadata if present
    if (data.metadata) {
      csvContent += 'METADATA\n';
      csvContent += '"Property","Value"\n';
      Object.entries(data.metadata).forEach(([key, value]) => {
        const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        csvContent += `"${key}","${formattedValue.replace(/"/g, '""')}"\n`;
      });
      csvContent += '\n';
    }

    // Add stats if present
    if (data.stats) {
      csvContent += 'STATISTICS\n';
      csvContent += '"Metric","Value"\n';
      Object.entries(data.stats).forEach(([key, value]) => {
        const formattedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        csvContent += `"${key}","${formattedValue.replace(/"/g, '""')}"\n`;
      });
      csvContent += '\n';
    }

    return csvContent;
  } catch (error) {
    console.error('Error converting to CSV:', error);
    throw new Error('Failed to convert data to CSV format');
  }
}

// Function to sanitize CSV values
export function sanitizeCSVValue(value) {
  if (value === null || value === undefined) return '""';
  if (typeof value === 'object') {
    const stringValue = JSON.stringify(value);
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return `"${String(value).replace(/"/g, '""')}"`;
}

// Function to get CSV mime type with UTF-8 BOM for Excel compatibility
export function getCSVMimeType() {
  return 'text/csv;charset=utf-8;';
}

// Function to add UTF-8 BOM for Excel compatibility
export function addBOMToCSV(csv) {
  const BOM = '\uFEFF';
  return BOM + csv;
} 