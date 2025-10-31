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

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup

1. Clone this repository:
```bash
git clone https://github.com/yourusername/travel-agent-mcp-server.git
cd travel-agent-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
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
