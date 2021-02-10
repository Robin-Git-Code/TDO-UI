import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxListComponent } from 'devextreme-angular';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

// const ELEMENT_DATA: any[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];

@Component({
  templateUrl: './edit-list.html',
  styleUrls: ['./edit-list.css']
})
export class EditListDialogComponent {
  displayedColumns: string[];
  displayedColumns1: string[];

  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  selection2 = new SelectionModel<any>(true, []);

  editListData: any;
  templateList: any;
  selectedTemplate: any;
  tabIndex: any = 0;
  selectedD: any;
  tempStatusAdd: boolean = true;

  editList: any;
  tabIndex2: any = 0;
  selectedList: any;
  selectedTODataList: any;
  selectedCCDataList: any;
  selectedBCCDataList: any;

  ToData: any = [];
  CCData: any = [];
  BCCData: any = [];
  customEmail: string = '';
  statusemailprint: any;
  PersonCategory: any;

  currentButtonOptions: any;
  doctorsButtonOptions: any;
  referringButtonOptions: any;
  generalButtonOptions: any;
  patientsButtonOptions: any;
  toButtonOptions: any;
  bccButtonOptions: any;
  ccButtonOptions: any;
  fromEditListBtn: boolean;
  type: string;

  recipients: String[] = [
    "To",
    "Cc",
    "Bcc"
  ];

  tableDataRecipients: Array<Object> = [];


  constructor(
    public dialogRef: MatDialogRef<any>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService, private AppService: AppService, public dialog: MatDialog) {
    dialogRef.disableClose = true;
    
  }

  ngOnInit() {
    this.fromEditListBtn = this.data.editList;
    this.changeColumn(this.data.type);
    this.statusemailprint = this.data.status;
    console.log(this.data)
    this.PersonCategory = this.data.PersonCategory;
    this.type = this.data.type;
    this.getData(this.data.type);

    this.data = this.data.data;
    this.ToData = [];
    this.CCData = [];
    this.BCCData = [];

    if(this.type == 'email'){
      this.recipients =[
        "To",
        "Cc",
        "Bcc"
      ];
      if (this.data?.ToData) {
        this.tableDataRecipients = [...this.data.ToData, ...this.tableDataRecipients];
      }
      if (this.data?.CCData) {
        this.tableDataRecipients = [...this.data.CCData, ...this.tableDataRecipients];
      }
      if (this.data?.BCCData) {
        this.tableDataRecipients = [...this.data.BCCData, ...this.tableDataRecipients];
      }
    }
    else{
      this.recipients =[
        "To",
      ];
      if (this.data?.letterData) {
  // ======================== Latest changes as on date 19-01-2021  ==========================  -->

        let letterDataArr = [...this.data.letterData].map((item)=>{
          return item = {...item, Email_ToType: 'To'}
        })
        this.tableDataRecipients = letterDataArr;

  // ======================== Latest changes as on date 19-01-2021  ==========================  -->

      }
    }
   
    this.dataSource2 = new MatTableDataSource<any>(this.tableDataRecipients);

    // this.tabStatus2(0);

    // if (this.data?.ToData) {
    //   this.ToData = this.data.ToData;
    // }
    // if (this.data?.CCData) {
    //   this.CCData = this.data.CCData;
    // }
    // if (this.data?.BCCData) {
    //   this.BCCData = this.data.BCCData;
    // }
  }

  onTabChanged(evt) {
    if (evt.index == 0) {
      this.updateTableData(1);
    }
    else if (evt.index == 1) {
      this.updateTableData(2);
    }
    else if (evt.index == 2) {
      this.updateTableData(3);
    }
    else if (evt.index == 3) {
      this.updateTableData(4);
    }
    else {
      this.updateTableData(5);
    }
  }

