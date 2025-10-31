import axios, { AxiosInstance } from 'axios';
import * as cheerio from 'cheerio';
import { config } from './config.js';

// Base types
export interface Location {
  name: string;
  lat: number;
  lng: number;
  address: string;
  placeId?: string;
}

export interface Flight {
  airline: string;
  flightNumber: string;
  departure: { airport: string; time: string; city: string };
  arrival: { airport: string; time: string; city: string };
  price: number;
  duration: string;
  stops: number;
  bookingUrl: string;
}

export interface Hotel {
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  amenities: string[];
  bookingUrl: string;
  images?: string[];
}

export interface Activity {
  name: string;
  description: string;
  location: string;
  priceRange: string;
  rating: number;
  category: string;
  duration?: string;
  bookingUrl?: string;
}

// ============================================================================
// GOOGLE MAPS API CLIENT
// ============================================================================

export class GoogleMapsClient {
  private apiKey: string;
  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://maps.googleapis.com/maps/api',
      timeout: config.apiTimeout,
    });
  }

  async searchLocation(query: string): Promise<Location[]> {
    try {
      const response = await this.client.get('/geocode/json', {
        params: {
          address: query,
          key: this.apiKey,
        },
      });

      if (response.data.status === 'OK') {
        return response.data.results.slice(0, config.maxResults).map((result: any) => ({
          name: result.formatted_address.split(',')[0],
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          address: result.formatted_address,
          placeId: result.place_id,
        }));
      }

      return [];
    } catch (error) {
      console.error('Google Maps API error:', error);
      return [];
    }
  }

  async getDirections(origin: string, destination: string, mode: string = 'driving') {
    try {
      const response = await this.client.get('/directions/json', {
        params: {
          origin,
          destination,
          mode,
          key: this.apiKey,
        },
      });

      if (response.data.status === 'OK' && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const leg = route.legs[0];

        return {
          origin: leg.start_address,
          destination: leg.end_address,
          mode,
          distance: leg.distance.text,
          duration: leg.duration.text,
          route: route.summary,
          steps: leg.steps.map((step: any) => step.html_instructions.replace(/<[^>]*>/g, '')),
          mapUrl: `https://www.google.com/maps/dir/${encodeURIComponent(origin)}/${encodeURIComponent(destination)}`,
        };
      }

      return null;
    } catch (error) {
      console.error('Google Maps Directions API error:', error);
      return null;
    }
  }
}

// ============================================================================
// AMADEUS API CLIENT (Flights)
// ============================================================================

export class AmadeusClient {
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private client: AxiosInstance;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.client = axios.create({
      baseURL: 'https://api.amadeus.com/v2',
      timeout: config.apiTimeout,
    });
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        'https://api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.apiKey,
          client_secret: this.apiSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // Refresh 1 min before expiry

