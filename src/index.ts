#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { config } from './config.js';
import {
  GoogleMapsClient,
  AmadeusClient,
  RapidAPIClient,
  OpenWeatherClient,
  WebScraper,
} from './api-clients.js';
import {
  generateMockLocations,
  generateMockHotels,
  generateMockFlights,
  generateMockActivities,
  generateMockDirections,
} from './mock-data.js';

// Initialize API clients (only if API keys are provided)
const googleMapsClient = config.googleMapsApiKey ? new GoogleMapsClient(config.googleMapsApiKey) : null;
const amadeusClient =
  config.amadeusApiKey && config.amadeusApiSecret
    ? new AmadeusClient(config.amadeusApiKey, config.amadeusApiSecret)
    : null;
const rapidApiClient = config.rapidApiKey ? new RapidAPIClient(config.rapidApiKey) : null;
const openWeatherClient = config.openWeatherApiKey ? new OpenWeatherClient(config.openWeatherApiKey) : null;
const webScraper = config.enableWebScraping ? new WebScraper() : null;

// Itinerary type
interface ItineraryItem {
  date: string;
  time?: string;
  type: 'flight' | 'hotel' | 'activity' | 'other';
  title: string;
  details: string;
  bookingUrl?: string;
}

// ============================================================================
// TOOL IMPLEMENTATIONS
// ============================================================================

async function searchLocation(query: string) {
  // Try Google Maps API first
  if (!config.useMockData && googleMapsClient) {
    const results = await googleMapsClient.searchLocation(query);
    if (results.length > 0) {
      return results;
    }
  }

  // Fallback to mock data
  return generateMockLocations(query);
}

async function getDirections(origin: string, destination: string, mode: string = 'driving') {
  // Try Google Maps API first
  if (!config.useMockData && googleMapsClient) {
    const result = await googleMapsClient.getDirections(origin, destination, mode);
    if (result) {
      return result;
    }
  }

  // Fallback to mock data
  return generateMockDirections(origin, destination, mode);
}

async function searchHotels(location: string, checkIn: string, checkOut: string, guests: number = 2, maxPrice?: number) {
  let hotels: any[] = [];

  // Try RapidAPI first
  if (!config.useMockData && rapidApiClient) {
    hotels = await rapidApiClient.searchHotels(location, checkIn, checkOut, guests);
  }

  // Try web scraping if no results
  if (hotels.length === 0 && webScraper) {
    hotels = await webScraper.scrapeHotels(location, checkIn, checkOut);
  }

  // Fallback to mock data
  if (hotels.length === 0) {
    hotels = generateMockHotels(location, checkIn, checkOut, guests);
  }

  // Apply price filter if specified
  if (maxPrice) {
    hotels = hotels.filter((h) => h.pricePerNight <= maxPrice);
  }

  return hotels;
}

async function searchFlights(from: string, to: string, date: string, passengers: number = 1) {
  // Try Amadeus API first
  if (!config.useMockData && amadeusClient) {
    const flights = await amadeusClient.searchFlights(from, to, date, passengers);
    if (flights.length > 0) {
      return flights;
    }
  }

  // Fallback to mock data
  return generateMockFlights(from, to, date, passengers);
}

async function findActivities(location: string, category: string = 'all') {
  let activities: any[] = [];

  // Try RapidAPI first
  if (!config.useMockData && rapidApiClient) {
    activities = await rapidApiClient.searchActivities(location);
  }

  // Fallback to mock data
  if (activities.length === 0) {
    activities = generateMockActivities(location);
  }

  // Filter by category if specified
  if (category !== 'all') {
    activities = activities.filter((a) => a.category.toLowerCase().replace(/\s+/g, '_') === category);
  }

  return activities;
}

