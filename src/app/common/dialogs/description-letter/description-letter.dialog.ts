import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  templateUrl: './description-letter-dialog.html'
})
export class DescriptionLetterDialogComponent {
  messageString: string;
  description : string;
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) { 
      dialogRef.disableClose = true;
      this.description = data.desc;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {    
  }
  confirm() {
    this.dialogRef.close(this.description);
  }
  closeTop() {
    this.dialogRef.close(false);
  }
}