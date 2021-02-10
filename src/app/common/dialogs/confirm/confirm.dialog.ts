import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialogComponent {
  messageString: string;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) { dialogRef.disableClose = true;}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.messageString = this.data;
  }
  confirm() {
    this.dialogRef.close(true);
  }
  closeTop() {
    this.dialogRef.close('closeButton');
  }
}