  changeColumn(type) {
    if (type == 'email') {
      this.displayedColumns = ['select', 'FirstName', 'LastName', 'Email', 'Role'];
      this.displayedColumns1 = ['select', 'FirstName', 'LastName', 'Email', 'Role'];

    } else {
      this.displayedColumns = ['select', 'FirstName', 'LastName', 'Address', 'Role'];
      this.displayedColumns1 = ['select', 'FirstName', 'LastName', 'Address', 'Role'];

    }


  }

  onSelectionPrinterChanged(val) {
    console.log(val);
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected2() {
    const numSelected = this.selection2.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle2() {
       this.isAllSelected2() ?
      this.selection2.clear() :
      this.dataSource2.data.forEach(row => this.selection2.select(row));

      console.log(this.dataSource2)
  }

  isSomeSelected2() {
    return this.selection2.selected.length > 0;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel2(row?: any): string {
    if (!row) {
      return `${this.isAllSelected2() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection2.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  getData(type) {
    let url = '';
    if (type == 'email') {
      url = 'NewLetter/EditList?PersonCategory=' + this.PersonCategory + '&AddressType=Email';
    }
    else {
      url = 'NewLetter/EditList?PersonCategory=' + this.PersonCategory + '&AddressType=Letter';
    }
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.editListData = resp.body.result;
        this.updateTableData(1);
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  updateTableData(status) {
    if (status == 1) {
      this.dataSource = new MatTableDataSource<any>(this.editListData.CurrentList);
    }
    if (status == 2) {
      this.dataSource = new MatTableDataSource<any>(this.editListData.DoctorList);
    }
    if (status == 3) {
      this.dataSource = new MatTableDataSource<any>(this.editListData.RefferelList);
    }
    if (status == 4) {
      this.dataSource = new MatTableDataSource<any>(this.editListData.GeneralList);
    }
    if (status == 5) {
      this.dataSource = new MatTableDataSource<any>(this.editListData.PateintList);
    }
  }



  AddEmails() {
    var exp = /(\w(=?@)\w+\.{1}[a-zA-Z]{2,})/i;
    if (!exp.test(this.customEmail)) {
      this.snackbar.open('Please enter valid mail address', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    else {
      if (this.tabIndex2 == 0) {
        let data = {
          Email: this.customEmail,
          FirstName: "",
          LastName: "",
          PersonId: 0,
          Role: "Other",
          Address: this.customEmail,
          Email_ToType: "To"
        }
        this.ToData.push(data);
        this.dataSource2 = new MatTableDataSource<any>(this.ToData);
      }
      if (this.tabIndex2 == 1) {
        let data = {
          Email: this.customEmail,
          FirstName: "",
          LastName: "",
          PersonId: 0,
          Role: "Other",
          Address: this.customEmail,
          Email_ToType: "Cc"
        }
        this.CCData.push(data);
        this.dataSource2 = new MatTableDataSource<any>(this.CCData);
      }
      if (this.tabIndex2 == 2) {
        let data = {
          Email: this.customEmail,
          FirstName: "",
          LastName: "",
          PersonId: 0,
          Role: "Other",
          Address: this.customEmail,
          Email_ToType: "Bcc"
        }
        this.BCCData.push(data);
        this.dataSource2 = new MatTableDataSource<any>(this.BCCData);
      }
    }
  }


  Add() {
    this.selectedList = this.selection.selected;

    if (!this.selectedList) {
      this.snackbar.open('Please select Letter Recipients', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    for (let index = 0; index < this.selectedList.length; index++) {
      const element = this.selectedList[index];
      this.tempStatusAdd = true;
        for (let k = 0; k < this.tableDataRecipients.length; k++) {
          const element2 = this.tableDataRecipients[k];
          if(this.type == 'email'){
            if (element2['Email'] == element.Email) {
              this.tempStatusAdd = false;
            }
          }
          else{
            if (element2['Address'] == element.Address) {
              this.tempStatusAdd = false;
            }
          }
        }
        if (this.tempStatusAdd) {
  // ======================== Latest changes as on date 19-01-2021  ==========================  -->
          if(this.type == 'email'){
            let tempEle = {...element, Email_ToType: 'To'}
          this.tableDataRecipients.push(tempEle);
          }
          else{
          this.tableDataRecipients.push(element);

          }
          
  // ======================== Latest changes as on date 19-01-2021  ==========================  -->

        }
    }
    this.selection2.clear();
    this.selection.clear();
    this.dataSource2 = new MatTableDataSource<any>(this.tableDataRecipients);
  }

  removeRecepient(idx) {
    this.tableDataRecipients.splice(idx, 1);
    this.dataSource2 = new MatTableDataSource<any>(this.tableDataRecipients);
  }

  Remove() {
    if (this.selection2.selected.length == 0) {
      this.snackbar.open('Please select row to remove', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    // if (this.tabIndex2 == 0) {
      for (let index = 0; index < this.selection2.selected.length; index++) {
        const element = this.selection2.selected[index];
        for (let index = 0; index < this.tableDataRecipients.length; index++) {
          const element2 = this.tableDataRecipients[index];
          if (element2['Email'] == element.Email) {
            this.tableDataRecipients.splice(index, 1);
          }
        }
      }
      this.dataSource2 = new MatTableDataSource<any>(this.tableDataRecipients);
    // }
    // if (this.tabIndex2 == 1) {
    //   for (let index = 0; index < this.selection2.selected.length; index++) {
    //     const element = this.selection2.selected[index];
    //     for (let index = 0; index < this.CCData.length; index++) {
    //       const element2 = this.CCData[index];
    //       if (element2.Email == element.Email) {
    //         this.CCData.splice(index, 1);
    //       }
    //     }
    //   }
    //   this.dataSource2 = new MatTableDataSource<any>(this.CCData);
    // }
    // if (this.tabIndex2 == 2) {
    //   for (let index = 0; index < this.selection2.selected.length; index++) {
    //     const element = this.selection2.selected[index];
    //     for (let index = 0; index < this.BCCData.length; index++) {
    //       const element2 = this.BCCData[index];
    //       if (element2.Email == element.Email) {
    //         this.BCCData.splice(index, 1);
    //       }
    //     }
    //   }
    //   this.dataSource2 = new MatTableDataSource<any>(this.BCCData);
    // }
  }

  RemoveAll() {
   this.tableDataRecipients = [];

    this.dataSource2 = new MatTableDataSource<any>([]);
    this.selection2 = new SelectionModel<any>(true, []);
    console.log(this.selection2);
    console.log(this.dataSource2);
  }

  tabStatus(status) {
    this.tabIndex = status.index;
  }

  tabStatus2(status) {
    this.tabIndex2 = status;
    if (this.tabIndex2 == 0) {
      this.dataSource2 = new MatTableDataSource<any>(this.ToData);
    }
    if (this.tabIndex2 == 1) {
      this.dataSource2 = new MatTableDataSource<any>(this.CCData);
    }
    if (this.tabIndex2 == 2) {
      this.dataSource2 = new MatTableDataSource<any>(this.BCCData);
    }
  }

  onValueChanged(evt, i){
    this.tableDataRecipients[i] = {...this.tableDataRecipients[i], Email_ToType: evt.Email_ToType };
  }

  submit() {
    let type = this.type.toString();
    console.log(type, type.trim())
    let data;
    if(type.trim()=='email'){
      data = {
        BCCData: this.tableDataRecipients.filter((item)=>{
          return item['Email_ToType'] === 'Bcc'
        }),
        CCData: this.tableDataRecipients.filter((item)=>{
          return item['Email_ToType']  === 'Cc'
        }),
        ToData: this.tableDataRecipients.filter((item)=>{
          return item['Email_ToType']  === 'To'
        }),
        letterData: []
      }
    }
    else{
      data = {
        BCCData: [],
        CCData: [],
        ToData: [],
        letterData: this.tableDataRecipients
      }
    }
    

    this.dialogRef.close(data);
  }

  close() {
    this.dialogRef.close(false);
  }
}