import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import { WeatherComponent } from './weather/weather.component';
import { CalenderComponent } from './calender/calender.component';
import { ClockComponent } from './clock/clock.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    WeatherComponent,
    CalenderComponent,
    ClockComponent,
    SettingsModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    FontAwesomeModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
