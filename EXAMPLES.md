# Travel Agent MCP Server - Usage Examples

This document provides detailed examples of how to use the Travel Agent MCP Server.

## Table of Contents
- [Activating Travel Agent Mode](#activating-travel-agent-mode)
- [Individual Tool Examples](#individual-tool-examples)
- [Complete Trip Planning Example](#complete-trip-planning-example)
- [Advanced Use Cases](#advanced-use-cases)

## Activating Travel Agent Mode

The most powerful way to use this server is by activating the "travel agent mode" prompt:

```
User: travel agent mode
```

This will transform the LLM into a professional travel agent that will:
1. Greet you warmly
2. Ask about your travel preferences
3. Proactively search for options
4. Create comprehensive itineraries
5. Provide booking assistance

## Individual Tool Examples

### 1. Searching for Locations

**Simple search:**
```
User: Search for the Eiffel Tower

Response: Found location:
- Name: Eiffel Tower
- Coordinates: 48.8584, 2.2945
- Address: Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France
```

**City search:**
```
User: Find locations in Tokyo

Response: Found 3 locations in Tokyo:
1. Tokyo Tower (35.6586, 139.7454)
2. Senso-ji Temple (35.7148, 139.7967)
3. Shibuya Crossing (35.6595, 139.7004)
```

### 2. Getting Directions

```
User: Get directions from Times Square to Central Park

Response:
- Distance: 15.3 km
- Duration: 22 minutes (driving)
- Route: Take the main route from Times Square to Central Park
- Map: [Google Maps URL]
```

### 3. Searching Hotels

**Basic search:**
```
User: Search for hotels in Paris from June 15 to June 20 for 2 guests

Response: Found 4 hotels:

1. Grand Paris Hotel
   - Price: $250/night
   - Rating: 4.5/5
   - Amenities: Free WiFi, Pool, Gym, Restaurant, Bar
   - Booking: [URL]

2. Paris Boutique Inn
   - Price: $180/night
   - Rating: 4.3/5
   - Amenities: Free WiFi, Breakfast Included, Rooftop Terrace
   - Booking: [URL]

3. Budget Stay Paris
   - Price: $95/night
   - Rating: 3.9/5
   - Amenities: Free WiFi, 24/7 Reception
   - Booking: [URL]

4. Luxury Paris Resort
   - Price: $450/night
   - Rating: 4.8/5
   - Amenities: Free WiFi, Spa, Pool, Gym, Restaurant, Bar, Concierge
   - Booking: [URL]
```

**With price filter:**
```
User: Search for hotels in Paris under $200 per night from June 15-20

Response: Found 2 hotels matching your budget...
```

### 4. Searching Flights

**One-way flight:**
```
User: Find flights from New York to London on July 1st for 2 passengers

Response: Found 3 flights:

1. Global Airways GA123
   - Departure: NYC 08:00 → LHR 14:30
   - Duration: 6h 30m
   - Price: $450/person
   - Direct flight
   - Booking: [URL]

2. Budget Air BA456
   - Departure: NYC 11:00 → LHR 19:15
   - Duration: 8h 15m
   - Price: $320/person
   - 1 stop
   - Booking: [URL]

3. Premium Sky PS789
   - Departure: NYC 15:30 → LHR 22:00
   - Duration: 6h 30m
   - Price: $680/person
   - Direct flight
   - Booking: [URL]
```

**Round trip:**
```
User: Find round trip flights from New York to London, departing July 1st and returning July 10th
```

### 5. Finding Activities

**All activities:**
```
User: What activities can I do in Paris?

Response: Found 5 activities:

1. Paris City Walking Tour
   - Description: Explore historic streets and hidden gems with a local guide
   - Price Range: $30-50
   - Rating: 4.7/5
   - Duration: 3 hours
   - Category: Tours

2. Paris Food & Wine Experience
   - Description: Sample the best local cuisine and wines
   - Price Range: $80-120
   - Rating: 4.8/5
   - Duration: 4 hours
   - Category: Food & Drink

[... more activities ...]
```

**Filtered by category:**
```
User: Find food and drink activities in Paris

Response: Found food-related activities in Paris...
```

### 6. Creating an Itinerary

```
User: Create an itinerary for my Paris trip from June 15-20

Response:
Destination: Paris
Duration: 5 days
Start: June 15, 2025
End: June 20, 2025

Day 1 - June 15:
08:00 - Flight: Departure to Paris (GA123)
14:00 - Hotel: Check-in at Grand Paris Hotel
18:00 - Activity: Evening walking tour of Latin Quarter

Day 2 - June 16:
09:00 - Activity: Louvre Museum visit
14:00 - Activity: Lunch at local bistro
16:00 - Activity: Seine River cruise

Day 3 - June 17:
10:00 - Activity: Eiffel Tower visit
13:00 - Activity: Food & wine tasting tour
19:00 - Free time

[... and so on ...]

Summary:
- Total Flights: 2
- Hotels: 5 nights
- Planned Activities: 8
```

### 7. Adding to Cart / Booking

```
User: Add the Grand Paris Hotel to my booking cart

Response:
Item Type: Hotel
Booking URL: https://www.booking.com/...

Steps to book:
1. Click this link to open the booking page
2. Review the details and verify all information is correct
3. Click 'Add to Cart' or 'Book Now' button on the website
4. Follow the website's checkout process
5. You may need to create an account or sign in

Note: Check cancellation policies before booking.
```

### 8. Getting Travel Tips

```
User: Give me travel tips for Japan

Response:
Destination: Japan

Visa Requirements:
- Check if you need a visa for Japan
- Requirements vary by nationality

Weather:
- Varies by season
- Check forecast closer to travel date

Currency:
- Japanese Yen (JPY)
- Credit cards widely accepted
- Check current exchange rates

Local Customs:
- Bow when greeting
- Remove shoes when entering homes
- Don't tip (not customary)
- Be quiet on public transport

Safety Tips:
- Register with your embassy
- Keep copies of passport
- Japan is very safe for tourists

Health:
- No special vaccinations required
- Tap water is safe to drink
- Excellent healthcare system

Packing Tips:
- Universal power adapter needed
- Modest clothing for temples
- Comfortable walking shoes
```

### 9. Calculating Trip Budget

**Budget style:**
```
User: Calculate budget for 7 days in Tokyo for 2 people, budget style

Response:
Destination: Tokyo
Duration: 7 days
Travelers: 2
Style: Budget

Breakdown:
- Flights: $1,000 (2 × $500)
- Accommodation: $1,050 (7 nights × $75 × 2)
- Food: $840 (7 days × $60 × 2)
- Activities: $1,120 (7 days × $80 × 2)
- Miscellaneous: $560 (7 days × $40 × 2)

Total: $4,570
Per Person: $2,285

Notes:
- This is an estimate. Actual costs may vary.
- Book in advance for better deals.
- Look for package deals to save money.
- Budget extra for souvenirs.
```

**Luxury style:**
```
User: Calculate budget for 5 days in Paris for 2 people, luxury style

Response:
Total: $11,250
Per Person: $5,625

(Includes luxury hotels, fine dining, premium activities)
```

## Complete Trip Planning Example

Here's a full conversation showing how to plan a complete trip:

```
User: travel agent mode

AI: 🌍 Hello! I'm excited to help you plan your trip!

To get started, I'd love to know:
1. Where would you like to go?
2. What are your travel dates?
3. How many people will be traveling?
4. What's your approximate budget?
5. What type of experience are you looking for?

---

User: I want to visit Tokyo for a week in September with my wife.
Budget is around $6000 total. We love food and culture.

AI: Wonderful! Tokyo is amazing in September - the weather is pleasant
and summer crowds are gone. Let me search for some options for you.

[Searches flights]

I found some great flight options from your location to Tokyo:

1. Global Airways - Direct flight
   - Outbound: Sept 1, 08:00-14:30
   - Return: Sept 8, 16:00-11:00
   - $900/person ($1,800 total)

2. Budget Air - 1 stop
   - Outbound: Sept 1, 11:00-19:15
   - Return: Sept 8, 13:00-08:30
   - $640/person ($1,280 total)

Which option appeals to you? The direct flight is faster but the
Budget Air option saves $520.

---

User: Let's go with Budget Air to save money

AI: Great choice! That leaves us $4,720 for hotels and activities.

[Searches hotels]

For accommodations in Tokyo, I found:

1. Tokyo Boutique Inn - $180/night
   - Rating: 4.3/5
   - Near Shibuya, includes breakfast
   - Total: $1,260 (7 nights)

2. Budget Stay Tokyo - $95/night
   - Rating: 3.9/5
   - Near Shinjuku
   - Total: $665 (7 nights)

Since you mentioned loving food and culture, I'd recommend the
Boutique Inn - the breakfast is authentic Japanese style and the
location is perfect for exploring. This leaves $3,460 for activities
and meals.

---

User: Sounds good! What activities do you suggest?

AI: [Searches activities]

Perfect! Here are my top recommendations for culture and food lovers:

1. Tokyo Food & Wine Experience - $100/person
   - 4-hour culinary adventure
   - Sample sushi, ramen, sake

2. Cultural Walking Tour - $40/person
   - Visit temples, traditional neighborhoods
   - 3 hours with local guide

3. Cooking Class - $85/person
   - Learn to make sushi and ramen
   - Half day

4. Museum Pass - $60/person
   - Access to top museums
   - Full day flexibility

Would you like me to create a complete itinerary with these?

---

User: Yes please!

AI: [Creates itinerary]

Here's your complete Tokyo itinerary:

DAY 1 (Sept 1):
- 11:00 Flight departure
- 19:15 Arrive Tokyo
- Evening: Check in, explore Shibuya

DAY 2 (Sept 2):
- 09:00 Cultural Walking Tour
- 14:00 Explore Senso-ji Temple
- 18:00 Dinner in Asakusa

DAY 3 (Sept 3):
- 10:00 Cooking Class
- 15:00 Free time / Shopping
- 19:00 Tokyo Food & Wine Experience

[... continues ...]

Budget Breakdown:
- Flights: $1,280
- Hotel: $1,260
- Activities: $570
- Food (remaining): $1,890 ($270/day)

Total: $5,000 (within your $6,000 budget!)

Would you like me to provide booking links?

---

User: Yes! Let's book it

AI: [Uses add_to_cart for each item]

Perfect! Here are your booking links:

1. FLIGHTS - Budget Air
   [Link with instructions]

2. HOTEL - Tokyo Boutique Inn
   [Link with instructions]

3. ACTIVITIES - Book these:
   - Food & Wine Tour: [Link]
   - Walking Tour: [Link]
   - Cooking Class: [Link]

I've also prepared some travel tips:
- No visa needed for US citizens (up to 90 days)
- Best to exchange some cash at airport
- Download Google Translate app
- JR Pass might save money if doing day trips

Have an amazing trip to Tokyo! Let me know if you need anything else.
```

## Advanced Use Cases

### Multi-City Trip

```
User: Plan a 2-week trip to Japan visiting Tokyo, Kyoto, and Osaka

AI: [Searches locations, hotels in each city, trains between cities]
[Creates comprehensive itinerary with travel days]
```

### Group Travel

```
User: Find hotels and activities for 8 people in Barcelona

AI: [Adjusts searches for group size]
[Suggests group-friendly activities]
[Calculates group discounts]
```

### Last-Minute Travel

```
User: I need a weekend getaway leaving tomorrow

AI: [Prioritizes availability]
[Focuses on flexible bookings]
[Suggests nearby destinations]
```

### Special Occasions

```
User: Plan a honeymoon to Bali

AI: [Focuses on romantic activities]
[Suggests couples' hotels and spas]
[Creates romantic itinerary]
```

---

## Tips for Best Results

1. **Be Specific**: Include dates, budget, and preferences
2. **Ask Follow-ups**: Refine searches based on initial results
3. **Use Tools Directly**: For quick searches, ask for specific tools
4. **Activate Travel Mode**: For comprehensive planning, use "travel agent mode"
5. **Provide Feedback**: Tell the AI what you like or don't like

Happy travels! 🌍✈️