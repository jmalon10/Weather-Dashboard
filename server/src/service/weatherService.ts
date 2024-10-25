// import dotenv from 'dotenv';
// dotenv.config();

// // TODO: Define an interface for the Coordinates object
// interface Coordinates {
//   lat: string;
//   lon: string;
// }

// // TODO: Define a class for the Weather object
// interface Weather {
//   city: string;
//   date: string;
//   icon: string;
//   iconDescription: string;
//   tempF: number;
//   windSpeed: number;
//   humidity: number;
//   forecast: Array<{ day: string; temperature: number; windSpeed: number;
//     humidity: number; }>;
// }

// // TODO: Complete the WeatherService class
// class WeatherService {
//   // Define the baseURL, API key, and city name properties
//   private baseURL?: string;

//   private apiKey?: string;
//   private cityName: string;

//   constructor(cityName: string = '') {
//     this.baseURL = process.env.API_BASE_URL || '';

//     this.apiKey = process.env.API_KEY || '';
//     this.cityName = cityName;
//   }
//   // TODO: Create fetchLocationData method
//   private async fetchLocationData(query: string): Promise<Coordinates> {
//     try {
//       console.log(`HERE IS URL: ${this.baseURL}${query} `)
//       const response = await fetch(`${this.baseURL}${query}`);
//       const cities = await response.json();
//       console.log("here are cities", cities[0].lon)
//       // Assuming cities.data is an array and we need the first one
//       const locationData = cities[0]; // Adjust based on your actual response structure
//       return this.destructureLocationData(locationData);
//     } catch (err) {
//       console.log('Error TEST 1234:', err);
//       throw new Error('Failed to fetch location data');
//     }
//   }
  
//   // TODO: Create destructureLocationData method
//   private destructureLocationData(locationData: Coordinates): Coordinates {
//     return {
//       lat: locationData.lat,
//       lon: locationData.lon,
//     };
//   }
//   // TODO: Create buildGeocodeQuery method
//   // private buildGeocodeQuery(): string {}
//   private buildGeocodeQuery(): string {
//     return `/geo/1.0/direct?q=${this.cityName}&limit=10&appid=${this.apiKey}`;
//   }
//   // TODO: Create buildWeatherQuery method
//   // private buildWeatherQuery(coordinates: Coordinates): string {}
//   private buildWeatherQuery(coordinates: Coordinates): string {
//     return `/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&apikey=${this.apiKey}`;
//   }
//   // TODO: Create fetchAndDestructureLocationData method
//   // private async fetchAndDestructureLocationData() {}
//   private async fetchAndDestructureLocationData(): Promise<Coordinates> {
//     const query = this.buildGeocodeQuery();
//     const locationData = await this.fetchLocationData(query);
//     return this.destructureLocationData(locationData);
//   }
//   // TODO: Create fetchWeatherData method 
//   // private async fetchWeatherData(coordinates: Coordinates) {}
//   private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
//     const query = this.buildWeatherQuery(coordinates);
//     const search = `${this.baseURL}${query}`
//     console.log('SEARCH:', search)
//     const response = await fetch(search);
//     return await response.json();
//   }
//   // TODO: Build parseCurrentWeather method
//   // private parseCurrentWeather(response: any) {}
//   private parseCurrentWeather(response: any): Weather {
//     return {
//       city: response.city.name,
//       date: response.list[0].dt_txt,
//       icon: response.list[0].weather.icon,
//       iconDescription: response.list[0].weather.description,
//       tempF: response.list[0].main.temp - 273.15 * 9/5 + 32,
//       windSpeed: response.list[0].wind.speed,
//       humidity: response.list[0].main.humidity,
//       forecast: this.buildForecastArray(response),
//     };
//   }
  
//   // TODO: Complete buildForecastArray method
//   // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
//   private buildForecastArray(currentWeather: Weather): Weather {
//    return {
//     currentWeather.list.map((day: any) => ({
//       day: day.dt_txt,  // Use dt_txt for a readable date and time
//       temperature: day.main.temp,  // Access the temp from main object
//       feels_like: day.main.feels_like,  // Optional: Add feels like temp
//       description: day.weather[0].description,  // Get weather description
//       wind_speed: day.wind.speed,  // Optional: Include wind speed
//     }))
//     };
//   }
  
//   // TODO: Complete getWeatherForCity method
//   // async getWeatherForCity(city: string) {}
//   async getWeatherForCity(city: string): Promise<Weather | null> {
//     this.cityName = city;
//     console.log(`AFTER CITY NAME`)
//     const coordinates = await this.fetchAndDestructureLocationData();
//     console.log(`COORDINATES`)
//     if (!coordinates) {
//       console.log(`INSIDE IF STATEMENT`)
//       return null;
//     }
//     console.log('BEFORE WEATHER DATA IN GET WEATHER FOR CITY')
//     console.log('COORDINATES:', coordinates);
//     const weatherData = await this.fetchWeatherData(coordinates);
//     console.log('AFTER WEATHER DATA ', weatherData);
//     const currentWeather = this.parseCurrentWeather(weatherData);
//     console.log('CURRENT WEATHER:', currentWeather);
//     return currentWeather && weatherData;
//   }
  
// }

// export default new WeatherService();
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: string;
  lon: string;
}

interface Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  forecast: Array<{ date: string; tempF: number; windSpeed: number; humidity: number; icon: string; iconDescription: string }>;
}

class WeatherService {
  private baseURL?: string;
  private apiKey?: string;
  private cityName: string;

  constructor(cityName: string = '') {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = cityName;
  }

  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      const response = await fetch(`${this.baseURL}${query}`);
      const cities = await response.json();
      const locationData = cities[0];
      return this.destructureLocationData(locationData);
    } catch (err) {
      throw new Error('Failed to fetch location data');
    }
  }

  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  private buildGeocodeQuery(): string {
    return `/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    console.log(`${this.baseURL}${query}`);
    const response = await fetch(`${this.baseURL}${query}`);
    return await response.json();
  }

  private parseCurrentWeather(response: any): Weather {
    return {
      city: response.city.name,
      date: response.list[0].dt_txt,
      icon: response.list[0].weather[0].icon,
      iconDescription: response.list[0].weather[0].description,
      tempF: ((response.list[0].main.temp - 273.15) * 9) / 5 + 32,
      windSpeed: response.list[0].wind.speed,
      humidity: response.list[0].main.humidity,
      forecast: this.buildForecastArray(response.list),
    };
  }

  private buildForecastArray(forecastList: any[]): Array<{ date: string; tempF: number; windSpeed: number; humidity: number; icon: string; iconDescription: string }> {
    return forecastList.map((day) => ({
      date: day.dt_txt, // The date and time of the forecast
      tempF: ((day.main.temp - 273.15) * 9) / 5 + 32, // Convert temp from Kelvin to Fahrenheit
      windSpeed: day.wind.speed, // Wind speed in meters/second
      humidity: day.main.humidity, // Humidity percentage
      icon: day.weather[0].icon, // Weather icon code
      iconDescription: day.weather[0].description // Weather description
    }));
  }
  

  async getWeatherForCity(city: string): Promise<Weather | null> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    if (!coordinates) {
      return null;
    }
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return currentWeather;
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
}

export default new WeatherService();
