import { Component, OnInit } from '@angular/core';
import { DataHandlingService } from './../data-handling.service';
 
@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {

  searchValue = '';
  cityResults = [];
  selectedCity;
  isSearching = false;
  private searchTimer;
  isFullScreen = false;

  constructor(public dataService: DataHandlingService) {  }

  ngOnInit(): void {
    this.isFullScreen = !!this.getFullScreenElement();
    this.searchValue = this.dataService.cityValue;
  }

  searchCities(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.selectedCity = null;

    clearTimeout(this.searchTimer);

    if (!this.searchValue || this.searchValue.trim().length < 2) {
      this.cityResults = [];
      this.isSearching = false;
      return;
    }

    this.isSearching = true;

    this.searchTimer = setTimeout(() => {
      this.dataService.searchLocations(this.searchValue)
        .then(results => {
          this.cityResults = results;
          this.isSearching = false;
        })
        .catch(() => {
          this.cityResults = [];
          this.isSearching = false;
        });
    }, 250);
  }

  selectCity(city) {
    this.selectedCity = city;
    this.searchValue = this.formatCity(city);
    this.cityResults = [];
  }

  update() {
    if (this.selectedCity) {
      this.dataService.setLocation(this.selectedCity);
    }
  }

  formatCity(city) {
    return this.dataService.formatLocation(city);
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
