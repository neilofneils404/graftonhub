// Fetch weather data from NWS API for Lorain County
// Coordinates: Grafton, OH (41.17°N, 82.07°W)

interface WeatherData {
  timestamp: string;
  current: {
    temp: number;
    conditions: string;
    wind: string;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    conditions: string;
  }>;
  alerts: Array<{
    event: string;
    headline: string;
    description: string;
  }>;
}

const GRAFTON_LAT = 41.1703;
const GRAFTON_LON = -82.0663;
const CACHE_FILE = 'data/weather/current.json';

async function fetchWeather(): Promise<WeatherData> {
  try {
    // Step 1: Get gridpoint data
    const pointsUrl = `https://api.weather.gov/points/${GRAFTON_LAT},${GRAFTON_LON}`;
    const pointsResponse = await fetch(pointsUrl, {
      headers: {
        'User-Agent': 'GraftonHub/1.0 (community service)'
      }
    });
    
    if (!pointsResponse.ok) {
      throw new Error(`Points API failed: ${pointsResponse.status}`);
    }
    
    const pointsData = await pointsResponse.json();
    const forecastUrl = pointsData.properties.forecast;
    const forecastHourlyUrl = pointsData.properties.forecastHourly;
    
    // Step 2: Get forecast
    const forecastResponse = await fetch(forecastUrl, {
      headers: {
        'User-Agent': 'GraftonHub/1.0 (community service)'
      }
    });
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API failed: ${forecastResponse.status}`);
    }
    
    const forecastData = await forecastResponse.json();
    const periods = forecastData.properties.periods;
    
    // Step 3: Get current conditions from hourly forecast
    const hourlyResponse = await fetch(forecastHourlyUrl, {
      headers: {
        'User-Agent': 'GraftonHub/1.0 (community service)'
      }
    });
    
    let currentTemp = periods[0].temperature;
    let currentConditions = periods[0].shortForecast;
    let currentWind = periods[0].windSpeed;
    
    if (hourlyResponse.ok) {
      const hourlyData = await hourlyResponse.json();
      const currentHour = hourlyData.properties.periods[0];
      currentTemp = currentHour.temperature;
      currentConditions = currentHour.shortForecast;
      currentWind = currentHour.windSpeed;
    }
    
    // Step 4: Get alerts for Lorain County
    const alertsUrl = 'https://api.weather.gov/alerts/active?zone=OHZ010';
    const alertsResponse = await fetch(alertsUrl, {
      headers: {
        'User-Agent': 'GraftonHub/1.0 (community service)'
      }
    });
    
    const alerts = [];
    if (alertsResponse.ok) {
      const alertsData = await alertsResponse.json();
      for (const alert of alertsData.features) {
        alerts.push({
          event: alert.properties.event,
          headline: alert.properties.headline,
          description: alert.properties.description
        });
      }
    }
    
    // Format data
    const weatherData: WeatherData = {
      timestamp: new Date().toISOString(),
      current: {
        temp: currentTemp,
        conditions: currentConditions,
        wind: currentWind
      },
      forecast: periods.slice(0, 5).map((period: any) => ({
        day: period.name,
        high: period.temperature,
        low: period.temperature, // NWS doesn't provide both in same period
        conditions: period.shortForecast
      })),
      alerts
    };
    
    return weatherData;
    
  } catch (error) {
    console.error('Weather fetch failed:', error);
    
    // Try to load cached data
    try {
      const fs = await import('fs/promises');
      const cached = await fs.readFile(CACHE_FILE, 'utf-8');
      const cachedData = JSON.parse(cached);
      console.log('Using cached weather data');
      return cachedData;
    } catch (cacheError) {
      // Return fallback data
      return {
        timestamp: new Date().toISOString(),
        current: {
          temp: 0,
          conditions: 'Data unavailable',
          wind: 'N/A'
        },
        forecast: [],
        alerts: []
      };
    }
  }
}

// Export for use in Astro pages
export { fetchWeather };
export type { WeatherData };

// CLI usage (for cron jobs)
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchWeather().then(async (data) => {
    const fs = await import('fs/promises');
    await fs.mkdir('data/weather', { recursive: true });
    await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
    console.log('Weather data updated successfully');
  }).catch(console.error);
}