async function getTravelTips(destination: string, travelDate?: string) {
  const tips: any = {
    destination: destination,
    travelDate: travelDate,
    visaRequirements: `Check if you need a visa for ${destination}. Requirements vary by nationality. Visit your destination country's embassy website for specific requirements.`,
    weather: {
      condition: 'Varies by season',
      recommendation: 'Check weather forecast closer to travel date',
    },
    currency: {
      info: 'Local currency information',
      exchangeRate: 'Check current exchange rates before traveling',
      paymentTips: 'Credit cards widely accepted in most areas, but carry some local currency',
    },
    localCustoms: [
      'Research local customs and etiquette before your trip',
      'Learn basic phrases in the local language',
      'Respect dress codes, especially at religious sites',
      'Understand local tipping customs',
    ],
    safety: [
      'Register with your embassy before traveling',
      'Keep copies of important documents (passport, insurance)',
      'Be aware of common scams in tourist areas',
      'Purchase comprehensive travel insurance',
    ],
    healthTips: [
      'Check if any vaccinations are required or recommended',
      'Bring necessary medications with prescriptions',
      'Research if tap water is safe to drink',
      'Know the location of nearby hospitals and emergency services',
    ],
    packingTips: [
      'Check airline baggage allowance and restrictions',
      'Pack appropriate clothing for the local weather and culture',
      'Bring a universal power adapter for electronics',
      'Keep valuables in your carry-on luggage',
    ],
  };

  // Add real weather data if available
  if (openWeatherClient) {
    const weather = await openWeatherClient.getWeather(destination, travelDate);
    if (weather) {
      tips.weather = {
        condition: weather.condition,
        temperature: `${weather.temperature}°C`,
        humidity: `${weather.humidity}%`,
        recommendation: `Current conditions: ${weather.condition}. Pack accordingly!`,
      };
    }
  }

  return tips;
}

function calculateTripBudget(destination: string, duration: number, travelers: number = 1, style: string = 'moderate') {
  const styleMultipliers: Record<string, number> = {
    budget: 0.5,
    moderate: 1.0,
    luxury: 2.5,
  };

  const multiplier = styleMultipliers[style] || 1.0;
  const baseFlightCost = 500 * multiplier;
  const baseHotelPerNight = 150 * multiplier;
  const baseFoodPerDay = 60 * multiplier;
  const baseActivitiesPerDay = 80 * multiplier;
  const baseMiscPerDay = 40 * multiplier;

  const breakdown = {
    flights: baseFlightCost * travelers,
    accommodation: baseHotelPerNight * duration * travelers,
    food: baseFoodPerDay * duration * travelers,
    activities: baseActivitiesPerDay * duration * travelers,
    miscellaneous: baseMiscPerDay * duration * travelers,
  };

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    destination: destination,
    duration: duration,
    travelers: travelers,
    style: style,
    breakdown: breakdown,
    total: Math.round(total),
    perPerson: Math.round(total / travelers),
    currency: config.defaultCurrency,
    notes: [
      'This is an estimate. Actual costs may vary significantly.',
      'Booking in advance often provides better deals.',
      'Look for package deals to save money.',
      'Budget extra for souvenirs and unexpected expenses.',
      'Consider travel insurance in your budget.',
    ],
  };
}

// ============================================================================
// MCP SERVER SETUP
// ============================================================================

