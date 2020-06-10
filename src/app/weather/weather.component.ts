import { Component, OnInit } from '@angular/core';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';
import { DataHandlingService } from './../data-handling.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  faSun = faSun;
  faMoon = faMoon;

  constructor(public dataService: DataHandlingService) { }

  ngOnInit(): void {
   
  }

  

}
