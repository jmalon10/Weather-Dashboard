import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: string;
  lon: string;
}

// TODO: Define a class for the Weather object
interface Weather {
  temperature: number;
  description: string;
  forecast: Array<{ day: string; temperature: number; description: string }>;
}

// TODO: Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  private baseURL?: string;

  private apiKey?: string;
  private cityName: string;

  constructor(cityName: string = '') {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
    this.cityName = cityName;
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      const response = await fetch(`${this.baseURL}${query}`);
      const cities = await response.json();
      
      // Assuming cities.data is an array and we need the first one
      const locationData = cities.data[0]; // Adjust based on your actual response structure
      return this.destructureLocationData(locationData);
    } catch (err) {
      console.log('Error:', err);
      throw new Error('Failed to fetch location data');
    }
  }
  
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(): string {
    return `geocode?city=${this.cityName}&apikey=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `weather?lat=${coordinates.lat}&lon=${coordinates.lon}&apikey=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method 
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(`${this.baseURL}${query}`);
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    return {
      temperature: response.current.temperature,
      description: response.current.weather[0].description,
      forecast: response.daily.map((day: any) => ({
        day: day.dt,
        temperature: day.temp.day,
        description: day.weather[0].description,
      })),
    };
  }
  
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather {
    const forecast = weatherData.map(day => ({
      day: day.dt,
      temperature: day.temp.day,
      description: day.weather[0].description,
    }));
  
    return {
      ...currentWeather,
      forecast,
    };
  }
  
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string): Promise<Weather | null> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    
    if (!coordinates) {
      return null;
    }
  
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData.daily);
  }
  
}

export default new WeatherService();
