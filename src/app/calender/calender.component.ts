import { Component, OnInit } from '@angular/core';
import { DataHandlingService } from './../data-handling.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {

 
  time = new Date();
  timer;

  constructor(public dataService: DataHandlingService) { }

  ngOnInit() {
    this.updateTime();

    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    this.time = new Date(Date.now() + this.dataService.weatherUtcOffsetSeconds * 1000);
  }

  ngOnDestroy(){
    clearInterval(this.timer);
  }

}
