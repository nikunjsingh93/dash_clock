import { Component, OnInit } from '@angular/core';
import { DataHandlingService } from './../data-handling.service';
 
@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {

  weatherSearchValue = '';
  weatherResults = [];
  selectedWeatherCity;
  isWeatherSearching = false;
  weatherHasSearched = false;
  private weatherSearchTimer;

  secondarySearchValue = '';
  secondaryResults = [];
  selectedSecondaryCity;
  isSecondarySearching = false;
  secondaryHasSearched = false;
  private secondarySearchTimer;
  showSecondaryEditor = false;
  removeSecondaryRequested = false;

  displaySettings = {
    dateScale: 100,
    primaryClockScale: 100,
    weatherScale: 100,
    secondaryClockScale: 100
  };
  isFullScreen = false;

  constructor(public dataService: DataHandlingService) {  }

  ngOnInit(): void {
    this.isFullScreen = !!this.getFullScreenElement();
    this.weatherSearchValue = this.dataService.cityValue;
    this.secondarySearchValue = this.dataService.secondaryLocation
      ? this.dataService.formatLocation(this.dataService.secondaryLocation)
      : '';
    this.displaySettings = Object.assign({}, this.dataService.displaySettings);
  }

  get hasSecondaryClock() {
    return !!this.selectedSecondaryCity || (!!this.dataService.secondaryLocation && !this.removeSecondaryRequested);
  }

  get secondaryDisplayName() {
    return this.selectedSecondaryCity
      ? this.formatCity(this.selectedSecondaryCity)
      : this.dataService.formatLocation(this.dataService.secondaryLocation);
  }

  get showWeatherDropdown() {
    return this.isWeatherSearching || this.weatherHasSearched || this.weatherResults.length > 0;
  }

  get showSecondaryDropdown() {
    return this.isSecondarySearching || this.secondaryHasSearched || this.secondaryResults.length > 0;
  }

  searchCities(event: Event, target: string) {
    const value = (event.target as HTMLInputElement).value;
    const isWeather = target === 'weather';

    if (isWeather) {
      this.weatherSearchValue = value;
      this.selectedWeatherCity = null;
      clearTimeout(this.weatherSearchTimer);
    } else {
      this.secondarySearchValue = value;
      this.selectedSecondaryCity = null;
      this.removeSecondaryRequested = false;
      clearTimeout(this.secondarySearchTimer);
    }

    if (!value || value.trim().length < 2) {
      this.setSearchState(target, [], false, false);
      return;
    }

    this.setSearchState(target, [], true, false);

    const timer = setTimeout(() => {
      this.dataService.searchLocations(value)
        .then(results => this.setSearchState(target, results, false, true))
        .catch(() => this.setSearchState(target, [], false, true));
    }, 250);

    if (isWeather) {
      this.weatherSearchTimer = timer;
    } else {
      this.secondarySearchTimer = timer;
    }
  }

  setSearchState(target, results, isSearching, hasSearched) {
    if (target === 'weather') {
      this.weatherResults = results;
      this.isWeatherSearching = isSearching;
      this.weatherHasSearched = hasSearched;
      return;
    }

    this.secondaryResults = results;
    this.isSecondarySearching = isSearching;
    this.secondaryHasSearched = hasSearched;
  }

  selectCity(city, target: string) {
    if (target === 'weather') {
      this.selectedWeatherCity = city;
      this.weatherSearchValue = this.formatCity(city);
      this.weatherResults = [];
      this.weatherHasSearched = false;
      return;
    }

    this.selectedSecondaryCity = city;
    this.secondarySearchValue = this.formatCity(city);
    this.secondaryResults = [];
    this.secondaryHasSearched = false;
    this.showSecondaryEditor = false;
    this.removeSecondaryRequested = false;
  }

  removeSecondaryClock() {
    this.selectedSecondaryCity = null;
    this.secondarySearchValue = '';
    this.secondaryResults = [];
    this.secondaryHasSearched = false;
    this.showSecondaryEditor = false;
    this.removeSecondaryRequested = true;
  }

  setScale(key, event: Event) {
    this.displaySettings[key] = Number((event.target as HTMLInputElement).value);
  }

  resetSizes() {
    this.displaySettings = {
      dateScale: 100,
      primaryClockScale: 100,
      weatherScale: 100,
      secondaryClockScale: 100
    };
  }

  save() {
    this.dataService.saveDisplaySettings(this.displaySettings);

    if (this.selectedWeatherCity) {
      this.dataService.setLocation(this.selectedWeatherCity);
    }

    if (this.removeSecondaryRequested) {
      this.dataService.removeSecondaryLocation();
    } else if (this.selectedSecondaryCity) {
      this.dataService.setSecondaryLocation(this.selectedSecondaryCity);
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
