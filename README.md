# 🌍 Travel Agent MCP Server

A comprehensive Model Context Protocol (MCP) server that transforms any LLM into a professional AI travel agent. This server provides powerful tools for searching flights, hotels, activities, creating itineraries, and facilitating bookings - all through a natural conversation interface.

## ✨ Features

### 🎯 Travel Agent Mode
Activate "travel agent mode" to fundamentally transform the LLM's workflow into a professional travel consultant with:
- Structured consultation process
- Proactive trip planning
- Budget estimation
- Comprehensive booking assistance

### 🛠️ Comprehensive Tools

1. **Location & Mapping**
   - `search_location` - Find destinations, attractions, and points of interest
   - `get_directions` - Get routes and travel times between locations

2. **Flight Search**
   - `search_flights` - Search flights with pricing, schedules, and booking links
   - Support for one-way and round-trip flights
   - Multiple airline options with comparison

3. **Hotel Search**
   - `search_hotels` - Find accommodations with ratings, amenities, and prices
   - Filter by price range and guest count
   - Direct booking links to major platforms

4. **Activities & Attractions**
   - `find_activities` - Discover tours, experiences, and things to do
   - Categories: tours, food & drink, culture, adventure, entertainment
   - Pricing and duration information

5. **Trip Planning**
   - `create_itinerary` - Build detailed day-by-day travel plans
   - `calculate_trip_budget` - Estimate total trip costs by category
   - `get_travel_tips` - Visa, weather, currency, and cultural information

6. **Booking Assistance**
   - `add_to_cart` - Generate booking URLs and step-by-step instructions
   - Integration with major travel platforms (Booking.com, Skyscanner, Viator, etc.)

## 🚀 Installation

### Option 1: Install via Smithery (Recommended)

The easiest way to install this MCP server is through [Smithery](https://smithery.ai):

```bash
npx -y @smithery/cli install travel-agent-mcp-server
```

This will automatically:
- Install the server
- Configure it in your MCP client
- Set up environment variables

### Option 2: Manual Installation

#### Prerequisites
- Node.js 18 or higher
- npm or yarn

#### Setup Steps

1. Clone this repository:
```bash
git clone https://github.com/iclickfreedownloads/travel-agent-mcp-server.git
cd travel-agent-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Set up API keys (see [API Keys Setup](#-api-keys-setup) below):
```bash
cp .env.example .env
# Edit .env and add your API keys
```

4. Build the project:
```bash
npm run build
```

## 🔑 API Keys Setup

This server works in multiple modes:

### Mode 1: Mock Data (No API keys needed)
Perfect for testing! The server uses realistic mock data for all searches.

### Mode 2: Free APIs (Recommended)
Get free API keys for best results:

| Service | Purpose | Free Tier | Get API Key |
|---------|---------|-----------|-------------|
| **Google Maps** | Location search | $200/month credit | [Get Key](https://console.cloud.google.com/) |
| **Amadeus** | Flight search | 2,000 calls/month | [Get Key](https://developers.amadeus.com/) |
| **RapidAPI** | Hotels & activities | 100-500/month | [Get Key](https://rapidapi.com/) |
| **OpenWeather** | Weather info | 1,000 calls/day | [Get Key](https://openweathermap.org/api) |
| **ExchangeRate-API** | Currency | 1,500/month | [Get Key](https://www.exchangerate-api.com/) |

**Quick Setup:**
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:
   ```env
   GOOGLE_MAPS_API_KEY=your_key_here
   AMADEUS_API_KEY=your_key_here
   AMADEUS_API_SECRET=your_secret_here
   RAPIDAPI_KEY=your_key_here
   OPENWEATHER_API_KEY=your_key_here
   ```

3. Restart the server

**📚 For detailed API setup instructions, see [API_KEYS.md](./API_KEYS.md)**

### Mode 3: Web Scraping Fallback
Enable web scraping for when APIs aren't available:
```env
ENABLE_WEB_SCRAPING=true
```

## 📝 Configuration

Add this server to your MCP client configuration file:

### For Claude Desktop

Edit your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the server configuration:

```json
{
  "mcpServers": {
    "travel-agent": {
      "command": "node",
      "args": ["/absolute/path/to/travel-agent-mcp-server/build/index.js"]
    }
  }
}
```

### For Other MCP Clients

Configure according to your client's documentation, using:
- **Command**: `node`
- **Args**: `["/path/to/travel-agent-mcp-server/build/index.js"]`

## 🎮 Usage

### Activating Travel Agent Mode

Once connected, activate travel agent mode by saying:

```
"travel agent mode"
```

Or use the prompt:

```
"Use the travel_agent_mode prompt"
```

The LLM will transform into a professional travel agent and guide you through the planning process!

### Example Conversation Flow

```
You: travel agent mode

AI: 🌍 Hello! I'm excited to help you plan your trip! To get started, I'd love to know:

1. Where would you like to go?
2. What are your travel dates?
3. How many people will be traveling?
4. What's your approximate budget?
5. What type of experience are you looking for?

You: I want to go to Paris for 5 days in June with my partner. Budget around $5000.

AI: Wonderful choice! Let me search for some options for your Paris trip...
[Uses search_flights, search_hotels, find_activities tools]

Here are some great flight options I found:
- Global Airways: $450/person, direct flight, 8:00 AM departure...
[Presents options and builds itinerary]
```

### Using Individual Tools

You can also use tools directly:

```
"Search for hotels in Tokyo from June 15 to June 20 for 2 guests"
"Find flights from New York to London on July 1st"
"What activities can I do in Barcelona?"
"Create an itinerary for my 3-day trip to Rome"
```

## 🔧 Available Tools

| Tool | Purpose | Key Parameters |
|------|---------|----------------|
| `search_location` | Find locations | query |
| `get_directions` | Get routes | origin, destination, mode |
| `search_hotels` | Find accommodations | location, checkIn, checkOut, guests |
| `search_flights` | Search flights | from, to, date, passengers |
| `find_activities` | Discover things to do | location, category |
| `create_itinerary` | Build trip plan | destination, dates, items |
| `add_to_cart` | Get booking links | itemType, details, bookingUrl |
| `get_travel_tips` | Travel information | destination |
| `calculate_trip_budget` | Estimate costs | destination, duration, style |

## 🎨 Customization

### Mock Data vs Real APIs

The current implementation uses mock data for demonstration. To integrate with real travel APIs:

1. **Flight APIs**:
   - Amadeus API
   - Skyscanner API
   - Google Flights API

2. **Hotel APIs**:
   - Booking.com API
   - Expedia API
   - Hotels.com API

3. **Activities APIs**:
   - Viator API
   - GetYourGuide API
   - TripAdvisor API

4. **Maps/Location**:
   - Google Maps API
   - Mapbox API

Replace the `generateMock*` functions in `src/index.ts` with actual API calls.

### Adding New Tools

To add new tools, edit `src/index.ts`:

1. Add tool definition to the `TOOLS` array
2. Add handler in the `CallToolRequestSchema` switch statement
3. Rebuild: `npm run build`

## 📖 Development

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run watch
```

### Start Server
```bash
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this in your own projects!

## 🙏 Acknowledgments

Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk) by Anthropic.

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Travels!** ✈️🏨🗺️
