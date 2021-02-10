import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxListComponent } from 'devextreme-angular';
import { MailSetOptionsDialogComponent } from '../mail-set-options/mail-set-options.dialog';


@Component({
  templateUrl: './mail-set-template-list.html',
  styleUrls: ['./mail-set-template-list.css']
})
export class MailSetOptionstmplateDialogComponent {

  TemplateList : any;
  selectedmultipleToken : any = [];

  constructor(
    public dialogRef: MatDialogRef<any>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService, private AppService: AppService, public dialog: MatDialog) {
    dialogRef.disableClose = true;
    
  }



  ngOnInit() {
    this.getTempDrop();
  }

  getTempDrop(){  
    let url = 'LetterTemplate?LetterName=';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        if (resp.body) {
          this.TemplateList = resp.body.ResultList;
        }
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  Submit(){
    this.dialogRef.close(this.selectedmultipleToken);   
  }


  close() {
    this.dialogRef.close(false);
  }
}