import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataHandlingService {

  weatherData:any;
  iconDay

  weatherDesc;

  cityValue = 'boston';

  constructor() {
    this.weatherData = {
      main: {}
    };

    this.getWeatherData();
   }


   getWeatherData() {

    fetch('http://api.openweathermap.org/data/2.5/weather?q='+this.cityValue+'&appid=3398dd874ccbff037313128b7fd0ae02')
    .then(res => res.json())
    .then(data => {
      this.setWeatherData(data);
    })

    // let data = JSON.parse('{"coord":{"lon":-71.06,"lat":42.36},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":292.38,"feels_like":290.19,"temp_min":290.93,"temp_max":293.71,"pressure":1015,"humidity":59},"visibility":16093,"wind":{"speed":3.6,"deg":70},"clouds":{"all":90},"dt":1591756930,"sys":{"type":1,"id":3486,"country":"US","sunrise":1591693642,"sunset":1591748403},"timezone":-14400,"id":4930956,"name":"Boston","cod":200}');
    // this.setWeatherData(data);
  }

  setWeatherData(data) {

    this.weatherData = data;

    let sunsetTime = new Date(this.weatherData.sys.sunset * 1000);

    this.weatherData.sunset_time = sunsetTime.toLocaleTimeString();

    let currentDate = new Date();
    
    this.weatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());

    this.iconDay = this.weatherData.isDay;

    this.weatherData.temp_celcius = (this.weatherData.main.temp - 273.15).toFixed(0);

    this.weatherData.temp_min = (this.weatherData.main.temp_min - 273.15).toFixed(0);

    this.weatherData.temp_max = (this.weatherData.main.temp_max - 273.15).toFixed(0);

    this.weatherData.temp_feels_like = (this.weatherData.main.feels_like - 273.15).toFixed(0);

    this.weatherDesc = this.weatherData.weather[0].description;

  }
}
