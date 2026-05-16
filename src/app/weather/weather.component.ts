import { Component, OnInit } from '@angular/core';
import { faBolt, faCloud, faCloudMoon, faCloudRain, faCloudShowersHeavy, faCloudSun, faMoon, faSmog, faSnowflake, faSun } from '@fortawesome/free-solid-svg-icons';
import { DataHandlingService } from './../data-handling.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  weatherIcons = {
    sun: faSun,
    moon: faMoon,
    cloudSun: faCloudSun,
    cloudMoon: faCloudMoon,
    cloud: faCloud,
    rain: faCloudRain,
    showers: faCloudShowersHeavy,
    storm: faBolt,
    snow: faSnowflake,
    smog: faSmog,
    '01d': faSun,
    '01n': faMoon,
    '02d': faCloudSun,
    '02n': faCloudMoon,
    '03d': faCloudSun,
    '03n': faCloudMoon,
    '04d': faCloud,
    '04n': faCloud,
    '09d': faCloudShowersHeavy,
    '09n': faCloudShowersHeavy,
    '10d': faCloudRain,
    '10n': faCloudRain,
    '11d': faBolt,
    '11n': faBolt,
    '13d': faSnowflake,
    '13n': faSnowflake,
    '50d': faSmog,
    '50n': faSmog
  };

  constructor(public dataService: DataHandlingService) { }

  ngOnInit(): void {
   
  }

  get weatherIcon() {
    return this.weatherIcons[this.dataService.weatherIconKey] || faSun;
  }

  

}
