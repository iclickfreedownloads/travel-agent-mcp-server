# API Keys Configuration Guide

This document provides detailed information about all API keys needed for the Travel Agent MCP Server, including free tier options and setup instructions.

## Overview

The Travel Agent MCP Server can work in multiple modes:
1. **Mock Data Mode** (Default) - No API keys required, uses sample data
2. **Partial API Mode** - Some API keys configured, falls back to mock data for others
3. **Full API Mode** - All API keys configured for complete functionality

## Required APIs

### 1. Google Maps Platform API (Recommended)

**Purpose**: Location search, geocoding, directions, and place details

**Cost**: Free tier available
- $200 free credit per month
- Pay-as-you-go after free tier
- Maps JavaScript API: $7 per 1,000 requests
- Geocoding API: $5 per 1,000 requests
- Directions API: $5 per 1,000 requests

**How to Get**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
   - Places API
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key
6. (Optional but recommended) Restrict the API key to specific APIs and domains

**Environment Variable**: `GOOGLE_MAPS_API_KEY`

**Free Alternative**:
- **OpenStreetMap Nominatim** (Free, no API key required)
- **Mapbox** (50,000 free requests/month)

---

### 2. Amadeus Travel API (Flights)

**Purpose**: Flight search, pricing, and availability

**Cost**: Free tier available
- Free self-service tier with test data
- 2,000 free API calls per month to production
- Full production access available

