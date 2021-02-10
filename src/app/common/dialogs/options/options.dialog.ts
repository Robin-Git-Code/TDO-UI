import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxListComponent, DxToolbarModule } from 'devextreme-angular';


@Component({
  templateUrl: './options-dialog.html',
  styleUrls: ['./options-dialog.css']
})
export class OptionsDialogComponent {
  @ViewChild(DxListComponent, { static: false }) list: DxListComponent;

  labelLocation: string;
  readOnly: boolean;
  showColon: boolean;
  minColWidth: number;
  colCount: number;
  width: any;

  editClicked : boolean = false;
  selectedTemplate: any = undefined;
  templateList: any;
  deliveryTab: boolean = true;
  subjectTab: boolean = false;
  deliveryOptionsList: any;
  SelectedDeliveryLists: any=[];
  toWhomList: any;
  selectedMailType: any;
  mySubject : string='';
  toList: any;
  myId : number = 0;
  resetVal : any;
  singleDeliveryIdSelected :any='';
  infoListDocPatient : any;
  sendData : any =[];
  verifyDelivery : any = [];

  editButtonOptions: any;
  saveButtonOptions: any;
  resetButtonOptions: any;
  cancelButtonOptions: any;
  getMailType: string = "";
  newMailType:string;
  mailTypeId: number;

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
    this.editButtonOptions = {
      text: 'Edit',
      onClick: () => {
        this.EditOptions();
      }
    };
    this.saveButtonOptions = {
      text: "Save",
      onClick: () => {
        this.SaveOptions();
      }
    };

    this.resetButtonOptions = {
      text: "Cancel",
      onClick: () => {
        this.resetAllVal();
      }
    };

    this.cancelButtonOptions = {
      text: "Cancel",
      onClick: () => {
        this.close();
      }
    };
    this.toList = [
      { name: 'TO', value: 'To' },
      { name: 'CC', value: 'Cc' },
      { name: 'BCC', value: 'Bcc' }
    ];
    
