import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface Config {
  // API Keys
  googleMapsApiKey: string | undefined;
  amadeusApiKey: string | undefined;
  amadeusApiSecret: string | undefined;
  rapidApiKey: string | undefined;
  openWeatherApiKey: string | undefined;
  exchangeRateApiKey: string | undefined;

  // Feature flags
  useMockData: boolean;
  enableWebScraping: boolean;
  debugMode: boolean;

  // API settings
  apiTimeout: number;
  maxResults: number;
  cacheDuration: number;

  // Defaults
  defaultCurrency: string;
  defaultLanguage: string;
}

export const config: Config = {
  // API Keys
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  amadeusApiKey: process.env.AMADEUS_API_KEY,
  amadeusApiSecret: process.env.AMADEUS_API_SECRET,
  rapidApiKey: process.env.RAPIDAPI_KEY,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  exchangeRateApiKey: process.env.EXCHANGERATE_API_KEY,

  // Feature flags
  useMockData: process.env.USE_MOCK_DATA === 'true',
  enableWebScraping: process.env.ENABLE_WEB_SCRAPING === 'true',
  debugMode: process.env.DEBUG_MODE === 'true',

  // API settings
  apiTimeout: parseInt(process.env.API_TIMEOUT || '10000', 10),
  maxResults: parseInt(process.env.MAX_RESULTS || '10', 10),
  cacheDuration: parseInt(process.env.CACHE_DURATION || '3600', 10),

  // Defaults
  defaultCurrency: process.env.DEFAULT_CURRENCY || 'USD',
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'en',
};

// Log configuration status (excluding sensitive keys)
if (config.debugMode) {
  console.error('Travel Agent MCP Server Configuration:');
  console.error('- Google Maps API:', config.googleMapsApiKey ? 'Configured' : 'Not configured');
  console.error('- Amadeus API:', config.amadeusApiKey ? 'Configured' : 'Not configured');
  console.error('- RapidAPI:', config.rapidApiKey ? 'Configured' : 'Not configured');
  console.error('- OpenWeather API:', config.openWeatherApiKey ? 'Configured' : 'Not configured');
  console.error('- Use Mock Data:', config.useMockData);
  console.error('- Web Scraping:', config.enableWebScraping);
}