const server = new Server(
  {
    name: 'travel-agent-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

// Define all tools
const TOOLS: Tool[] = [
  {
    name: 'search_location',
    description:
      'Search for a location and get detailed information including coordinates, address, and place ID. Use this to find destinations, hotels, attractions, or any geographic location.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: "The location to search for (e.g., 'Eiffel Tower', 'Tokyo', 'hotels in Paris')",
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_directions',
    description: 'Get directions between two locations including distance, estimated travel time, and route details.',
    inputSchema: {
      type: 'object',
      properties: {
        origin: {
          type: 'string',
          description: 'Starting location',
        },
        destination: {
          type: 'string',
          description: 'Destination location',
        },
        mode: {
          type: 'string',
          enum: ['driving', 'walking', 'transit', 'bicycling'],
          description: 'Travel mode',
          default: 'driving',
        },
      },
      required: ['origin', 'destination'],
    },
  },
  {
    name: 'search_hotels',
    description:
      'Search for hotels in a specific location with detailed information including prices, ratings, amenities, and booking links.',
    inputSchema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City or area to search for hotels',
        },
        checkIn: {
          type: 'string',
          description: 'Check-in date (YYYY-MM-DD format)',
        },
        checkOut: {
          type: 'string',
          description: 'Check-out date (YYYY-MM-DD format)',
        },
        guests: {
          type: 'number',
          description: 'Number of guests',
          default: 2,
        },
        maxPrice: {
          type: 'number',
          description: 'Maximum price per night (optional)',
        },
      },
      required: ['location', 'checkIn', 'checkOut'],
    },
  },
  {
    name: 'search_flights',
    description:
      'Search for flights between two cities with detailed information including prices, airlines, schedules, and booking links.',
    inputSchema: {
      type: 'object',
      properties: {
        from: {
          type: 'string',
          description: 'Departure city or airport code',
        },
        to: {
          type: 'string',
          description: 'Arrival city or airport code',
        },
        date: {
          type: 'string',
          description: 'Departure date (YYYY-MM-DD format)',
        },
        returnDate: {
          type: 'string',
          description: 'Return date for round trip (YYYY-MM-DD format, optional)',
        },
        passengers: {
          type: 'number',
          description: 'Number of passengers',
          default: 1,
        },
        class: {
          type: 'string',
          enum: ['economy', 'premium_economy', 'business', 'first'],
          description: 'Cabin class',
          default: 'economy',
        },
      },
      required: ['from', 'to', 'date'],
    },
  },
  {
    name: 'find_activities',
    description:
      'Find activities, attractions, tours, and things to do at a destination with pricing, ratings, and booking information.',
    inputSchema: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City or destination',
        },
        category: {
          type: 'string',
          enum: ['all', 'tours', 'food_drink', 'culture', 'adventure', 'entertainment', 'relaxation'],
          description: 'Type of activities to search for',
          default: 'all',
        },
        date: {
          type: 'string',
          description: 'Date for the activity (YYYY-MM-DD format, optional)',
        },
      },
      required: ['location'],
    },
  },
  {
    name: 'create_itinerary',
    description:
      'Create a comprehensive travel itinerary with flights, hotels, activities, and other travel details organized by date.',
    inputSchema: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          description: 'Main destination',
        },
        startDate: {
          type: 'string',
          description: 'Trip start date (YYYY-MM-DD format)',
        },
        endDate: {
          type: 'string',
          description: 'Trip end date (YYYY-MM-DD format)',
        },
        items: {
          type: 'array',
          description: 'Array of itinerary items to include',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string' },
              time: { type: 'string' },
              type: { type: 'string', enum: ['flight', 'hotel', 'activity', 'other'] },
              title: { type: 'string' },
              details: { type: 'string' },
              bookingUrl: { type: 'string' },
            },
            required: ['date', 'type', 'title', 'details'],
          },
        },
      },
      required: ['destination', 'startDate', 'endDate', 'items'],
    },
  },
  {
    name: 'add_to_cart',
    description:
      'Generate booking URLs and instructions to add flights, hotels, or activities to cart on booking websites. Provides direct links and step-by-step guidance.',
    inputSchema: {
      type: 'object',
      properties: {
        itemType: {
          type: 'string',
          enum: ['flight', 'hotel', 'activity'],
          description: 'Type of item to add to cart',
        },
        itemDetails: {
          type: 'object',
          description: 'Details of the item to book',
        },
        bookingUrl: {
          type: 'string',
          description: 'Direct booking URL for the item',
        },
      },
      required: ['itemType', 'itemDetails', 'bookingUrl'],
    },
  },
  {
    name: 'get_travel_tips',
    description: 'Get travel tips, visa requirements, weather information, currency, and local customs for a destination.',
    inputSchema: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          description: 'Destination city or country',
        },
        travelDate: {
          type: 'string',
          description: 'Travel date (YYYY-MM-DD format, optional)',
        },
      },
      required: ['destination'],
    },
  },
  {
    name: 'calculate_trip_budget',
    description:
      'Calculate estimated budget for a trip including flights, accommodation, activities, food, and miscellaneous expenses.',
    inputSchema: {
      type: 'object',
      properties: {
        destination: {
          type: 'string',
          description: 'Destination',
        },
        duration: {
          type: 'number',
          description: 'Trip duration in days',
        },
        travelers: {
          type: 'number',
          description: 'Number of travelers',
          default: 1,
        },
        style: {
          type: 'string',
          enum: ['budget', 'moderate', 'luxury'],
          description: 'Travel style',
          default: 'moderate',
        },
      },
      required: ['destination', 'duration'],
    },
  },
];

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'search_location': {
        const { query } = args as { query: string };
        const locations = await searchLocation(query);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  query: query,
                  results: locations,
                  count: locations.length,
                  message: `Found ${locations.length} location(s) matching "${query}"`,
                  dataSource: config.useMockData || !googleMapsClient ? 'mock' : 'google_maps',
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'get_directions': {
        const { origin, destination, mode = 'driving' } = args as {
          origin: string;
          destination: string;
          mode?: string;
        };

        const directions = await getDirections(origin, destination, mode);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  ...directions,
                  dataSource: config.useMockData || !googleMapsClient ? 'mock' : 'google_maps',
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'search_hotels': {
        const { location, checkIn, checkOut, guests = 2, maxPrice } = args as {
          location: string;
          checkIn: string;
          checkOut: string;
          guests?: number;
          maxPrice?: number;
        };

        const hotels = await searchHotels(location, checkIn, checkOut, guests, maxPrice);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  location: location,
                  checkIn: checkIn,
                  checkOut: checkOut,
                  guests: guests,
                  results: hotels,
                  count: hotels.length,
                  searchUrl: `https://www.booking.com/search?location=${encodeURIComponent(location)}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`,
                  dataSource: config.useMockData || !rapidApiClient ? 'mock' : 'rapidapi',
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'search_flights': {
        const { from, to, date, returnDate, passengers = 1, class: cabinClass = 'economy' } = args as {
          from: string;
          to: string;
          date: string;
          returnDate?: string;
          passengers?: number;
          class?: string;
        };

        const flights = await searchFlights(from, to, date, passengers);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  from: from,
                  to: to,
                  date: date,
                  returnDate: returnDate,
                  passengers: passengers,
                  class: cabinClass,
                  results: flights,
                  count: flights.length,
                  searchUrl: `https://www.skyscanner.com/transport/flights/${from}/${to}/${date}/?adults=${passengers}`,
                  dataSource: config.useMockData || !amadeusClient ? 'mock' : 'amadeus',
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'find_activities': {
        const { location, category = 'all', date } = args as {
          location: string;
          category?: string;
          date?: string;
        };

        const activities = await findActivities(location, category);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  location: location,
                  category: category,
                  date: date,
                  results: activities,
                  count: activities.length,
                  searchUrl: `https://www.viator.com/search?location=${encodeURIComponent(location)}`,
                  dataSource: config.useMockData || !rapidApiClient ? 'mock' : 'rapidapi',
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'create_itinerary': {
        const { destination, startDate, endDate, items } = args as {
          destination: string;
          startDate: string;
          endDate: string;
          items: ItineraryItem[];
        };

        // Sort items by date
        const sortedItems = [...items].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const itinerary = {
          destination: destination,
          startDate: startDate,
          endDate: endDate,
          duration: Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)),
          items: sortedItems,
          summary: {
            totalFlights: sortedItems.filter((i) => i.type === 'flight').length,
            totalHotels: sortedItems.filter((i) => i.type === 'hotel').length,
            totalActivities: sortedItems.filter((i) => i.type === 'activity').length,
          },
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(itinerary, null, 2),
            },
          ],
        };
      }

      case 'add_to_cart': {
        const { itemType, itemDetails, bookingUrl } = args as {
          itemType: string;
          itemDetails: Record<string, unknown>;
          bookingUrl: string;
        };

        const instructions = {
          itemType: itemType,
          itemDetails: itemDetails,
          bookingUrl: bookingUrl,
          steps: [
            `1. Click this link to open the booking page: ${bookingUrl}`,
            '2. Review the details and verify all information is correct',
            "3. Click 'Add to Cart' or 'Book Now' button on the website",
            "4. Follow the website's checkout process to complete your booking",
            '5. You may need to create an account or sign in to proceed',
          ],
          note: 'This link will take you directly to the booking website where you can complete your reservation. Make sure to check cancellation policies and terms before booking.',
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(instructions, null, 2),
            },
          ],
        };
      }

      case 'get_travel_tips': {
        const { destination, travelDate } = args as {
          destination: string;
          travelDate?: string;
        };

        const tips = await getTravelTips(destination, travelDate);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  ...tips,
                  dataSource: openWeatherClient ? 'mixed' : 'general',
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'calculate_trip_budget': {
        const { destination, duration, travelers = 1, style = 'moderate' } = args as {
          destination: string;
          duration: number;
          travelers?: number;
          style?: string;
        };

        const budget = calculateTripBudget(destination, duration, travelers, style);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(budget, null, 2),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Define prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'travel_agent_mode',
        description:
          'Activates Travel Agent Mode - transforms the LLM into a professional AI travel agent with comprehensive planning and booking capabilities',
        arguments: [
          {
            name: 'client_name',
            description: "Name of the client you're helping (optional)",
            required: false,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'travel_agent_mode') {
    const clientName = (args?.client_name as string) || 'valued client';

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `🌍 TRAVEL AGENT MODE ACTIVATED 🌍

You are now operating as a professional AI Travel Agent. Your primary mission is to help ${clientName} plan and book an amazing trip.

## Your Role & Capabilities:

As a travel agent, you have access to powerful tools to search for flights, hotels, activities, and create comprehensive itineraries. Your goal is to:

1. **Understand the client's needs**: Ask about their destination, dates, budget, preferences, and travel style
2. **Research options**: Use your tools to find flights, hotels, and activities
3. **Provide recommendations**: Suggest the best options based on their requirements
4. **Create itineraries**: Build detailed day-by-day plans
5. **Facilitate bookings**: Generate booking links and provide clear instructions

## Your Tools:

- **search_location**: Find destinations and attractions with coordinates and addresses
- **get_directions**: Get directions between locations
- **search_hotels**: Find hotels with pricing, ratings, and amenities
- **search_flights**: Search flights with schedules and pricing
- **find_activities**: Discover tours, attractions, and things to do
- **create_itinerary**: Build comprehensive trip itineraries
- **add_to_cart**: Generate booking URLs and instructions
- **get_travel_tips**: Provide visa, weather, currency, and cultural information
- **calculate_trip_budget**: Estimate total trip costs

## Your Workflow:

1. **Initial Consultation**:
   - Greet the client warmly
   - Ask key questions: Where? When? How long? Who's traveling? Budget? Interests?

2. **Research & Options**:
   - Search for flights using search_flights
   - Find hotels using search_hotels
   - Discover activities using find_activities
   - Present 3-4 options in each category

3. **Refinement**:
   - Get client feedback on options
   - Adjust search parameters based on preferences
   - Provide travel tips using get_travel_tips

4. **Itinerary Creation**:
   - Build a detailed itinerary using create_itinerary
   - Include flights, hotels, activities, and free time
   - Calculate total budget using calculate_trip_budget

5. **Booking Assistance**:
   - Use add_to_cart to provide booking URLs
   - Give clear step-by-step booking instructions
   - Remind about cancellation policies

## Your Personality:

- Professional yet friendly and enthusiastic
- Detail-oriented and organized
- Proactive in suggesting ideas
- Patient and attentive to client needs
- Knowledgeable about travel best practices
- Focused on creating memorable experiences

## Important Guidelines:

- Always verify dates, locations, and passenger counts
- Provide multiple options at different price points
- Consider travel logistics (flight times, distances between locations)
- Mention important details (visas, weather, local customs)
- Be transparent about pricing and booking processes
- Follow up to ensure all client questions are answered

## Example Opening:

"Hello ${clientName}! 👋 I'm excited to help you plan your trip! To get started, I'd love to know:

1. Where would you like to go?
2. What are your travel dates?
3. How many people will be traveling?
4. What's your approximate budget?
5. What type of experience are you looking for (relaxation, adventure, culture, etc.)?

Let's create an amazing travel experience together!"

---

You are now in Travel Agent Mode. Begin by warmly greeting ${clientName} and starting the consultation process. Use your tools proactively to research and present options. Remember: your goal is to make travel planning effortless and exciting!`,
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log startup info
  console.error('Travel Agent MCP Server running on stdio');
  if (config.debugMode) {
    console.error('API Status:');
    console.error('- Google Maps:', googleMapsClient ? 'Active' : 'Mock data');
    console.error('- Amadeus:', amadeusClient ? 'Active' : 'Mock data');
    console.error('- RapidAPI:', rapidApiClient ? 'Active' : 'Mock data');
    console.error('- OpenWeather:', openWeatherClient ? 'Active' : 'Mock data');
    console.error('- Web Scraping:', webScraper ? 'Enabled' : 'Disabled');
  }
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