    this.selectedMailType = [{name: 'Letter', value: 'Letter'}, {name: 'Email', value: 'Email'}];
  }



  ngOnInit() {
    this.getTemplate();
    this.getDeliveryRoles();
    this.getPatientDoctorInformation();
   // this.getDeliverymailtype();
    this.SelectedDeliveryLists = [{ RoleId: '', EMailToType: 'To',mytoList:this.toList[0], MailType: 'Email' }];
    this.resetVal = this.SelectedDeliveryLists;
  }

  mycheck(){
    console.log('clicked');    
  }

 

  resetAllVal(){
    this.selectedTemplate = undefined; 
    this.SelectedDeliveryLists = [{ RoleId: '', EMailToType: 'To',mytoList:this.toList[0], MailType: 'Email' }];
    this.mySubject = '';
    this.editClicked = false;
  }

  tabStatus(status) {
    if (status == '1') {
      this.deliveryTab = true;
      this.subjectTab = false;
    }
    else {
      this.deliveryTab = false;
      this.subjectTab = true;
    }
  }

  onSelectionChanged(e) {
    this.selectedTemplate = e.addedItems[0];
    this.getDeliveryData(this.selectedTemplate.TemplateID)
  }

  onToChange(val,data){
    if(val.selectedItem){
      data.EMailToType = val.selectedItem.value;
      data.mytoList = val.selectedItem;
    }
  }

  ontoWhomChange(val,data){
    if(val.selectedItem){
      data.Role = val.selectedItem.Role;
      data.RoleId = val.selectedItem.RoleId;
      data.myToWhomList = val.selectedItem;
    }
  }

  getDeliveryData(id){
    let url = 'NewLetter/GetDeliveryOptionsList?TemplateId='+id;
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.SelectedDeliveryLists = resp.body.Result;
        if(this.SelectedDeliveryLists.length>0){
          for (let index = 0; index < this.SelectedDeliveryLists.length; index++) {
            const element = this.SelectedDeliveryLists[index];
            
            if(element.EMailToType=='To'){             
              element.mytoList = this.toList[0];
              console.log(element.mytoList); 
            }
            if(element.EMailToType=='Cc'){
              element.mytoList = this.toList[1];
              console.log(element.mytoList); 
            }
            if(element.EMailToType=='Bcc'){
              element.mytoList = this.toList[2];
              console.log(element.mytoList); 
            }
            if(element.MailType=='Letter'){
              element.newMailType = this.selectedMailType[0];
            }
            if(element.MailType=='Email'){
              element.newMailType = this.selectedMailType[1];
            }
            for (let index = 0; index < this.toWhomList.length; index++) {
              const element2 = this.toWhomList[index];
              if(element2.RoleId ==element.RoleId){      
                element.myToWhomList = element2;
              }
            }          
          }
        }
        this.mySubject = this.SelectedDeliveryLists[0]?.DefaultSubject;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  onChangeMailType(e:any, data:any){
    this.newMailType = e.selectedItem.value;
    console.log(this.newMailType);
    this.mailTypeId = data.ID;
    for (let index = 0; index < this.SelectedDeliveryLists.length; index++) {
      const element = this.SelectedDeliveryLists[index];
      if(element.ID == this.mailTypeId){
        element.MailType = this.newMailType;
      }
    }
  }

  SaveOptions() {
    this.sendData = [];
    this.verifyDelivery = [];
    for (let index = 0; index < this.SelectedDeliveryLists.length; index++) {
      const element = this.SelectedDeliveryLists[index];
      console.log(element)

      if (element.RoleId==""){
        this.snackbar.open('Please select Role', '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        return false;
      }
    }
    for (let index = 0; index < this.SelectedDeliveryLists.length; index++) {
      const element = this.SelectedDeliveryLists[index];
      for (let index = 0; index < this.toWhomList.length; index++) {
        const element2 = this.toWhomList[index];
        if (element2.RoleId == element.RoleId){
          var tempRole = element2.Role;
        }
      }
      let mdata = {
        "ID": element.ID ? element.ID : 0,
        "ParentTableName": "LetterStore",
        "MailSetLetterID": this.selectedTemplate.TemplateID,
        "Role": tempRole,
        "RoleId" : element.RoleId,
        "MailType": element.MailType,
        "EMailToType": element.EMailToType,
        "DefaultSubject": this.mySubject || ''
      }
      this.sendData.push(mdata);
    }
    for (let index = 0; index < this.sendData.length; index++) {
      const element = this.sendData[index];
      if(this.verifyDelivery.length==0){
        let data = { uid: element.RoleId + element.EMailToType,name:element.Role }
        this.verifyDelivery.push(data);               
      }
      else{
        let uids = element.RoleId + element.EMailToType;
        for (let index = 0; index < this.verifyDelivery.length; index++) {
          const element2 = this.verifyDelivery[index];
          if(element2.uid == uids){
            this.snackbar.open('Delivery method email type (To/CC/BCC) should not be same at '+element2.name, '', {
              duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
            });
            return false;
          }
        }
        let data = { uid: element.RoleId + element.EMailToType, name: element.Role }
        this.verifyDelivery.push(data);
      }
    }   
    this.spinner.show();
    let url = 'NewLetter/DeliveryOptionsList';
    this.AppService.POST(url, this.sendData).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.Status){
          this.snackbar.open(resp.Message, '', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
        //  this.dialogRef.close(true);
        }      
      });
  }

  onSelectionChangeList(e) {   
    if (e.addedItems[0]){    
      this.singleDeliveryIdSelected = e.addedItems[0].id;
      this.resetVal = this.singleDeliveryIdSelected;
      console.log(this.singleDeliveryIdSelected);  
    }
  }


  getTemplate() {
    let url = 'LetterTemplate?LetterName=';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.templateList = resp.body.ResultList;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getPatientDoctorInformation(){
    let url = 'NewLetter/GetPatientDoctorInfo';
    this.AppService.GET(url).subscribe(
      (resp: any) => {       
        this.infoListDocPatient = resp.body.ResultList;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getDeliveryRoles(){
    let url = 'NewLetter/GetRole';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.toWhomList = resp.body.ResultList;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }




  getDeliverymailtype(){
    let url = 'NewLetter/Options/GetMailType';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.templateList = resp.body.ResultList;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  update() {
    if (!this.data.BoilerName || !this.data.Content) {
      return false;
    }
    let data = {
      BoilerID: 0,
      BoilerName: this.data.BoilerName,
      Content: this.data.Content
    }

  }
  AddSubject(val){
    this.mySubject = this.mySubject+val;
  }
  Add() {   
    // this.SelectedDeliveryLists.push({ RoleId: '', EMailToType: 'To',mytoList:this.toList[0], MailType: 'Email' });    
    // setTimeout(() => {
    //   var container = document.getElementById("List");
    //   console.log(container);      
    //   container.scrollTop = container.scrollHeight;
    // }, 100);
    // this.selectedMailType = [{name: 'Letter', value: 'Letter'}, {name: 'Email', value: 'Email'}];
    let mdata = {
      "ID": '',
      "ParentTableName": "LetterStore",
      "MailSetLetterID": '',
      "Role": '',
      "RoleId" : '',
      "newMailType": this.selectedMailType[0],
      "MailType": this.selectedMailType[0].value,
      "mytoList":this.toList[0],
      "EMailToType": 'To',
      "DefaultSubject": this.mySubject || ''
    }
    this.SelectedDeliveryLists.push(mdata)
  }

  EditOptions(){
    this.editClicked = true;
  }

  

  close() {
    this.dialogRef.close(false);
  }
}