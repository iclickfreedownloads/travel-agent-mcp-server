import { Location, Flight, Hotel, Activity } from './api-clients.js';

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

export function generateMockLocations(query: string): Location[] {
  const mockData: Record<string, Location[]> = {
    paris: [
      {
        name: 'Eiffel Tower',
        lat: 48.8584,
        lng: 2.2945,
        address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
        placeId: 'eiffel_tower_001',
      },
      {
        name: 'Louvre Museum',
        lat: 48.8606,
        lng: 2.3376,
        address: 'Rue de Rivoli, 75001 Paris, France',
        placeId: 'louvre_001',
      },
      {
        name: 'Arc de Triomphe',
        lat: 48.8738,
        lng: 2.295,
        address: 'Place Charles de Gaulle, 75008 Paris, France',
        placeId: 'arc_001',
      },
    ],
    tokyo: [
      {
        name: 'Tokyo Tower',
        lat: 35.6586,
        lng: 139.7454,
        address: '4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan',
        placeId: 'tokyo_tower_001',
      },
      {
        name: 'Senso-ji Temple',
        lat: 35.7148,
        lng: 139.7967,
        address: '2 Chome-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan',
        placeId: 'sensoji_001',
      },
      {
        name: 'Shibuya Crossing',
        lat: 35.6595,
        lng: 139.7004,
        address: 'Shibuya City, Tokyo, Japan',
        placeId: 'shibuya_001',
      },
    ],
    'new york': [
      {
        name: 'Times Square',
        lat: 40.758,
        lng: -73.9855,
        address: 'Manhattan, NY 10036, United States',
        placeId: 'times_square_001',
      },
      {
        name: 'Central Park',
        lat: 40.7829,
        lng: -73.9654,
        address: 'New York, NY, United States',
        placeId: 'central_park_001',
      },
      {
        name: 'Statue of Liberty',
        lat: 40.6892,
        lng: -74.0445,
        address: 'New York, NY 10004, United States',
        placeId: 'liberty_001',
      },
    ],
    london: [
      {
        name: 'Big Ben',
        lat: 51.5007,
        lng: -0.1246,
        address: 'Westminster, London SW1A 0AA, United Kingdom',
        placeId: 'bigben_001',
      },
      {
        name: 'Tower Bridge',
        lat: 51.5055,
        lng: -0.0754,
        address: 'Tower Bridge Rd, London SE1 2UP, United Kingdom',
        placeId: 'towerbridge_001',
      },
      {
        name: 'British Museum',
        lat: 51.5194,
        lng: -0.127,
        address: 'Great Russell St, London WC1B 3DG, United Kingdom',
        placeId: 'britishmuseum_001',
      },
    ],
  };

  const lowerQuery = query.toLowerCase();
  for (const [key, locations] of Object.entries(mockData)) {
    if (lowerQuery.includes(key)) {
      return locations;
    }
  }

  // Default fallback
  return [
    {
      name: query,
      lat: 0,
      lng: 0,
      address: `${query}, Earth`,
      placeId: `place_${Date.now()}`,
    },
  ];
}

