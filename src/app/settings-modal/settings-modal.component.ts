import { Component, OnInit } from '@angular/core';
import { DataHandlingService } from './../data-handling.service';
 
@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {

  localValue;
  isFullScreen = false;

  constructor(public dataService: DataHandlingService) {  }

  ngOnInit(): void {
    this.isFullScreen = !!this.getFullScreenElement();
  }

  setValue(event: Event) {
    this.localValue = (event.target as HTMLInputElement).value;
  }


  update() {
    this.dataService.cityValue =  this.localValue; 

    this.dataService.getWeatherData();
  }

  toggleFullScreen() {
    const doc: any = document;
    const root: any = document.documentElement;

    if (this.getFullScreenElement()) {
      const exitFullScreen = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;

      if (exitFullScreen) {
        exitFullScreen.call(doc);
      }

      this.isFullScreen = false;
      return;
    }

    const requestFullScreen = root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen;

    if (requestFullScreen) {
      requestFullScreen.call(root);
      this.isFullScreen = true;
    }
  }

  private getFullScreenElement() {
    const doc: any = document;

    return doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
  }
  

}
