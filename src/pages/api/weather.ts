import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    // Fetch daily forecast for Dowa district
    const response = await fetch('https://www.metmalawi.gov.mw/weather/daily-table/dowa/');
    const html = await response.text();
    
    // Extract location and date information
    const locationRegex = /<h2[^>]*>([^<]+)<\/h2>/;
    const locationMatch = html.match(locationRegex);
    const location = locationMatch ? locationMatch[1].trim() : 'Dowa';
    
    // Extract date information
    const dateRegex = /<h5[^>]*>([^<]+)<\/h5>/;
    const dateMatch = html.match(dateRegex);
    const date = dateMatch ? dateMatch[1].trim() : new Date().toLocaleDateString();
    
    // Extract the first day's forecast table
    const tableRegex = /<div class="table-wrapper">\s*<table[^>]*>([\s\S]*?)<\/table>/;
    const tableMatch = html.match(tableRegex);
    
    if (!tableMatch) {
      throw new Error('Weather data table not found');
    }

    // Extract rows from the table
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
    const rows = tableMatch[1].match(rowRegex) || [];
    
    // Skip header row and get first data row
    const firstDataRow = rows[1];
    if (!firstDataRow) {
      throw new Error('Weather data not available');
    }

    // Extract cell data
    const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/g;
    const cells = firstDataRow.match(cellRegex) || [];
    
    // Clean cell content
    const cleanCell = (cell) => {
      return cell
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
    };

    // Extract weather condition from image alt text or cell content
    const getWeatherCondition = (cell) => {
      // Try to get from image alt text
      const imgRegex = /<img[^>]*alt="([^"]*)"[^>]*>/;
      const imgMatch = cell.match(imgRegex);
      if (imgMatch) {
        return imgMatch[1].trim();
      }

      // Try to get from title attribute
      const titleRegex = /title="([^"]*)"/;
      const titleMatch = cell.match(titleRegex);
      if (titleMatch) {
        return titleMatch[1].trim();
      }

      // Try to get from cell content
      const cleanContent = cleanCell(cell);
      if (cleanContent && cleanContent !== '') {
        return cleanContent;
      }

      // If no condition found, try to get from the image src
      const srcRegex = /<img[^>]*src="([^"]*)"[^>]*>/;
      const srcMatch = cell.match(srcRegex);
      if (srcMatch) {
        const src = srcMatch[1].toLowerCase();
        if (src.includes('rain')) return 'Rain';
        if (src.includes('cloud')) return 'Cloudy';
        if (src.includes('sun')) return 'Sunny';
        if (src.includes('clear')) return 'Clear';
      }

      return 'Unknown';
    };

    const currentWeather = {
      time: cleanCell(cells[0] || ''),
      condition: getWeatherCondition(cells[1] || ''),
      maxTemp: cleanCell(cells[2] || ''),
      minTemp: cleanCell(cells[3] || ''),
      rainfall: cleanCell(cells[4] || ''),
      windSpeed: cleanCell(cells[5] || ''),
      windDirection: cleanCell(cells[6] || '')
    };

    // Extract hourly forecast
    const hourlyForecast = rows.slice(1).map(row => {
      const cells = row.match(cellRegex) || [];
      return {
        time: cleanCell(cells[0] || ''),
        condition: getWeatherCondition(cells[1] || ''),
        maxTemp: cleanCell(cells[2] || ''),
        minTemp: cleanCell(cells[3] || ''),
        rainfall: cleanCell(cells[4] || ''),
        windSpeed: cleanCell(cells[5] || ''),
        windDirection: cleanCell(cells[6] || '')
      };
    });

    // Log the extracted data for debugging
    console.log('Current Weather Condition:', currentWeather.condition);
    console.log('First Hourly Forecast Condition:', hourlyForecast[0]?.condition);
    console.log('Raw Weather Cell:', cells[1]);

    // Generate weather alerts
    const alerts = hourlyForecast
      .filter(hour => hour.condition && hour.condition !== 'Unknown')
      .map(hour => ({
        type: hour.condition.toLowerCase().includes('rain') ? 'warning' : 
              hour.condition.toLowerCase().includes('storm') ? 'severe' : 'info',
        message: `${hour.time}: ${hour.condition} - ${hour.rainfall} rainfall, ${hour.windSpeed} km/h wind`
      }));

    return new Response(JSON.stringify({
      location,
      date,
      forecast: {
        current: {
          temperature: currentWeather.maxTemp,
          minTemperature: currentWeather.minTemp,
          condition: currentWeather.condition,
          rainfall: currentWeather.rainfall,
          windSpeed: currentWeather.windSpeed,
          windDirection: currentWeather.windDirection,
          time: currentWeather.time
        },
        hourly: hourlyForecast
      },
      alerts,
      lastUpdated: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch weather data'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 