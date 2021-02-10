import { Component, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './add-template-dialog.html'
})
export class AddTemplateDialogComponent {

  templateName: string;
  invalidName: boolean;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService, private AppService: AppService, public dialog: MatDialog) { dialogRef.disableClose = true;}

 

  ngOnInit() {
    this.templateName = this.data;
    if (this.templateName.trim() == '') {
      this.invalidName = true;
    }
    else {
      this.invalidName = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  modelChanged(data) {
    this.templateName = data;
    if (this.templateName.trim() == '') {
      this.invalidName = true;
    }
    else {
      this.invalidName = false;
    }
  }
  save() {
    this.dialogRef.close(this.templateName);
  }
}