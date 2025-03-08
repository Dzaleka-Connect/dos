---
title: API Documentation
description: Complete guide to using the Dzaleka Online Services API for developers
section: developers
date: 2023-03-08
category: Technical
featured: true
---

# Dzaleka Online Services API

This documentation provides a comprehensive guide to using the Dzaleka Online Services API. The API allows developers to access and integrate the platform's data into their applications.

## API Overview

The Dzaleka Online Services API is a RESTful API that provides access to various collections of data, including services, resources, events, photos, and more. The API supports both JSON and CSV formats for data export.

### Base URL

All API endpoints are relative to the base URL:

```
https://services.dzaleka.com/api
```

### Authentication

Currently, the API is publicly accessible without authentication. Future versions may implement authentication for certain endpoints.

## API Endpoints

### Collection-Specific Endpoints

Each collection has its own dedicated endpoint:

| Collection | Endpoint | Description |
|------------|----------|-------------|
| Services | `/services` | Community services and providers |
| Resources | `/resources` | Educational and informational resources |
| Events | `/events` | Community events and activities |
| Photos | `/photos` | Photo gallery and albums |
| Profiles | `/profiles` | Skills exchange profiles |
| Talents | `/talents` | Community talent showcase |
| Community Voices | `/community-voices` | Stories and experiences |
| News | `/news` | News articles and updates |
| Jobs | `/jobs` | Job listings and opportunities |
| Docs | `/docs` | Documentation and guides |
| Pages | `/pages` | Static page content |

### Export API

The Export API allows you to retrieve data from multiple collections in a single request:

```
/api/export
```

## Request Methods

### GET Requests

Use GET requests to retrieve data from a specific collection:

```
GET /api/{collection}
```

Example:

```
GET /api/resources
```

Response:

```json
{
  "success": true,
  "count": 76,
  "data": {
    "resources": [
      {
        "id": "banking-services",
        "collection": "resources",
        "slug": "banking-services",
        "title": "Banking services in Dzaleka Refugee Camp",
        "description": "Overview of banking and financial services available in Dzaleka",
        "category": "Finance",
        "author": "Financial Team",
        "fileType": "PDF",
        "fileSize": "1.2MB",
        "downloadUrl": "/resources/banking-services.pdf",
        "resourceUrl": "https://services.dzaleka.com/banking-services"
      },
      // More resources...
    ]
  }
}
```

### POST Requests

Use POST requests to retrieve data with additional options:

```
POST /api/{collection}
```

Request body:

```json
{
  "options": {
    "includeMetadata": true,
    "includeStats": true
  }
}
```

Example:

```
POST /api/resources
```

With body:

```json
{
  "options": {
    "includeMetadata": true,
    "includeStats": true
  }
}
```

Response:

```json
{
  "success": true,
  "count": 76,
  "metadata": {
    "lastUpdated": "2023-03-08T12:34:56Z",
    "version": "1.0.0"
  },
  "stats": {
    "categories": {
      "Education": 25,
      "Health": 18,
      "Finance": 10,
      "Legal": 15,
      "Other": 8
    },
    "totalDownloads": 1250,
    "averageFileSize": "2.4MB"
  },
  "data": {
    "resources": [
      // Resources data...
    ]
  }
}
```

### Export API POST Request

Use the Export API to retrieve data from multiple collections:

```
POST /api/export
```

Request body:

```json
{
  "format": "json",
  "collections": ["resources", "services"],
  "options": {
    "includeMetadata": true,
    "includeStats": true
  }
}
```

Response:

```json
{
  "success": true,
  "metadata": {
    "exportDate": "2023-03-08T12:34:56Z",
    "version": "1.0.0"
  },
  "stats": {
    "resources": {
      "count": 76,
      "categories": 5
    },
    "services": {
      "count": 42,
      "categories": 8
    }
  },
  "data": {
    "resources": [
      // Resources data...
    ],
    "services": [
      // Services data...
    ]
  }
}
```

## Response Formats

### JSON Format

The default response format is JSON. Example:

```json
{
  "success": true,
  "count": 76,
  "data": {
    "resources": [
      {
        "id": "banking-services",
        "title": "Banking services in Dzaleka Refugee Camp",
        // More fields...
      }
    ]
  }
}
```

### CSV Format

You can request data in CSV format using the Export API:

```
POST /api/export
```

With body:

```json
{
  "format": "csv",
  "collections": ["resources"]
}
```

Response will be a CSV file with headers and data rows.

## Common Data Structures

### Services

```json
{
  "id": "string",
  "collection": "services",
  "slug": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "contact": {
    "name": "string",
    "email": "string",
    "phone": "string"
  },
  "location": {
    "address": "string",
    "coordinates": {
      "lat": "number",
      "lng": "number"
    }
  },
  "socialMedia": {
    "facebook": "string",
    "twitter": "string",
    "instagram": "string"
  },
  "verified": "boolean",
  "status": "string"
}
```

### Resources

```json
{
  "id": "string",
  "collection": "resources",
  "slug": "string",
  "title": "string",
  "description": "string",
  "category": "string",
  "author": "string",
  "fileType": "string",
  "fileSize": "string",
  "downloadUrl": "string",
  "resourceUrl": "string"
}
```

### Events

```json
{
  "id": "string",
  "collection": "events",
  "slug": "string",
  "title": "string",
  "description": "string",
  "date": "string (ISO date)",
  "time": "string",
  "location": "string",
  "organizer": "string",
  "category": "string",
  "featured": "boolean"
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request:

- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

Error response example:

```json
{
  "success": false,
  "error": {
    "code": 404,
    "message": "Collection not found"
  }
}
```

## Rate Limiting

Currently, there are no rate limits in place. However, we recommend limiting requests to a reasonable number to ensure optimal performance for all users.

## Testing the API

You can test the API using our interactive API Test Dashboard:

```
/test-api
```

This dashboard allows you to:
- Test different API endpoints
- Try various request options
- View response data
- Check the status of all collections

## Examples

### Fetch Resources with JavaScript

```javascript
async function fetchResources() {
  try {
    const response = await fetch('https://services.dzaleka.com/api/resources');
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching resources:', error);
  }
}
```

### Export Multiple Collections with JavaScript

```javascript
async function exportCollections() {
  try {
    const response = await fetch('https://services.dzaleka.com/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        format: 'json',
        collections: ['resources', 'services'],
        options: {
          includeMetadata: true,
          includeStats: true
        }
      })
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error exporting collections:', error);
  }
}
```

## Support

If you have any questions or need assistance with the API, please contact our development team at contact@mail.dzaleka.com.

## Changelog

### Version 1.0.0 (March 8, 2025)
- Initial release of the API
- Support for all collections
- JSON and CSV export formats
- Metadata and statistics options 