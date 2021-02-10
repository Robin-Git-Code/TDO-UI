import { Component, ViewChild, ElementRef, OnDestroy, OnInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxListComponent } from 'devextreme-angular';
import { staticLists } from '../../../app.constant';
import { DatePipe } from '@angular/common';


@Component({
  templateUrl: './batch-letter.html',
  styleUrls: ['./batch-letter.css']
})
export class BatchLetterDialogComponent implements OnInit {
  
  tabStatusVal: string = '1';
  selectedTemplate: any = undefined;
  patientList : any;
  DoctorList : any;
  getCatList : any;
  selectedplistQ : any;
  emergetypeList : any;
  forList : any;
  selectedmultipleFor : any;
  selectedmultipleEmerg : any;
  selectedCategory : any;
  toRank : number;
  fromRank: number;
  value: Date = new Date(1981, 3, 27);
  
  now: Date = new Date();
  orderBy : any;
  FinalEmergedString : any;
  startDate: Date = new Date();
  buttonDisabled: boolean = false;
  startValid: boolean = true;
  endValid: boolean = true;
  doctorId : any;
  FinalFORString : any;
  locationList : any;
  selectedLocation: any ;

  startDateRR: Date = new Date();
  nowRR: Date = new Date();
  startValidRR: boolean = true;
  endValidRR: boolean = true;

