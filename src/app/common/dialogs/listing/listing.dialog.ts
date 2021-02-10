import { Component, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { staticLists } from '../../../app.constant';
import { NgxSpinnerService } from "ngx-spinner";
import { AppService } from "../../../app.service";
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './listing-dialog.html',
  styleUrls: ['./listing-dialog.css']
})
export class ListingDialogComponent {

  dummyData: any;
  radioSelected: string;
  NotesList: any;
  PrescriptionList: any;
  NoteData: any;
  MultiToothList: any;
  beginD: any = new Date();
  endD: any = new Date();
  secInsurancList : any;
  dateRangeStatus : boolean =  false;
  value: Date = new Date(1981, 3, 27);
  errorvali : boolean = false;
  startDateRR: Date = new Date();
  nowRR: Date = new Date();
  startValidRR: boolean = true;
  endValidRR: boolean = true;

  constructor(private spinner: NgxSpinnerService, private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<any>, private AppService: AppService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog) { dialogRef.disableClose = true; }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (this.data == "Notes") {
      this.getNotes();
      return false;
    }
    if (this.data == "Prescription") {
      this.getPrescription();
      return false;
    }
    if (this.data == "DebitCredit") {
      this.getDebitCredit();
      return false;
    }
    if (this.data == "MultiToothSummaryNote") {
      this.getmultiTooth();
      return false;
    }
    if (this.data == "SecondaryInsurance") {
      this.getSecInsurance();
      return false;
    }
    this.dummyData = staticLists.cbctList;
  }

  getSecInsurance(){
    this.spinner.show();
    let url = 'LetterTemplate/GetSecondaryInsurancePopup';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.secInsurancList = resp.body;
        this.spinner.hide();
      });
  }

  getNotes() {
    this.spinner.show();
    let url = 'LetterTemplate/GetNotesForPopup';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.NotesList = resp.body;
        this.spinner.hide();
      });
  }


  getDebitCredit() {
    this.spinner.show();
    let url = 'LetterTemplate/GetDebitCreditRangePopup';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        console.log(resp.body);
        this.beginD = resp.body.Beginning;
        this.endD = resp.body.Ending;
        this.dateRangeStatus = true;     
        this.spinner.hide();
      });
  }

  getmultiTooth() {
    this.spinner.show();
    let url = 'LetterTemplate/GetMultiToothSummaryNoteForPopup';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.MultiToothList = resp.body;
        console.log(resp);

        this.spinner.hide();
      });
  }

  getPrescription() {
    this.spinner.show();
    let url = 'LetterTemplate/GetPrescriptionForPopup';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.PrescriptionList = resp.body;
        this.spinner.hide();
      });
  }

  confirm() {
    this.dialogRef.close(this.radioSelected);
  }

  onOptionChanged(e) {
    if (e.fullName === "isValid") {
      if (e.value) {
        console.log("enable button");
      } else {
        console.log("disable button");
      }
    }
  }

  onKeyUp(e) {
    let valid = e.component.option("isValid");
    if (valid) {
      console.log("Enable button");
     // this.buttonDisabled = false;
    } else {
      console.log("Disable button");
     // this.buttonDisabled = true;
    }
  }

  onValueChanged(e){
    let valid = e.component.option("isValid");
    if (valid) {
      console.log("Enable button");
      // this.buttonDisabled = false;
    } else {
      console.log("Disable button");
      // this.buttonDisabled = true;
    }
  }
  

  dateDebit() { 
    var compare_dates = (date1, date2)=> {
      if (date1 > date2){
        this.snackbar.open('Begin date must be smaller than the end date', '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        this.errorvali = true;
      } 
     
    }
    compare_dates(new Date(this.beginD), new Date(this.endD));
    if (this.errorvali){
      this.errorvali = false;
      return false;
    }
    var datePipe = new DatePipe("en-US");
    this.beginD = datePipe.transform(this.beginD, 'MM/dd/yyyy');
    this.endD = datePipe.transform(this.endD, 'MM/dd/yyyy');

    let data = {
      'start': datePipe.transform(this.beginD, 'MM/dd/yyyy'),
      'end': datePipe.transform(this.endD, 'MM/dd/yyyy')
    }
    console.log(data);
    this.dialogRef.close(data);
  }

  radioChange(val) {
    this.radioSelected = val;
    this.getNoteDetails(val);
  }
  getNoteDetails(val) {
    this.spinner.show();
    let url = 'LetterTemplate/SelectNote?Id=' + val;
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.NoteData = resp.body.Note;
        this.spinner.hide();
      });
  }

  onSelectionChanged(val) {
    console.log(val);
    this.radioSelected = val.addedItems[0].ID;
  }

  onSelectionChanged2(val) {
    this.radioSelected = val.addedItems[0].ID;
    this.getNoteDetails(this.radioSelected);
  }

  onSelectionChanged3(val) {
    this.radioSelected = val.addedItems[0].ctr;
  }

  closeTop() {
    this.dialogRef.close(false);
  }
}