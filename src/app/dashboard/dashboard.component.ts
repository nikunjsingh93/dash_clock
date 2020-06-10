import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SettingsModalComponent} from './../settings-modal/settings-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public dialog: MatDialog) {

  }


  ngOnInit() {
  
  }

  openDialog() {
    const dialogRef = this.dialog.open(SettingsModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

 

}