  startDateCR: Date = new Date();
  nowCR: Date = new Date();
  startValidCR: boolean = true;
  endValidCR: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<any>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService, private AppService: AppService, public dialog: MatDialog) {
    dialogRef.disableClose = true;
    this.getCatList = staticLists.categoryList;
  }

  ngOnInit() {  
    this.getDoctorsList();
    this.getPatientList();
    this.getEmergetype();
    this.getForListing();
    this.getLocationList();
    this.selectedCategory = this.getCatList[0];
  }
    
  onSelectionChanged(e) {
    this.selectedplistQ = e.selectedItem;
  }

  onSelectionLocationChanged(e){
    this.selectedLocation = e.selectedItem;
  }

  onSelectionDoc(e){
    this.doctorId = e.selectedItem;
  }

  onForModelChange(){ 
    this.FinalFORString = '';
    if (this.selectedmultipleFor.length > 0) {
      this.selectedmultipleFor.forEach(element => {
        this.FinalFORString = this.FinalFORString + element.Name + ','
      });
    }
    this.FinalFORString = this.FinalFORString.replace(/,\s*$/, "");
  }

  onSelectionCat(e){
    this.selectedCategory = e.selectedItem;
  }

  onSelectionEmerged(){
    this.FinalEmergedString = '';
    if (this.selectedmultipleEmerg.length>0){
      this.selectedmultipleEmerg.forEach(element => {
        this.FinalEmergedString = this.FinalEmergedString+element.EmergeTypeName+','       
      });    
    }
    this.FinalEmergedString = this.FinalEmergedString.replace(/,\s*$/, "");
  }

  getForListing(){
    let url = 'NewLetter/GetApptForList';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.forList = resp.body.ResultList;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getEmergetype(){
    let url = 'NewLetter/GetEmergeTypeList';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.emergetypeList = resp.body.ResultList;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getLocationList() {
    let url = 'NewLetter/GetAllLocationList';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.locationList = resp.body.Result;
        this.selectedLocation = this.locationList[0];
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getPatientList() {
    let url = 'NewLetter/GetBLReportList?Type=1';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.patientList = resp.body.ResultList;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getDoctorsList() {
    let url = 'NewLetter/GetDoctorList';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.DoctorList = resp.body.ResultList;
        this.doctorId = this.DoctorList[0];
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }


  tabStatus(status:string){
    if(status=='1'){
      this.tabStatusVal = status;
    }
    if (status == '2') {
      this.tabStatusVal = status;
    }
    if (status == '3') {
      this.tabStatusVal = status;
    }
  }

  validateGenerate(){
    if (this.tabStatusVal == '1') {
      if (!this.selectedplistQ){
        this.snackbar.open('Please select patient list query', '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        return false;
      }
      if (this.selectedplistQ.ID == 10 || this.selectedplistQ.ID == 11) {
        if (!this.doctorId){
          this.snackbar.open('Please select doctor', '', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          return false;
        }
        else{
          this.generate();
          return false;
        }       
      }
      if (this.selectedplistQ.ID == 9){
        if (!this.startDate) {
          this.snackbar.open('Please insert Begin Date', '', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          return false;
        }
        if (!this.now) {
          this.snackbar.open('Please insert End Date', '', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          return false;
        }
        // if (!this.selectedmultipleEmerg || this.selectedmultipleEmerg?.length==0){
        //   this.snackbar.open('Please select emerge type', '', {
        //     duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        //   });
        //   return false;
        // }
        // if (!this.selectedmultipleFor || this.selectedmultipleFor?.length == 0) {
        //   this.snackbar.open('Please select for', '', {
        //     duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        //   });
        //   return false;
        // }
        if (!this.selectedLocation) {
          this.snackbar.open('Please select location', '', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          return false;
        }
        this.generate();
        return false;
      }
      this.generate();
      return false;
    }
    if (this.tabStatusVal == '2') {
      if (!this.startDateCR){
        this.snackbar.open('Please insert Initial Completion Date', '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        return false;
      }
      if (!this.nowCR) {
        this.snackbar.open('Please insert Ending Completion Date', '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        return false;
      }
      this.generate();
      return false;
    }
    if (this.tabStatusVal == '3') {
      if (!this.startDateRR) {
        this.snackbar.open('Please insert Begin Date', '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        return false;
      }
      if (!this.nowRR) {
        this.snackbar.open('Please insert End Date', '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        return false;
      }
      if (!this.selectedCategory){
        this.snackbar.open('Please select category', '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        return false;
      }
      if (!this.doctorId) {
        this.snackbar.open('Please select doctor', '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        return false;
      }
      // if (!this.doctorId) {
      //   this.snackbar.open('Please select doctor', '', {
      //     duration: 3000, horizontalPosition: 'left', verticalPosition: 'top', panelClass: "success-dialog"
      //   });
      //   return false;
      // }
      // if (!this.fromRank) {
      //   this.snackbar.open('Please insert from rank', '', {
      //     duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      //   });
      //   return false;
      // }
      // if (!this.toRank) {
      //   this.snackbar.open('Please insert to rank', '', {
      //     duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      //   });
      //   return false;
      // }
      if (!this.orderBy) {
        this.snackbar.open('Please choose order by', '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        return false;
      }
      else{
        this.generate();
      }
    }
  }

  

  generate() {
    this.spinner.show();
    var datePipe = new DatePipe("en-US");
    let data = {
      'Type': this.tabStatusVal,
      'TemplateID': this.data.tmplId,
      'Subject': this.data.subject,
      'Description': this.data.description,

      'BLReportListID': this.selectedplistQ?.ID,
      'DoctorID': this.doctorId?.DrNum,
      'BeginDate': datePipe.transform(this.startDate, 'MM/dd/yyyy'),

      'EndDate': datePipe.transform(this.now, 'MM/dd/yyyy'),
      'EmergType': this.FinalEmergedString,
      'ForValue': this.FinalFORString,

      'FromRank': this.fromRank,
      'ToRank': this.toRank,
      'RankingOrder': this.orderBy,

      'RankingCategory': this.selectedCategory?.ID,
      'InitialAppointmentDate': datePipe.transform(this.startDate, 'MM/dd/yyyy'),
      'EndingAppointmentDate': datePipe.transform(this.now, 'MM/dd/yyyy'),

      'InitialCompletionDate': datePipe.transform(this.startDateCR, 'MM/dd/yyyy'),
      'EndingCompletionDate': datePipe.transform(this.nowCR, 'MM/dd/yyyy'),
      'LocationID': this.selectedLocation?.id
    }
    if (this.tabStatusVal=='3'){
      data.InitialAppointmentDate = datePipe.transform(this.startDateRR, 'MM/dd/yyyy');
      data.EndingAppointmentDate = datePipe.transform(this.nowRR, 'MM/dd/yyyy');
    }
    let url = 'NewLetter/ExecuteLetterBatchQuery';
    this.AppService.POST(url, data).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.StatusCode){
          this.snackbar.open(resp.Message, '', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          this.dialogRef.close(true);      
        }
        console.log(resp);
      });
  }

  onKey2(event: any) {
    console.log(event); 
    if (event.charCode == 45 || event.charCode ==46) {
      event.preventDefault();
    }
    // else if (event.charCode > 47 && event.charCode < 58) {
    // }
    // else {
    //   event.preventDefault();
    // }
  }

  onKey(event: any) {
    if (event.charCode == 46) {
      event.preventDefault();
    }
    else if (event.charCode > 47 && event.charCode < 58) {
    }
    else {
      event.preventDefault();
    }
  }

  

  close() {
    this.dialogRef.close(false);
  }
}