      return this.accessToken as string;
    } catch (error) {
      console.error('Amadeus authentication error:', error);
      throw new Error('Failed to authenticate with Amadeus API');
    }
  }

  async searchFlights(from: string, to: string, date: string, passengers: number = 1): Promise<Flight[]> {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.get('/shopping/flight-offers', {
        params: {
          originLocationCode: from.toUpperCase().slice(0, 3),
          destinationLocationCode: to.toUpperCase().slice(0, 3),
          departureDate: date,
          adults: passengers,
          max: config.maxResults,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data.map((offer: any) => {
          const segment = offer.itineraries[0].segments[0];
          const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];

          return {
            airline: segment.carrierCode,
            flightNumber: `${segment.carrierCode}${segment.number}`,
            departure: {
              airport: segment.departure.iataCode,
              time: new Date(segment.departure.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              city: from,
            },
            arrival: {
              airport: lastSegment.arrival.iataCode,
              time: new Date(lastSegment.arrival.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              city: to,
            },
            price: parseFloat(offer.price.total),
            duration: offer.itineraries[0].duration.replace('PT', '').toLowerCase(),
            stops: offer.itineraries[0].segments.length - 1,
            bookingUrl: `https://www.skyscanner.com/transport/flights/${from}/${to}/${date}/?adults=${passengers}`,
          };
        });
      }

      return [];
    } catch (error) {
      console.error('Amadeus flight search error:', error);
      return [];
    }
  }
}

// ============================================================================
// RAPIDAPI CLIENT (Hotels, Activities)
// ============================================================================

export class RapidAPIClient {
  private apiKey: string;
  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      timeout: config.apiTimeout,
      headers: {
        'X-RapidAPI-Key': this.apiKey,
      },
    });
  }

  async searchHotels(location: string, checkIn: string, checkOut: string, guests: number = 2): Promise<Hotel[]> {
    try {
      // Using Booking.com API via RapidAPI
      const response = await this.client.get('https://booking-com.p.rapidapi.com/v1/hotels/search', {
        params: {
          dest_type: 'city',
          query: location,
          checkin_date: checkIn,
          checkout_date: checkOut,
          adults_number: guests,
          room_number: 1,
          units: 'metric',
          page_number: 0,
        },
        headers: {
          'X-RapidAPI-Host': 'booking-com.p.rapidapi.com',
        },
      });

      if (response.data.result && response.data.result.length > 0) {
        return response.data.result.slice(0, config.maxResults).map((hotel: any) => ({
          name: hotel.hotel_name,
          location: location,
          pricePerNight: hotel.min_total_price || hotel.price_breakdown?.gross_price || 0,
          rating: hotel.review_score / 2 || 4.0, // Convert from 10-point to 5-point scale
          amenities: hotel.hotel_facilities?.slice(0, 5) || ['Free WiFi'],
          bookingUrl: hotel.url || `https://www.booking.com/search?location=${encodeURIComponent(location)}&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`,
          images: hotel.max_photo_url ? [hotel.max_photo_url] : [],
        }));
      }

      return [];
    } catch (error) {
      console.error('RapidAPI hotel search error:', error);
      return [];
    }
  }

  async searchActivities(location: string): Promise<Activity[]> {
    try {
      // Using TripAdvisor API via RapidAPI
      const response = await this.client.get('https://tripadvisor16.p.rapidapi.com/api/v1/attraction/searchAttractions', {
        params: {
          query: location,
        },
        headers: {
          'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com',
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        return response.data.data.slice(0, config.maxResults).map((activity: any) => ({
          name: activity.name,
          description: activity.description || `Experience ${activity.name} in ${location}`,
          location: location,
          priceRange: activity.price_level || '$-$$',
          rating: activity.rating || 4.5,
          category: activity.category?.name || 'Tours',
          duration: activity.duration || '2-3 hours',
          bookingUrl: activity.web_url || `https://www.viator.com/search?location=${encodeURIComponent(location)}`,
        }));
      }

      return [];
    } catch (error) {
      console.error('RapidAPI activity search error:', error);
      return [];
    }
  }
}

// ============================================================================
// OPENWEATHERMAP API CLIENT
// ============================================================================

export class OpenWeatherClient {
  private apiKey: string;
  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.openweathermap.org/data/2.5',
      timeout: config.apiTimeout,
    });
  }

  async getWeather(location: string, date?: string) {
    try {
      const response = await this.client.get('/weather', {
        params: {
          q: location,
          appid: this.apiKey,
          units: 'metric',
        },
      });

      if (response.data) {
        return {
          condition: response.data.weather[0].description,
          temperature: Math.round(response.data.main.temp),
          humidity: response.data.main.humidity,
          windSpeed: response.data.wind.speed,
        };
      }

      return null;
    } catch (error) {
      console.error('OpenWeather API error:', error);
      return null;
    }
  }
}

// ============================================================================
// WEB SCRAPING (Fallback)
// ============================================================================

export class WebScraper {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: config.apiTimeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
  }

  async scrapeHotels(location: string, checkIn: string, checkOut: string): Promise<Hotel[]> {
    if (!config.enableWebScraping) return [];

    try {
      // Simple scraping - in production, you'd want more sophisticated parsing
      const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(location)}&checkin=${checkIn}&checkout=${checkOut}`;

      // Note: This is a simplified example. Real scraping would need to handle:
      // - CAPTCHA challenges
      // - Rate limiting
      // - Dynamic content loading
      // - Legal compliance with website ToS

      console.log('Web scraping not fully implemented - would scrape:', url);
      return [];
    } catch (error) {
      console.error('Web scraping error:', error);
      return [];
    }
  }
}
