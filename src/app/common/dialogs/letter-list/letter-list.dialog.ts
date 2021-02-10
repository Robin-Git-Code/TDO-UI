import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxListComponent } from 'devextreme-angular';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from '../../../common/dialogs/confirm/confirm.dialog';  
import { HttpParams, HttpClient } from '@angular/common/http';
import CustomStore from 'devextreme/data/custom_store';
import * as AspNetData from "devextreme-aspnet-data-nojquery";
import { createStore } from 'devextreme-aspnet-data-nojquery';
import ODataStore from 'devextreme/data/odata/store';






@Component({
  templateUrl: './letter-list.html',
  styleUrls: ['./letter-list.css']
})
export class LetterListDialogComponent {
  displayedColumns: string[] = ['FirstName', 'LastName', 'Address', 'Description', 'DeliveryMethod', 'Email', 'DateGenerated','DateSent','Patient','Tooth','actions'];
  // dataSource: MatTableDataSource<any>;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;




  startDate: Date = new Date();
  now: Date = new Date();
  value: Date = new Date(1981, 3, 27);
  endDate: Date = new Date();
  startValid: boolean = true;
  endValid: boolean = true;

  patientLetterListData: any;
  referringDoctorListData: any;
  toothListData: any;


  selectedPatientLetter: any;
  selectedDoctor: any;
  selectedPatientPatient: any;
  selectedTooth: any;

  letterLists: any;

  patientLetterStatus: boolean = false;
  dateStatus: boolean = false;
  doctorStatus: boolean = false;
  patientPatientStatus: boolean = false;
  patientToothStatus: boolean = false;
  viewButton: any;
  deleteButton: any;
  
  constructor(
    public dialogRef: MatDialogRef<any>, private snackbar: MatSnackBar,public httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService, private AppService: AppService, public dialog: MatDialog) {
    dialogRef.disableClose = true;
    this.cloneIconClick = this.cloneIconClick.bind(this);
    this.spinner.hide();   
  }

  ngOnInit() {
    this.getPatientLetterList();
    // this.getdefaultList();
    this.getDefaultListNew();
  }

  cloneIconClick(e) {
    this.viewFnc(e.row?.data);
  }

  getDefaultListNew(){
let url = 'NewLetter';
    let data = {
      "IDNum_Letter": 0,
      "IDNum_Patient": 0,
      "RefID": 0,
      "DateGenerated_Start": null,
      "DateGenerated_End": null,
      "ExamID": 0
    }
  this.dataSource = new CustomStore({
    // key: "ID",
    load: () => this.sendRequest(url + "/GetLetterList", "POST", data),
    remove: (key) => this.sendRequest(url + "/DeleteOrder", "DELETE", {
        key: key
    })
});


  }


  sendRequest(url: string, method: string = "GET", data: any = {}): any {
    // this.logRequest(method, url, data);

    let httpParams = new HttpParams({ fromObject: data });
    let httpOptions = { withCredentials: true, body: httpParams };
    let result;

    switch(method) {
        case "GET":
            result = this.AppService.GET(url);
            break;
        case "PUT":
            result = this.httpClient.put(url, httpParams, httpOptions);
            break;
        case "POST":
            result = this.AppService.POST(url, data);
            break;
        case "DELETE":
            result = this.AppService.DELETE(url);
            // result = this.deleteLetterList()
            break;
    }

    return result
        .toPromise()
        .then((data: any) => {
            return method === "GET" ? data.data : data.result;
        })
        .catch(e => {
            throw e && e.error && e.error.Message;
        });
}


