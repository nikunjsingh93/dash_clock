import { Component, OnInit } from '@angular/core';
import { DataHandlingService } from './../data-handling.service';
 
@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {

  localValue;

  constructor(public dataService: DataHandlingService) {  }

  ngOnInit(): void {
  }

  setValue(event: Event) {
    this.localValue = (event.target as HTMLInputElement).value;
  }


  update() {
    this.dataService.cityValue =  this.localValue; 

    this.dataService.getWeatherData();
  }
  

}
