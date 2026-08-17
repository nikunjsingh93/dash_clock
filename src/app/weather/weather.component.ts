import { Component, Input, OnInit } from '@angular/core';
import { DataHandlingService } from './../data-handling.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  @Input() alignRight = false;

  constructor(public dataService: DataHandlingService) { }

  ngOnInit(): void {
   
  }

  

}
