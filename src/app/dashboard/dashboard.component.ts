import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SettingsModalComponent} from './../settings-modal/settings-modal.component';
import {DataHandlingService} from './../data-handling.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog, public dataService: DataHandlingService) {

  }


  ngOnInit() {
  
  }

  openDialog() {
    const dialogRef = this.dialog.open(SettingsModalComponent, {
      panelClass: 'settings-dialog-panel',
      width: 'min(94vw, 560px)',
      maxHeight: '94vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

 

}
