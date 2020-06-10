import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  weatherData:any;

  constructor() { }

  ngOnInit(): void {
    this.weatherData = {
      main: {}
    };

    this.getWeatherData();
    console.log(this.weatherData);
  }

  getWeatherData() {

    fetch('http://api.openweathermap.org/data/2.5/weather?q=boston&appid=3398dd874ccbff037313128b7fd0ae02')
    .then(res => res.json())
    .then(data => {
      this.setWeatherData(data);
    })

    // let data = JSON.parse('{"coord":{"lon":-71.06,"lat":42.36},"weather":[{"id":804,"main":"Clouds","description":"overcast clouds","icon":"04n"}],"base":"stations","main":{"temp":292.38,"feels_like":290.19,"temp_min":290.93,"temp_max":293.71,"pressure":1015,"humidity":59},"visibility":16093,"wind":{"speed":3.6,"deg":70},"clouds":{"all":90},"dt":1591756930,"sys":{"type":1,"id":3486,"country":"US","sunrise":1591693642,"sunset":1591748403},"timezone":-14400,"id":4930956,"name":"Boston","cod":200}');
    // this.setWeatherData(data);
  }

  setWeatherData(data) {

    this.weatherData = data;

    this.weatherData.temp_celcius = (this.weatherData.main.temp - 273.15).toFixed(0);

    this.weatherData.temp_min = (this.weatherData.main.temp_min - 273.15).toFixed(0);

    this.weatherData.temp_max = (this.weatherData.main.temp_max - 273.15).toFixed(0);

    this.weatherData.temp_feels_like = (this.weatherData.main.feels_like - 273.15).toFixed(0);



    console.log("TEMP",this.weatherData.temp_celcius, this.weatherData.temp_min,this.weatherData.temp_max,this.weatherData.temp_feels_like)


  }

}
