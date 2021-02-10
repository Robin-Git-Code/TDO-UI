import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxListComponent } from 'devextreme-angular';
import { MailSetOptionsDialogComponent } from '../mail-set-options/mail-set-options.dialog';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  templateUrl: './mail-sets.html',
  styleUrls: ['./mail-sets.css']
})
export class MailsetsDialogComponent {
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  selectedmultipleToken: any;
  TokenList : any;
  MailsetList : any;
  FinalMAILstring : any;
  showListMailsets : any;

  constructor(
    public dialogRef: MatDialogRef<any>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService, private AppService: AppService, public dialog: MatDialog) {
    dialogRef.disableClose = true;
    
  }



  ngOnInit() {
    this.GetMailSets();
  }

    
  openOptions(){
    const dialogRef = this.dialog.open(MailSetOptionsDialogComponent, {
      width: '1050px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.GetMailSets();
      }
    });
  }

  onTokenModelChange() {
    this.FinalMAILstring = '';
    if (this.selectedmultipleToken.length > 0) {
      this.selectedmultipleToken.forEach(element => {
        this.FinalMAILstring = this.FinalMAILstring + element.MailSetID + ','
      });
    }
    this.FinalMAILstring = this.FinalMAILstring.replace(/,\s*$/, "");
    if (this.FinalMAILstring) {
      this.GetSelectedMailsetsList();
    } 
    else{
      this.showListMailsets = [];
    }
  }

  GetSelectedMailsetsList(){  
    this.spinner.show();
    let url = 'NewLetter/GetDisplayMailSetList?MST_ID=' + this.FinalMAILstring;
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.showListMailsets = resp.body.ResultList;
       // console.log(resp.body.ResultList);
        this.spinner.hide();
      });
  }

  saveSets(url){
    if (this.showListMailsets ?.length == 0 || !this.showListMailsets){
      this.snackbar.open('no mailsets data', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    this.spinner.show();
    this.AppService.POST(url, this.showListMailsets).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.StatusCode==1){
          this.snackbar.open(resp.Message, '', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          this.dialogRef.close();
        }
      });    
  }

  GetMailSets() {    
    let url = 'NewLetter/GetMailSetList';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.body.Message == 'Success') {
          this.MailsetList = resp.body.Result;
        }
      });
  }

  close() {
    this.dialogRef.close(false);
  }
}