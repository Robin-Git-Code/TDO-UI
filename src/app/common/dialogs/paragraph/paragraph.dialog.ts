import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxListComponent } from 'devextreme-angular';
import Form from "devextreme/ui/form"; 
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';


@Component({
  templateUrl: './paragraph-dialog.html',
  styleUrls: ['./paragraph-dialog.css']
})
export class ParagraphDialogComponent {
  @ViewChild(DxListComponent, { static: false }) list: DxListComponent;
  @ViewChild('nameInput') nameInput: ElementRef;
  @ViewChild('contentArea') contentArea: ElementRef;
  templateName: string;
  invalidName: boolean;
  paraForm: FormGroup;
  paragraphList: any;
  selectedPara: any;


  labelLocation: string;
  readOnly: boolean;
  showColon: boolean;
  minColWidth: number;
  colCount: number;
  width: any;


  constructor(
    public dialogRef: MatDialogRef<any>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService, private AppService: AppService, public dialog: MatDialog) { 
      dialogRef.disableClose = true;
    this.labelLocation = "top";
    this.readOnly = false;
    this.showColon = true;
    this.minColWidth = 300;
    this.colCount = 2;
    this.data = {};
     }



  ngOnInit() {
    this.getParagraph();
    this.paraForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      text: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  get f() { return this.paraForm.controls; }


  onSelectionChanged(e) {
    this.selectedPara = e.addedItems[0];
    if(e.addedItems[0]){
      this.getparaInfo();
    }    
  }
  getParagraph() {
    let url = 'NewLetter/Paragraph';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.paragraphList = resp.body.ResultList;
        console.log(this.paragraphList);        
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  // onParaChange(val){
  //   console.log(val.BoilerID);
    
  // }

  getparaInfo() {
    this.spinner.show();
    let url = 'NewLetter/Paragraph?BoilerId=' + this.selectedPara.BoilerID;
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.body) {
          this.data = resp.body.Result;
          this.paraForm.controls.name.setValue(this.data.BoilerName);
          this.paraForm.controls.text.setValue(this.data.Content);
        }
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  update() {
    if (!this.data.BoilerName || !this.data.Content){
      return false;
    }
    let data = {
      BoilerID: 0,
      BoilerName: this.data.BoilerName,
      Content: this.data.Content
    }
    if (this.selectedPara) {
      data.BoilerID = this.selectedPara.BoilerID
    }
    this.spinner.show();
    let url = 'NewLetter/Paragraph';
    this.AppService.POST(url, data).subscribe(
      (resp: any) => {
        this.spinner.hide();
        this.snackbar.open(resp.Message, '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        this.dialogRef.close(true);
      });
  }
  Add() {
    this.selectedPara = '';
    this.data = {};
  }

  Remove() {
    // this.nameInput.nativeElement.value = '';
    // this.contentArea.nativeElement.value = '';
    this.data.BoilerName = '';
    this.data.Content = '';
    for (let index = 0; index < this.paragraphList.length; index++) {
      const element = this.paragraphList[index];
      if (element.BoilerID == this.selectedPara.BoilerID){
        this.paragraphList.splice(index, 1);
      }
    }
    this.paraForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(20)]],
      text: ['', [Validators.required, Validators.maxLength(500)]],
    });
    let url = 'NewLetter/DeleteParagraph?BoilerId=' + this.selectedPara.BoilerID ;
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.snackbar.open(resp.body.Message, '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
      });
    this.selectedPara = '';
    } 

  close() {
    this.dialogRef.close(false);
  }
}