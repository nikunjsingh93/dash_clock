import { Component, OnInit } from '@angular/core';
import { DataHandlingService } from './../data-handling.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  constructor(public dataService: DataHandlingService) { }

  ngOnInit(): void {
   
  }

  

}
