import { Component, OnInit } from '@angular/core';
import { DataHandlingService } from './../data-handling.service';
 
@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {


  constructor(public dataService: DataHandlingService) {  }

  ngOnInit(): void {
  }

  

}
