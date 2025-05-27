---
title: Dzaleka Digital Heritage CLI (DZDK) - Complete Documentation
description: The Dzaleka Digital Heritage CLI (DZDK) is a comprehensive command-line tool designed to interact with the Dzaleka Refugee Camp's digital heritage platform.
section: DZDK
---

# Dzaleka Digital Heritage CLI (DZDK)

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Configuration](#configuration)
- [Command Reference](#command-reference)
- [Interactive Shell](#interactive-shell)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Introduction

The Dzaleka Digital Heritage CLI (DZDK) is a comprehensive command-line tool designed to interact with the Dzaleka Refugee Camp's digital heritage platform. This tool provides seamless access to cultural resources, services, events, and population data through an intuitive command-line interface.

### Key Features
- 📚 Resource Management
- 🏥 Services Directory
- 📅 Event Management
- 📸 Photo Management
- 📊 Population Statistics
- 🔍 Advanced Search
- 📤 Batch Operations
- 📈 Analytics & Reporting

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Basic Installation
```bash
pip install dzdk==0.1.0
```

### Clone the Repository
```bash
git clone https://github.com/Dzaleka-Connect/dzdk-cli.git
cd dzdk-cli
```

### Create and Activate a Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install the CLI in Editable Mode
```bash
pip install -e .
```

## Configuration

The CLI stores its configuration in `~/.dzdk/config.yaml`. You can modify these settings:

- **API URL**: Base URL for the API (default: https://services.dzaleka.com/api)
- **Timeout**: Request timeout in seconds (default: 30)

### Update Configuration
```bash
# Set custom API URL
dzdk config --url "https://services.dzaleka.com/api"

# Set custom timeout
dzdk config --timeout 30

# Update both settings
dzdk config --url "https://services.dzaleka.com/api" --timeout 30

### View Current Configuration
```bash
dzdk show_config
```

You can also update both settings at once:
```bash
dzdk config --url "https://services.dzaleka.com/api" --timeout 30
```

This will update the configuration file at `~/.config/dzdk/config.yaml`.

## Command Reference

### Health Check
Check the health of all API endpoints with detailed response analysis:
```bash
# Check API health
dzdk health
```
This command provides:
- Response status codes
- Response times
- Response types (JSON/Non-JSON)
- Error messages if any

### Services Management

#### List Services
List all available services with detailed information:
```bash
# Basic list (12 items per page)
dzdk services list

# Navigate to specific page
dzdk services list --page 2

# Search for specific services
dzdk services list --search "health"

# Filter by category
dzdk services list --category "medical"

# Filter by status
dzdk services list --status active

# Sort results
dzdk services list --sort-by category --sort-order desc

# Combine filters with pagination
dzdk services list --search "clinic" --category "medical" --status active --page 1
```

Service details include:
- Service title and description
- Category and status
- Contact information (email, phone)
- Website information
- Status indicators (active/inactive/unknown)
- Total count of matching services
- Active filters display
- Page navigation (12 items per page)

Search and Filter Options:
- **Search**: Search across title, description, and category
- **Category**: Filter by specific service category
- **Status**: Filter by service status (active/inactive/unknown)
- **Sort By**: Sort results by title, category, or status
- **Sort Order**: Choose ascending or descending order

Get information about a specific service:
```bash
dzdk services get --id <service_id_or_slug>
```
Service details include:
- Service title and description
- Category and status
- Location details (address, city)
- Contact information (email, phone)
- Operating hours
- Additional metadata


### Event Management

#### List Events
List all events with key information:
```bash
# Basic list (12 items per page)
dzdk events list

# Navigate to specific page
dzdk events list --page 2

# Search and filter with pagination
dzdk events list --search "workshop" --category "education" --page 1

# Sort with pagination
dzdk events list --sort-by date --sort-order desc --page 1
```

Get detailed information about a specific event:
```bash
dzdk events get --id <event_id_or_slug>
```
Event details include:
- Title and description
- Date and time
- Location
- Registration information
- Contact details
- Tags and categories

### Photo Management

#### List Photos
List all available photos:
```bash
# Basic list (12 items per page)
dzdk photos list

# Navigate to specific page
dzdk photos list --page 2

# Search and filter with pagination
dzdk photos list --search "camp" --category "events" --page 1

# Sort with pagination
dzdk photos list --sort-by date --sort-order desc --page 1
```

Get information about a specific photo:
```bash
dzdk photos get --id <photo_id_or_slug>
```
Photo details include:
- Title and description
- Date taken
- Photographer information
- Location
- Tags and categories
- Image metadata (size, format)
- Download URL

Upload a photo to the archive:
```bash
dzdk photos upload --file path/to/image.jpg --title "Photo Title" --description "Optional description"
```

Edit photo metadata:
```bash
dzdk photos edit --id <photo_id> --title "New Title" --description "New Description" --tags "tag1,tag2" --location "New Location" --date "2024-03-20"
```

View detailed photo metadata:
```bash
dzdk photos metadata --id <photo_id>
```

### Photo Albums
Create a new album:
```bash
dzdk photos album create --name "My Album" --description "Album Description" --tags "tag1,tag2"
```

Add photos to an album:
```bash
dzdk photos album add --album-id <album_id> --photo-ids "photo1,photo2,photo3"
```

List all albums:
```bash
dzdk photos album list
```

Features:
- Album creation and management
- Photo organization
- Tag-based categorization
- Rich metadata display
- Batch photo operations
- Technical metadata viewing
- Location and date tracking

### Resource Management

#### List Resources
List all available resources:
```bash
# Basic list (12 items per page)
dzdk resources list

# Navigate to specific page
dzdk resources list --page 2

# Search and filter with pagination
dzdk resources list --search "report" --category "research" --page 1

# Sort with pagination
dzdk resources list --sort-by date --sort-order desc --page 1
```

Get detailed information about a specific resource:
```bash
dzdk resources get --id <resource_id_or_slug>
```
Resource information includes:
- Title and description
- Author and date
- File type and size
- Available languages
- Download URLs
- Version history
- Related resources

Download a resource:
```bash
dzdk resources fetch --id <resource_id_or_slug> --output filename.pdf
```

### Population Statistics

#### View Statistics
Get comprehensive population statistics:
```bash
dzdk population stats
```
Get specific demographic information:
```bash
dzdk population get --category <demographic_category>
```
Available categories:
- age_groups
- nationalities
- gender
- new_arrivals
- historical_trends

Statistics include:
- Total population
- New arrivals
- Demographics breakdown
- Nationality distribution
- Historical trends

### Search Functionality

#### Global Search
`Search across all resources with filtering and relevance sorting:
```bash
# Search across all content types
dzdk search --query "education"

# Search only in services
dzdk search --query "health" --type services

# Search with a custom result limit
dzdk search --query "event" --limit 20
```
Features:
- Cross-resource search
- Type filtering
- Relevance sorting
- Result limiting
- Rich output formatting

### Batch Operations
Download multiple resources or photos in batch:
```bash
# Download multiple resources
dzdk batch download --type resources --ids "id1,id2,id3" --output-dir downloads

# Download multiple photos
dzdk batch download --type photos --ids "photo1,photo2" --output-dir photos
```
Features:
- Parallel downloads
- Progress tracking
- Error handling
- Automatic directory creation

Upload multiple photos from a directory:
```bash
# Upload all photos from a directory
dzdk batch upload --type photos --directory ./my_photos
```
Features:
- Batch processing
- File validation
- Progress tracking
- Error handling

### Export
Export data to CSV format:
```bash
# Export services to CSV
dzdk export csv --type services --output services.csv

# Export population data to CSV
dzdk export csv --type population --output population.csv
```
Features:
- Flattened data structure
- Preserved metadata
- Proper CSV formatting

Generate detailed markdown reports:
```bash
# Generate a services report
dzdk export report --type services --output services_report.md

# Generate a population report
dzdk export report --type population --output population_report.md
```
Features:
- Comprehensive summaries
- Detailed item information
- Formatted markdown output
- Timestamps and metadata

### Statistics and Analytics

#### Service Statistics
```bash
# View service statistics
dzdk stats services

# Export service statistics
dzdk stats services --output service_stats.md
```

#### Usage Statistics
```bash
# View usage statistics
dzdk stats usage --days 30

# Export usage statistics
dzdk stats usage --days 30 --output usage_stats.md
```

## Interactive Shell

### Start Shell
Start an interactive shell session with command history and tab completion:
```bash
dzdk shell
```

Features:
- Command history persistence
- Tab completion for commands
- Command suggestions based on history
- Rich output formatting
- Built-in help system
- Screen clearing
- Easy command execution

Example shell session:
```bash
(dzdk) help
(dzdk) services list
(dzdk) photos upload --file photo.jpg --title "My Photo"
(dzdk) search --query "education"
(dzdk) clear
(dzdk) exit
```

Shell Commands:
- `help [command]`: Show help information
- `clear`: Clear the terminal screen
- `exit`: Exit the shell
- All regular CLI commands are available

## Troubleshooting

### Common Issues

1. **API Connection Issues**
   ```bash
   # Check API health
   dzdk health
   
   # Verify configuration
   dzdk show_config
   ```

2. **File Upload Issues**
   - Ensure file size is under 10MB
   - Check file permissions
   - Verify file format is supported

3. **Authentication Issues**
   - Verify API credentials
   - Check token expiration
   - Ensure proper permissions

### Error Messages

| Error | Solution |
|-------|----------|
| `API Connection Error` | Check internet connection and API URL |
| `File Not Found` | Verify file path and permissions |
| `Invalid ID` | Check resource ID format |
| `Permission Denied` | Verify user permissions |

## Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Write unit tests
- Update documentation

### Testing
```bash
# Run tests
pytest

# Run with coverage
pytest --cov=dzdk
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Dzaleka Refugee Camp Community
- UNHCR
- Local NGOs and Service Providers
- Open Source Contributors

## Support

### Documentation
- [Official Documentation](https://services.dzaleka.com/docs)
- [API Reference](https://services.dzaleka.com/docs/api-documentation/)
- [GitHub Repository](https://github.com/dzaleka/dzdk-cli)

### Contact
- Email: bakari@mail.dzaleka.com
---

*Built with ❤️ for the Dzaleka Refugee Camp Community*

Last updated: March 2025