export function generateMockHotels(location: string, checkIn: string, checkOut: string, guests: number): Hotel[] {
  return [
    {
      name: `Grand ${location} Hotel`,
      location: location,
      pricePerNight: 250,
      rating: 4.5,
      amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Bar'],
      bookingUrl: `https://www.booking.com/search?location=${encodeURIComponent(location)}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`,
      images: [],
    },
    {
      name: `${location} Boutique Inn`,
      location: location,
      pricePerNight: 180,
      rating: 4.3,
      amenities: ['Free WiFi', 'Breakfast Included', 'Rooftop Terrace'],
      bookingUrl: `https://www.booking.com/search?location=${encodeURIComponent(location)}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`,
      images: [],
    },
    {
      name: `Budget Stay ${location}`,
      location: location,
      pricePerNight: 95,
      rating: 3.9,
      amenities: ['Free WiFi', '24/7 Reception'],
      bookingUrl: `https://www.booking.com/search?location=${encodeURIComponent(location)}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`,
      images: [],
    },
    {
      name: `Luxury ${location} Resort`,
      location: location,
      pricePerNight: 450,
      rating: 4.8,
      amenities: ['Free WiFi', 'Spa', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Concierge', 'Beach Access'],
      bookingUrl: `https://www.booking.com/search?location=${encodeURIComponent(location)}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`,
      images: [],
    },
  ];
}

export function generateMockFlights(from: string, to: string, date: string, passengers: number): Flight[] {
  return [
    {
      airline: 'Global Airways',
      flightNumber: 'GA123',
      departure: { airport: from.toUpperCase().slice(0, 3), time: '08:00', city: from },
      arrival: { airport: to.toUpperCase().slice(0, 3), time: '14:30', city: to },
      price: 450,
      duration: '6h 30m',
      stops: 0,
      bookingUrl: `https://www.skyscanner.com/transport/flights/${from}/${to}/${date}/?adults=${passengers}`,
    },
    {
      airline: 'Budget Air',
      flightNumber: 'BA456',
      departure: { airport: from.toUpperCase().slice(0, 3), time: '11:00', city: from },
      arrival: { airport: to.toUpperCase().slice(0, 3), time: '19:15', city: to },
      price: 320,
      duration: '8h 15m',
      stops: 1,
      bookingUrl: `https://www.skyscanner.com/transport/flights/${from}/${to}/${date}/?adults=${passengers}`,
    },
    {
      airline: 'Premium Sky',
      flightNumber: 'PS789',
      departure: { airport: from.toUpperCase().slice(0, 3), time: '15:30', city: from },
      arrival: { airport: to.toUpperCase().slice(0, 3), time: '22:00', city: to },
      price: 680,
      duration: '6h 30m',
      stops: 0,
      bookingUrl: `https://www.skyscanner.com/transport/flights/${from}/${to}/${date}/?adults=${passengers}`,
    },
  ];
}

export function generateMockActivities(location: string): Activity[] {
  return [
    {
      name: `${location} City Walking Tour`,
      description: `Explore the historic streets and hidden gems of ${location} with a local guide`,
      location: location,
      priceRange: '$30-50',
      rating: 4.7,
      category: 'Tours',
      duration: '3 hours',
      bookingUrl: `https://www.viator.com/search?location=${encodeURIComponent(location)}`,
    },
    {
      name: `${location} Food & Wine Experience`,
      description: `Sample the best local cuisine and wines in a guided culinary adventure`,
      location: location,
      priceRange: '$80-120',
      rating: 4.8,
      category: 'Food & Drink',
      duration: '4 hours',
      bookingUrl: `https://www.viator.com/search?location=${encodeURIComponent(location)}`,
    },
    {
      name: `${location} Museum Pass`,
      description: `Skip-the-line access to top museums and cultural attractions`,
      location: location,
      priceRange: '$50-75',
      rating: 4.5,
      category: 'Culture',
      duration: 'Full day',
      bookingUrl: `https://www.getyourguide.com/search?location=${encodeURIComponent(location)}`,
    },
    {
      name: `${location} Adventure Activities`,
      description: `Thrilling outdoor activities including hiking, biking, or water sports`,
      location: location,
      priceRange: '$60-150',
      rating: 4.6,
      category: 'Adventure',
      duration: 'Half day',
      bookingUrl: `https://www.getyourguide.com/search?location=${encodeURIComponent(location)}`,
    },
    {
      name: `${location} Night Life Tour`,
      description: `Experience the vibrant nightlife and entertainment scene`,
      location: location,
      priceRange: '$40-80',
      rating: 4.4,
      category: 'Entertainment',
      duration: '4-5 hours',
      bookingUrl: `https://www.viator.com/search?location=${encodeURIComponent(location)}`,
    },
  ];
}

export function generateMockDirections(origin: string, destination: string, mode: string) {
  return {
    origin: origin,
    destination: destination,
    mode: mode,
    distance: '15.3 km',
    duration: '22 minutes',
    route: `Take the main route from ${origin} to ${destination}`,
    steps: [`Start at ${origin}`, 'Head northeast on Main St', 'Turn right onto Highway 1', `Continue to ${destination}`],
    mapUrl: `https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}`,
  };
}