**How to Get**:
1. Go to [Amadeus for Developers](https://developers.amadeus.com/)
2. Click "Register" or "Get Started"
3. Create a free account
4. Create a new app in your dashboard
5. Get your API Key and API Secret
6. Start with "Test" environment, upgrade to "Production" when ready

**APIs to Enable**:
- Flight Offers Search
- Flight Inspiration Search
- Flight Cheapest Date Search

**Environment Variables**:
- `AMADEUS_API_KEY`
- `AMADEUS_API_SECRET`

**Free Alternatives**:
- **AviationStack** (Free: 100 requests/month)
- **Skyscanner API** (RapidAPI - Limited free tier)

---

### 3. RapidAPI (Hotels & Activities)

**Purpose**: Hotel searches, activity bookings, and travel services

**Cost**: Freemium model varies by API
- Most APIs have free tiers (100-500 requests/month)
- Premium tiers available

**How to Get**:
1. Go to [RapidAPI](https://rapidapi.com/)
2. Sign up for free account
3. Subscribe to these APIs (free tier):
   - **Booking.com API** (500 requests/month free)
   - **Hotels.com API** (500 requests/month free)
   - **Priceline API** (500 requests/month free)
   - **TripAdvisor API** (500 requests/month free)
4. Get your RapidAPI key from the dashboard

**Environment Variable**: `RAPIDAPI_KEY`

**Free Alternatives**:
- Web scraping (built into this server)
- **Hostelworld API** (Limited free access)

---

### 4. OpenWeatherMap API (Weather)

**Purpose**: Weather information for destinations

**Cost**: Free tier available
- 1,000 API calls per day (free)
- 60 calls per minute
- Current weather, forecasts, historical data

**How to Get**:
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" (free)
3. Verify your email
4. Go to "API Keys" tab
5. Copy your default API key or create a new one

**Environment Variable**: `OPENWEATHER_API_KEY`

**Free Alternatives**:
- **WeatherAPI.com** (1M calls/month free)
- **Open-Meteo** (Free, no API key required)

---

### 5. ExchangeRate-API (Currency Conversion)

**Purpose**: Real-time currency conversion for budget calculations

**Cost**: Free tier available
- 1,500 requests per month (free)
- No credit card required
- 170+ currencies supported

**How to Get**:
1. Go to [ExchangeRate-API](https://www.exchangerate-api.com/)
2. Click "Get Free Key"
3. Enter your email
4. Verify email and get your API key

**Environment Variable**: `EXCHANGERATE_API_KEY`

**Free Alternatives**:
- **Fixer.io** (100 requests/month free)
- **CurrencyAPI** (300 requests/month free)

---

## Optional / Alternative APIs

### 6. Viator API (Tours & Activities)

**Purpose**: Tour and activity bookings

**Cost**: Contact for pricing (no public free tier)

**How to Get**:
1. Apply at [Viator Partner Program](https://www.viator.com/partners)
2. Requires business registration
3. Approval process can take time

**Alternative**: Use RapidAPI's TripAdvisor API or web scraping

---

### 7. Skyscanner API (Flights - Alternative)

**Purpose**: Flight search and comparison

**Cost**: Via RapidAPI
- Free tier: 100 requests/month
- Basic: $10/month for 1,000 requests

**How to Get**:
1. Go to [Skyscanner API on RapidAPI](https://rapidapi.com/skyscanner/api/skyscanner-flight-search/)
2. Subscribe to free tier
3. Use your RapidAPI key

---

## Setup Instructions

### 1. Create Environment File

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

### 2. Add Your API Keys

Edit `.env` and add your keys:

```env
# Google Maps (Recommended for best location features)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Amadeus (Best for flights)
AMADEUS_API_KEY=your_amadeus_api_key_here
AMADEUS_API_SECRET=your_amadeus_api_secret_here

# RapidAPI (Hotels, activities, alternative flight searches)
RAPIDAPI_KEY=your_rapidapi_key_here

# OpenWeatherMap (Weather information)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# ExchangeRate-API (Currency conversion)
EXCHANGERATE_API_KEY=your_exchangerate_api_key_here

# Optional: Enable/disable features
USE_MOCK_DATA=false  # Set to true to use mock data instead of APIs
ENABLE_WEB_SCRAPING=true  # Fallback to web scraping when APIs fail
```

### 3. Start the Server

```bash
npm install
npm run build
npm start
```

The server will automatically:
- Use real APIs when keys are configured
- Fall back to web scraping if enabled
- Use mock data as a last resort

---

## Recommended Setup for Each Tier

### Minimal Setup (Free)
Total: $0/month

```env
OPENWEATHER_API_KEY=your_key
EXCHANGERATE_API_KEY=your_key
USE_MOCK_DATA=true
ENABLE_WEB_SCRAPING=true
```

**Features**: Weather, currency conversion, mock data for flights/hotels

---

### Basic Setup (Free)
Total: $0/month

```env
GOOGLE_MAPS_API_KEY=your_key
AMADEUS_API_KEY=your_key
AMADEUS_API_SECRET=your_secret
OPENWEATHER_API_KEY=your_key
EXCHANGERATE_API_KEY=your_key
ENABLE_WEB_SCRAPING=true
```

**Features**: Real location search, real flight data (limited), weather, web scraping fallback

---

### Full Setup (Free tier)
Total: $0/month (within free limits)

```env
GOOGLE_MAPS_API_KEY=your_key
AMADEUS_API_KEY=your_key
AMADEUS_API_SECRET=your_secret
RAPIDAPI_KEY=your_key
OPENWEATHER_API_KEY=your_key
EXCHANGERATE_API_KEY=your_key
ENABLE_WEB_SCRAPING=true
```

**Features**: All features with real data (within free tier limits)

---

### Premium Setup
Total: ~$50-100/month (high usage)

Same as Full Setup but with paid tiers for higher limits

---

## Testing Your Setup

After configuring your `.env` file, test each API:

```bash
# Test location search
curl -X POST http://localhost:3000/tools/search_location \
  -d '{"query": "Paris"}'

# Test flight search
curl -X POST http://localhost:3000/tools/search_flights \
  -d '{"from": "NYC", "to": "LON", "date": "2025-06-15"}'
```

Or use the built-in test mode:

```bash
npm run test-apis
```

---

## API Rate Limits Summary

| API | Free Tier Limit | Recommended For |
|-----|----------------|----------------|
| Google Maps | $200 credit/month (~40,000 requests) | All users |
| Amadeus | 2,000 calls/month | All users |
| RapidAPI | 100-500/month per API | Basic users |
| OpenWeatherMap | 1,000 calls/day | All users |
| ExchangeRate-API | 1,500 calls/month | All users |

---

## Web Scraping Fallback

When API keys are not available or rate limits are exceeded, the server can fall back to web scraping:

**Supported Sites**:
- Google Flights (public search results)
- Booking.com (hotel listings)
- TripAdvisor (activities and reviews)

**Limitations**:
- Slower than API calls
- May break if websites change their structure
- Some sites may block scraping
- No booking functionality, only search

**Enable in `.env`**:
```env
ENABLE_WEB_SCRAPING=true
```

---

## Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Restrict API keys** - Use API key restrictions in Google Cloud, etc.
3. **Rotate keys regularly** - Change keys every 90 days
4. **Monitor usage** - Check API dashboards for unusual activity
5. **Use environment-specific keys** - Different keys for dev/prod

---

## Troubleshooting

### "API key invalid" errors
- Check that you've correctly copied the key (no extra spaces)
- Verify the API is enabled in your provider dashboard
- Check if the key has proper restrictions/permissions

### "Rate limit exceeded" errors
- You've hit your free tier limit
- Wait for the limit to reset (usually monthly)
- Upgrade to paid tier
- Enable web scraping fallback

### "No results found" errors
- API might be down - check status pages
- Your query might be malformed
- The service doesn't have data for that location/date
- Try enabling `USE_MOCK_DATA=true` temporarily

---

## Cost Estimation

For a typical travel planning session:
- Location searches: 5-10 requests
- Flight searches: 3-5 requests
- Hotel searches: 3-5 requests
- Activity searches: 2-4 requests
- Weather: 1-2 requests
- Currency: 1 request

**Total per session**: ~15-25 API calls
**Free tier capacity**: ~200-400 planning sessions per month

---

## Support

For API-specific issues:
- Google Maps: [Support](https://developers.google.com/maps/support)
- Amadeus: [Documentation](https://developers.amadeus.com/support)
- RapidAPI: [Help Center](https://docs.rapidapi.com/)
- OpenWeatherMap: [FAQ](https://openweathermap.org/faq)

For this MCP server issues:
- GitHub Issues: [Report a problem](https://github.com/iclickfreedownloads/travel-agent-mcp-server/issues)

---

**Last Updated**: 2025-10-31