  deleteItem(e: any){
    console.log('delete',e)
    e.cancel = true;
    e.data.deleted = true;

      this.spinner.show();
      let url = 'NewLetter/DeleteLetters';
      let data = {
        "LFE_ID": e.data.LFE_ID,
        "IsAllRecepient": false,
        "FilterAddressIds": null 
      }
      this.AppService.POST(url, data).subscribe(
        (resp: any) => {
          console.log(resp);
          this.spinner.hide();
          if (resp.Status==2) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              width: '500px',
              data: resp.Message
            });
            dialogRef.afterClosed().subscribe(result => {
              if(result == 'closeButton'){
                this.dialogRef.close(false);
                return false; 
              }
              if (result == true) {
                this.deleteRecepient(e.data.LFE_ID, true, resp);
              }else{
                this.deleteRecepient(e.data.ID, false, resp);
              }
            });
          }
          else{
            this.snackbar.open(resp.Message, '', {
              duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
            });
            this.dialogRef.close(false); 
            return false;
          }
        });
  }

  deleteRecepient(id:number, IsAllRecepient:boolean, result:any){
    let data = {
      "LFE_ID": id,
      "IsAllRecepient": false,
      "FilterAddressIds": result.FilterAddressIds
    }
    if(IsAllRecepient){
      data.IsAllRecepient = IsAllRecepient;
    }else{
      data.FilterAddressIds = id;
    }
    let url = 'NewLetter/DeleteLetters';
    this.AppService.POST(url, data).subscribe(
      (resp: any) => {
        console.log(resp);
        this.spinner.hide();
        this.snackbar.open(resp.Message, '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        this.dialogRef.close(false);
        return false;                   
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  getReferringDoctorList() {
    let url = 'NewLetter/GetAllReferring';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.getToothDropdown();
        this.referringDoctorListData = resp.body;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getPatientLetterList() {
    this.spinner.show();
    let url = 'NewLetter/GetAllPatient';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.getReferringDoctorList();
        this.patientLetterListData = resp.body;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getToothDropdown() {
    let url = 'NewLetter/GetToothList?IdNum=1';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.toothListData = resp.body.ResultList;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }





  onSelectionPatientLetter(val) {
    this.selectedPatientLetter = val.selectedItem;
  //  this.getLetterList();
  }

  onSelectionDoctor(val) {
    this.selectedDoctor = val.selectedItem;
  //  this.getLetterList();
  }

  onSelectionPatientPatient(val) {
    this.selectedPatientPatient = val.selectedItem;
  //  this.getLetterList();
  }

  onSelectionTooth(val) {
    this.selectedTooth = val.selectedItem;
  //  this.getLetterList();
  }

  onSelectionDate(val){ 
  //  this.getLetterList(); 
  }

  handleValueChangePatientLetter(val) {
    this.patientLetterStatus  = val.value;
    this.selectedPatientLetter = this.patientLetterListData[0];
  //  this.getLetterList();
  }

  handleValueChangeDoctor(val) {
    this.doctorStatus = val.value;
    this.selectedDoctor = this.referringDoctorListData[0];
  //  this.getLetterList();
  }

  handleValueChangeDate(val) {
    this.dateStatus = val.value;
  //  this.getLetterList();
  }

  handleValueChangePatientPatient(val) {
    this.patientPatientStatus = val.value;
    this.selectedPatientPatient = this.patientLetterListData[0];
  //  this.getLetterList();
  }

  handleValueChangeTooth(val) {
    this.patientToothStatus = val.value;
    this.selectedTooth = this.toothListData[0];
  //  this.getLetterList();
  }

  getLetterList() {
    var datePipe = new DatePipe("en-US");
    this.spinner.show();
    let url = 'NewLetter/GetLetterList';
    let data:any;
    data = {
      "IDNum_Letter": 0,
      "IDNum_Patient": 0,
      "RefID": 0,
      "DateGenerated_Start": null,
      "DateGenerated_End": null,
      "ExamID": 0
    }
    if (this.patientLetterStatus) {
      data.IDNum_Letter = this.selectedPatientLetter.IDNum;
    }
    if (this.patientPatientStatus) {
      data.IDNum_Patient = this.selectedPatientPatient.IDNum;
    }
    if (this.doctorStatus) {
      data.RefID = this.selectedDoctor.Id;
    }
    if (this.dateStatus) {
      data.DateGenerated_Start =  datePipe.transform(this.startDate, 'MM/dd/yyyy');
        data.DateGenerated_End =  datePipe.transform(this.endDate, 'MM/dd/yyyy');
    }
    if (this.patientToothStatus) {
      data.ExamID = this.selectedTooth.ID
    }
    this.AppService.POST(url, data).subscribe(
      (resp: any) => {
        this.spinner.hide();
       
          this.letterLists = resp.result;
          // this.dataSource = new MatTableDataSource(resp.result);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
              this.dataSource = resp.result;
      });

  }

  getdefaultList() {
    this.spinner.show();
    var datePipe = new DatePipe("en-US");
    let url = 'NewLetter/GetLetterList';
    let data = {
      "IDNum_Letter": 0,
      "IDNum_Patient": 0,
      "RefID": 0,
      "DateGenerated_Start": null,
      "DateGenerated_End": null,
      "ExamID": 0
    }
    this.AppService.POST(url, data).subscribe(
      (resp: any) => {
        this.spinner.hide();
        this.dataSource = new MatTableDataSource(resp.result);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  viewFnc(val){
    this.dialogRef.close(val);   
  } 

  deleteLetterList(val){
    console.log(val);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: 'Do you wish to delete ?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.spinner.show();
        let url = 'NewLetter/DeleteLetters';
        let data = {
          "LFE_ID": val,
          "IsAllRecepient": false,
          "FilterAddressIds": null 
        }
        this.AppService.POST(url, data).subscribe(
          (resp: any) => {
            console.log(resp);
            this.spinner.hide();
            if (resp.Status==2) {
              const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '500px',
                data: resp.Message
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result == true) {
                  this.spinner.show();
                  let url = 'NewLetter/DeleteLetters';
                  let data = {
                    "LFE_ID": val.LFE_ID,

                    "IsAllRecepient": true,

                    "FilterAddressIds": resp.FilterAddressIds
                  }
                  this.AppService.POST(url, data).subscribe(
                    (resp: any) => {
                      console.log(resp);
                      this.spinner.hide();
                      this.snackbar.open(resp.Message, '', {
                        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
                      });
                      this.dialogRef.close(false);
                      return false;                   
                    });
                }else{
                  this.spinner.show();
                  let url = 'NewLetter/DeleteLetters';
                  let data = {
                    "LFE_ID": val.LFE_ID,

                    "IsAllRecepient": false,

                    "FilterAddressIds": resp.FilterAddressIds
                  }
                  this.AppService.POST(url, data).subscribe(
                    (resp: any) => {
                      console.log(resp);
                      this.spinner.hide();
                      this.snackbar.open(resp.Message, '', {
                        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
                      });
                      this.dialogRef.close(false);
                      return false;                   
                    });
                }
              });
            }
            else{
              this.snackbar.open(resp.Message, '', {
                duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
              });
              this.dialogRef.close(false); 
              return false;
            }
          });
      }
    });   
  }


  close() {
    this.dialogRef.close(false);
  }
}