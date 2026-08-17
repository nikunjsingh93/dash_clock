import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {

  @Input() compact = false;
  @Input() locationLabel = '';
  @Input() utcOffsetSeconds = 0;

  time = new Date();
  timer;

  ngOnInit() {
    this.updateTime();

    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    this.time = new Date(Date.now() + (Number(this.utcOffsetSeconds) || 0) * 1000);
  }

  ngOnDestroy(){
    clearInterval(this.timer);
  }

}
