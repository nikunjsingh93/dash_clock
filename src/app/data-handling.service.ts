import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataHandlingService {

  weatherData:any;
  iconDay

  weatherDesc;

  cityValue = 'boston';
  selectedLocation:any;
  secondaryLocation:any;
  weatherIconKey = 'sun';
  weatherUtcOffsetSeconds = 0;
  weatherTimezone = '';
  displaySettings = {
    dateScale: 100,
    primaryClockScale: 100,
    weatherScale: 100,
    secondaryClockScale: 100
  };
  private apiKey = '3398dd874ccbff037313128b7fd0ae02';
  private storageKey = 'dashClockWeatherLocation';
  private secondaryStorageKey = 'dashClockSecondaryLocation';
  private displayStorageKey = 'dashClockDisplaySettings';

  constructor() {
    this.weatherData = {
      main: {}
    };

    this.loadSavedLocation();
    this.loadSavedSecondaryLocation();
    this.loadDisplaySettings();

    this.getWeatherData();
    this.refreshSecondaryTimezone();

    setInterval(() => {
      this.getWeatherData();
      this.refreshSecondaryTimezone();
    }, 1800000);
   }


   getWeatherData() {
    const locationPromise = this.selectedLocation
      ? Promise.resolve(this.selectedLocation)
      : this.searchLocations(this.cityValue).then(results => results[0]);

    locationPromise
      .then(location => {
        if (!location) {
          return this.getOpenWeatherData();
        }

        this.selectedLocation = location;
        this.cityValue = this.formatLocation(location);

        return fetch('https://api.open-meteo.com/v1/forecast?latitude=' + location.lat + '&longitude=' + location.lon + '&current=temperature_2m,apparent_temperature,is_day,weather_code,cloud_cover&daily=temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto&forecast_days=1')
          .then(res => res.json())
          .then(data => {
            this.setOpenMeteoWeatherData(data, location);
          });
      })
      .catch(() => {
        this.getOpenWeatherData();
      });

    // let data = JSON.parse('{"coord":{"lon":-71.06,"lat":42.36},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":292.38,"feels_like":290.19,"temp_min":290.93,"temp_max":293.71,"pressure":1015,"humidity":59},"visibility":16093,"wind":{"speed":3.6,"deg":70},"clouds":{"all":90},"dt":1591756930,"sys":{"type":1,"id":3486,"country":"US","sunrise":1591693642,"sunset":1591748403},"timezone":-14400,"id":4930956,"name":"Boston","cod":200}');
    // this.setWeatherData(data);
  }

  getOpenWeatherData() {
    const weatherUrl = this.selectedLocation
      ? 'https://api.openweathermap.org/data/2.5/weather?lat=' + this.selectedLocation.lat + '&lon=' + this.selectedLocation.lon + '&appid=' + this.apiKey
      : 'https://api.openweathermap.org/data/2.5/weather?q=' + this.cityValue + '&appid=' + this.apiKey;

    fetch(weatherUrl)
      .then(res => res.json())
      .then(data => {
        this.setWeatherData(data);
      });
  }

  searchLocations(query) {
    if (!query || query.trim().length < 2) {
      return Promise.resolve([]);
    }

    return fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + encodeURIComponent(query.trim()) + '&limit=6&appid=' + this.apiKey)
      .then(res => res.json())
      .then(data => Array.isArray(data) ? data : []);
  }

  setLocation(location) {
    this.selectedLocation = location;
    this.cityValue = this.formatLocation(location);
    this.saveLocation(location);

    this.getWeatherData();
  }

  setSecondaryLocation(location) {
    return this.fetchTimezone(location)
      .then(timezoneData => {
        this.secondaryLocation = Object.assign({}, location, timezoneData);
        this.saveSecondaryLocation();

        return this.secondaryLocation;
      });
  }

  removeSecondaryLocation() {
    this.secondaryLocation = null;

    try {
      localStorage.removeItem(this.secondaryStorageKey);
    } catch (error) {
      // The display can continue without storage access.
    }
  }

  refreshSecondaryTimezone() {
    if (!this.secondaryLocation) {
      return Promise.resolve(null);
    }

    return this.fetchTimezone(this.secondaryLocation)
      .then(timezoneData => {
        this.secondaryLocation = Object.assign({}, this.secondaryLocation, timezoneData);
        this.saveSecondaryLocation();

        return this.secondaryLocation;
      })
      .catch(() => this.secondaryLocation);
  }

  fetchTimezone(location) {
    return fetch('https://api.open-meteo.com/v1/forecast?latitude=' + location.lat + '&longitude=' + location.lon + '&current=temperature_2m&timezone=auto&forecast_days=1')
      .then(res => res.json())
      .then(data => ({
        timezone: data.timezone || '',
        utc_offset_seconds: typeof data.utc_offset_seconds === 'number' ? data.utc_offset_seconds : 0
      }));
  }

  formatLocation(location) {
    if (!location) {
      return '';
    }

    return [location.name, location.state, location.country].filter(Boolean).join(', ');
  }

  loadSavedLocation() {
    try {
      const savedLocation = localStorage.getItem(this.storageKey);

      if (!savedLocation) {
        return;
      }

      const location = JSON.parse(savedLocation);

      if (location && location.name && typeof location.lat === 'number' && typeof location.lon === 'number') {
        this.selectedLocation = location;
        this.cityValue = this.formatLocation(location);
        this.weatherTimezone = location.timezone || '';
        this.weatherUtcOffsetSeconds = typeof location.utc_offset_seconds === 'number' ? location.utc_offset_seconds : 0;
      }
    } catch (error) {
      localStorage.removeItem(this.storageKey);
    }
  }

  saveLocation(location) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        name: location.name,
        state: location.state,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
        timezone: location.timezone || this.weatherTimezone,
        utc_offset_seconds: typeof location.utc_offset_seconds === 'number' ? location.utc_offset_seconds : this.weatherUtcOffsetSeconds
      }));
    } catch (error) {
      // Weather still works if storage is unavailable.
    }
  }

  loadSavedSecondaryLocation() {
    try {
      const savedLocation = localStorage.getItem(this.secondaryStorageKey);

      if (!savedLocation) {
        return;
      }

      const location = JSON.parse(savedLocation);

      if (location && location.name && typeof location.lat === 'number' && typeof location.lon === 'number') {
        this.secondaryLocation = location;
      }
    } catch (error) {
      localStorage.removeItem(this.secondaryStorageKey);
    }
  }

  saveSecondaryLocation() {
    if (!this.secondaryLocation) {
      return;
    }

    try {
      localStorage.setItem(this.secondaryStorageKey, JSON.stringify(this.secondaryLocation));
    } catch (error) {
      // The second clock still works if storage is unavailable.
    }
  }

  loadDisplaySettings() {
    try {
      const savedSettings = JSON.parse(localStorage.getItem(this.displayStorageKey) || '{}');

      this.displaySettings = {
        dateScale: this.normalizeScale(savedSettings.dateScale),
        primaryClockScale: this.normalizeScale(savedSettings.primaryClockScale),
        weatherScale: this.normalizeScale(savedSettings.weatherScale),
        secondaryClockScale: this.normalizeScale(savedSettings.secondaryClockScale)
      };
    } catch (error) {
      this.resetDisplaySettings(false);
    }
  }

  saveDisplaySettings(settings) {
    this.displaySettings = {
      dateScale: this.normalizeScale(settings.dateScale),
      primaryClockScale: this.normalizeScale(settings.primaryClockScale),
      weatherScale: this.normalizeScale(settings.weatherScale),
      secondaryClockScale: this.normalizeScale(settings.secondaryClockScale)
    };

    try {
      localStorage.setItem(this.displayStorageKey, JSON.stringify(this.displaySettings));
    } catch (error) {
      // Size changes remain active for the current session.
    }
  }

  resetDisplaySettings(save = true) {
    this.displaySettings = {
      dateScale: 100,
      primaryClockScale: 100,
      weatherScale: 100,
      secondaryClockScale: 100
    };

    if (save) {
      this.saveDisplaySettings(this.displaySettings);
    }
  }

  normalizeScale(value) {
    const numericValue = Number(value);

    if (!numericValue) {
      return 100;
    }

    return Math.min(150, Math.max(75, numericValue));
  }

  setOpenMeteoWeatherData(data, location) {
    const current = data.current || {};
    const daily = data.daily || {};
    const isDay = current.is_day === 1;
    const weatherCode = current.weather_code;

    this.weatherTimezone = data.timezone || '';
    this.weatherUtcOffsetSeconds = typeof data.utc_offset_seconds === 'number' ? data.utc_offset_seconds : 0;
    this.selectedLocation = Object.assign({}, location, {
      timezone: this.weatherTimezone,
      utc_offset_seconds: this.weatherUtcOffsetSeconds
    });
    this.cityValue = this.formatLocation(this.selectedLocation);
    this.saveLocation(this.selectedLocation);

    this.weatherData = {
      name: location.name,
      main: {},
      temp_celcius: this.formatTemperature(current.temperature_2m),
      temp_min: this.formatTemperature(daily.temperature_2m_min && daily.temperature_2m_min[0]),
      temp_max: this.formatTemperature(daily.temperature_2m_max && daily.temperature_2m_max[0]),
      temp_feels_like: this.formatTemperature(current.apparent_temperature),
      cloud_cover: current.cloud_cover,
      weather_code: weatherCode,
      isDay: isDay
    };

    this.iconDay = isDay;
    this.weatherDesc = this.getWeatherDescription(weatherCode, isDay);
    this.weatherIconKey = this.getWeatherIconKey(weatherCode, isDay);
  }

  formatTemperature(value) {
    return typeof value === 'number' ? value.toFixed(0) : '--';
  }

  getWeatherDescription(code, isDay) {
    const descriptions = {
      0: isDay ? 'Sunny' : 'Clear',
      1: isDay ? 'Mostly Sunny' : 'Mostly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Rime Fog',
      51: 'Light Drizzle',
      53: 'Drizzle',
      55: 'Heavy Drizzle',
      56: 'Freezing Drizzle',
      57: 'Freezing Drizzle',
      61: 'Light Rain',
      63: 'Rain',
      65: 'Heavy Rain',
      66: 'Freezing Rain',
      67: 'Freezing Rain',
      71: 'Light Snow',
      73: 'Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Light Showers',
      81: 'Showers',
      82: 'Heavy Showers',
      85: 'Snow Showers',
      86: 'Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm',
      99: 'Thunderstorm'
    };

    return descriptions[code] || 'Current Weather';
  }

  getWeatherIconKey(code, isDay) {
    if (code === 0) {
      return isDay ? 'sun' : 'moon';
    }

    if (code === 1 || code === 2) {
      return isDay ? 'cloudSun' : 'cloudMoon';
    }

    if (code === 3) {
      return 'cloud';
    }

    if (code === 45 || code === 48) {
      return 'smog';
    }

    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return (code >= 80 && code <= 82) ? 'showers' : 'rain';
    }

    if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
      return 'snow';
    }

    if (code >= 95) {
      return 'storm';
    }

    return isDay ? 'sun' : 'moon';
  }

  setWeatherData(data) {


    this.weatherData = data;

    let sunsetTime = new Date(this.weatherData.sys.sunset * 1000);

    this.weatherData.sunset_time = sunsetTime.toLocaleTimeString();

    let currentDate = new Date();
    
    this.weatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());

    this.weatherUtcOffsetSeconds = typeof this.weatherData.timezone === 'number' ? this.weatherData.timezone : 0;
    this.weatherTimezone = '';
    if (this.selectedLocation) {
      this.selectedLocation.utc_offset_seconds = this.weatherUtcOffsetSeconds;
      this.saveLocation(this.selectedLocation);
    }

    this.iconDay = this.weatherData.isDay;

    this.weatherData.temp_celcius = (this.weatherData.main.temp - 273.15).toFixed(0);

    this.weatherData.temp_min = (this.weatherData.main.temp_min - 273.15).toFixed(0);

    this.weatherData.temp_max = (this.weatherData.main.temp_max - 273.15).toFixed(0);

    this.weatherData.temp_feels_like = (this.weatherData.main.feels_like - 273.15).toFixed(0);

    this.weatherDesc = this.weatherData.weather[0].description;
    this.weatherIconKey = this.weatherData.weather[0].icon;

  }


}
