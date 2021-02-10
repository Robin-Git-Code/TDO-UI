import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxListComponent } from 'devextreme-angular';
import { MailSetOptionstmplateDialogComponent } from '../mail-set-template-list/mail-set-template-list';
import { ConfirmDialogComponent } from '../../../common/dialogs/confirm/confirm.dialog';


@Component({
  templateUrl: './mail-set-options-dialog.html',
  styleUrls: ['./mail-set-options-dialog.css']
})
export class MailSetOptionsDialogComponent {
  @ViewChild(DxListComponent, { static: false }) list: DxListComponent;

  labelLocation: string;
  readOnly: boolean;
  showColon: boolean;
  minColWidth: number;
  colCount: number;
  width: any;
  selectedTemplate: any = undefined;

  editClicked: boolean = false;
  selectedMailSets: any = undefined;
  templateList: any;
  deliveryTab: boolean = true;
  subjectTab: boolean = false;
  deliveryOptionsList: any;
  SelectedDeliveryLists: any = [];
  toWhomList: any;
  mySubject: string = '';
  toList: any;
  myId: number = 0;
  resetVal: any;
  singleDeliveryIdSelected: any = '';


  DataHideStatus : boolean = true;
  MailsetList: any;
  mailsetName: string = '';
  customMailList: any = [];
  selectedtemplateList: any = [];
  selectedtmplSets: any = [];
  parameterSend : any;
  verifyDelivery : any = [];

  editButtonOptions: any;
  addButtonOptions : any;
  saveButtonOptions: any;
  resetButtonOptions: any;
  cancelButtonOptions: any;
  selectedMailType : any;

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
    this.toList = [
      { name: 'TO', value: 'To' },
      { name: 'CC', value: 'Cc' },
      { name: 'BCC', value: 'Bcc' }
    ];
    this.selectedMailType = [{name:'email',value:'Email'}];
    this.editButtonOptions = {
      text: 'Edit',
      onClick: () => {
        this.EditOptions();
      }
    };
    this.addButtonOptions = {
      text: 'Add',
      onClick: () => {
        this.AddMailSet();
      }
    };
    this.saveButtonOptions = {
      text: "Save",
      onClick: () => {
        this.SaveMailSetOptions();
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
  }



  ngOnInit() {
    this.getTemplate();
    this.getDeliveryRoles();
    this.GetMailSets();
    this.SelectedDeliveryLists = [{ RoleId: '', EMailToType: 'To', MailType: 'Email' }];
    this.resetVal = this.SelectedDeliveryLists;
  }

  GetMailSets() {
    // setTimeout(() => {
    //   this.spinner.show();
    // }, 50);
    let url = 'NewLetter/GetMailSetList';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.body.Message == 'Success') {
          this.MailsetList = resp.body.Result;
        }
      });
  }

  SaveMailSetOptions() {
    if (this.mailsetName==''){
      this.snackbar.open('Please enter mail set name', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    if (this.selectedtemplateList.length==0){
      this.snackbar.open('Please add template by click on add button', '', {
        duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    for (let index = 0; index < this.selectedtemplateList.length; index++) {
      const element = this.selectedtemplateList[index];
      if (element.Mail_AddressTemplatesList.length==0){
        this.snackbar.open('Please add Delivery Method by click on add button at ' + element.TemplateName, '', {
          duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        return false;
      }
      for (let index = 0; index < element.Mail_AddressTemplatesList.length; index++) {
        const element2 = element.Mail_AddressTemplatesList[index];
        if (element2.RoleId==""){
          this.snackbar.open('Please select Delivery Method Role in ' + element.TemplateName, '', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          return false;
        }
      }
    }
    if (this.selectedMailSets){      
      this.parameterSend = {
        MailSetID: this.selectedMailSets.MailSetID,
        MailSetName: this.mailsetName,
        MailSetLetterList: this.selectedtemplateList
      }
      for (let index = 0; index < this.parameterSend.MailSetLetterList.length; index++) {
        const element = this.parameterSend.MailSetLetterList[index];  
        for (let index = 0; index < element.Mail_AddressTemplatesList.length; index++) {
          const element2 = element.Mail_AddressTemplatesList[index];
          for (let index = 0; index < this.toWhomList.length; index++) {
            const element3 = this.toWhomList[index];
            if (element3.RoleId == element2.RoleId) {
              element2.Role = element3.Role;
            }
          }
        }
      }      
    }
    else {
      this.parameterSend = {
        MailSetID: 0,
        MailSetName: this.mailsetName,
        MailSetLetterList: this.selectedtemplateList
      }
      for (let index = 0; index < this.parameterSend.MailSetLetterList.length; index++) {
        const element = this.parameterSend.MailSetLetterList[index];
        this.parameterSend.MailSetLetterList[index].LetterID = element.LetterID;
        this.parameterSend.MailSetLetterList[index].MailSetID = 0;
        this.parameterSend.MailSetLetterList[index].MailSetLetterID = 0;
        delete this.parameterSend.MailSetLetterList[index].ID;
        delete this.parameterSend.MailSetLetterList[index].TemplateID;
        for (let index = 0; index < element.Mail_AddressTemplatesList.length; index++) {
          const element2 = element.Mail_AddressTemplatesList[index];
          delete element2.id;          
          element2.ID = 0;
          element2.MailSetLetterID = 0;
          element2.Role = '';         
          for (let index = 0; index < this.toWhomList.length; index++) {
            const element3 = this.toWhomList[index];
            if (element3.RoleId == element2.RoleId){
              element2.Role = element3.Role;
            }
          }
        }
      }
    } 
    for (let index = 0; index < this.parameterSend.MailSetLetterList.length; index++) {
      this.verifyDelivery = [];
      const element = this.parameterSend.MailSetLetterList[index];
      for (let index = 0; index < element.Mail_AddressTemplatesList.length; index++) {
        const element2 = element.Mail_AddressTemplatesList[index];
        if (this.verifyDelivery.length == 0) {
          let data = { uid: element2.RoleId + element2.EMailToType, tempname: element.TemplateName, role: element2.Role }
          this.verifyDelivery.push(data);
          
        }
        else{
          let uids = element2.RoleId + element2.EMailToType;
          for (let index = 0; index < this.verifyDelivery.length; index++) {
            const element3 = this.verifyDelivery[index];
            if (element3.uid == uids) {
              let error = 'Delivery method email type (To/CC/BCC) should not be same at ' + element2.Role + ' in ' + element.TemplateName
              this.snackbar.open(error,'',
               {
                duration: 6000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
              });
              return false;
            }
          }
          let data = { uid: element2.RoleId + element2.EMailToType, tempname: element.TemplateName, role: element2.Role }
          this.verifyDelivery.push(data);
        }
      }
    } 
    let url = "NewLetter/SaveMailSet";
    this.AppService.POST(url, this.parameterSend).subscribe((resp:any)=>{
      if (resp.StatusCode) {
        this.snackbar.open(resp.Message, '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        this.dialogRef.close(true);
      }
      else{
        this.snackbar.open(resp.Message, '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
      }
    })
  }

  openAddPopupTempl() {
    const dialogRef = this.dialog.open(MailSetOptionstmplateDialogComponent, {
      width: '350px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {        
        for (let index = 0; index < result.length; index++) {
          this.myId = this.myId + 1;
          const element = result[index];
          element.Mail_AddressTemplatesList = [{ RoleId: '', EMailToType: 'To', MailType: 'Email' }];
          element.ID = this.myId;
          let mdata:any ={};
          mdata.Mail_AddressTemplatesList = element.Mail_AddressTemplatesList;
          mdata.Category = element.Category;
          mdata.LetterID = element.TemplateID;
          mdata.TemplateName = element.TemplateName;
          mdata.MailSetID = 0;
          mdata.MailSetLetterID = 0;
          this.selectedtemplateList.push(mdata);
        }
        console.log(this.selectedtemplateList);

      }
    });
  }

  onSelectiontempltChanged(e) {
    let selectedTemp = e.addedItems[0];
    for(let i=0; i< selectedTemp.Mail_AddressTemplatesList.length; i++){
      selectedTemp.Mail_AddressTemplatesList[i].mytoList = this.toList.find(o => o.value === selectedTemp.Mail_AddressTemplatesList[i].EMailToType)
    }
    // selectedTemp.Mail_AddressTemplatesList[0].mytoList = this.toList[0];
    this.selectedtmplSets = selectedTemp;
  }

  onChange(val) {
    console.log(val);
    console.log(this.selectedtmplSets.Mail_AddressTemplatesList);

  }

  onToChange(val,data){
    console.log(val,data);
    if(val.selectedItem){
      data.EMailToType = val.selectedItem.value;
      data.mytoList = val.selectedItem;
    }
  }

  ontoWhomChange(val,data){
    console.log(val,data);
    if(val.selectedItem){
      data.Role = val.selectedItem.Role;
      data.RoleId = val.selectedItem.RoleId;
      data.myToWhomList = val.selectedItem;
    }
  }

  DeleteMailSets() {
    console.log(this.selectedMailSets);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: 'Do you wish to delete mailset ' + this.selectedMailSets.MailSetName + '?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result==true) {
        this.spinner.show();
        let url = 'NewLetter/DeleteMailSet?MST_ID=' + this.selectedMailSets.MailSetID;
        this.AppService.GET(url).subscribe(
          (resp: any) => {
            console.log(resp);
            this.spinner.hide();
            if (resp.body.StatusCode){
              this.snackbar.open(resp.body.Message, '', {
                duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
              });
              this.dialogRef.close(true);
            }
          });
      }
    });
  }

  AddMailSet(){
    this.DataHideStatus = false;
    this.selectedtemplateList = [];
    this.selectedMailSets = undefined;
    this.mailsetName = '';
    this.selectedtmplSets.Mail_AddressTemplatesList = [];
  }

  getSelectedmailsetDetails(id){
    this.selectedtemplateList = [];
    this.spinner.show();
    let url = 'NewLetter/GetMailSetTemplateList?MST_ID='+id;
    this.AppService.GET(url).subscribe((resp:any)=>{
      let data = resp.body.Result[0]?.MailSetLetterList;
      console.log(data);
      this.spinner.hide();  
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if(element.Mail_AddressTemplatesList.length>0){
          for (let index = 0; index < element.Mail_AddressTemplatesList.length; index++) {
            const elements = element.Mail_AddressTemplatesList[index];
            console.log(elements.EMailToType);
           
            
            if(elements.EMailToType=='To'){             
              elements.mytoList = this.toList[0];
              console.log(elements.mytoList); 
            }
            if(elements.EMailToType=='Cc'){
              elements.mytoList = this.toList[1];
              console.log(elements.mytoList); 
            }
            if(elements.EMailToType=='Bcc'){
              elements.mytoList = this.toList[2];
              console.log(elements.mytoList); 
            }
            for (let index = 0; index < this.toWhomList.length; index++) {
              const element2 = this.toWhomList[index];
              if(element2.RoleId ==elements.RoleId){
                console.log('mila');                
                elements.myToWhomList = element2;
              }
            }       
          }
        }
        this.selectedtemplateList.push(element);
      }
      console.log(this.selectedtemplateList);    
    });
  }

  deletetemplts(){
    console.log(this.selectedtemplateList);
    console.log(this.selectedtmplSets); 
    for (let index = 0; index < this.selectedtemplateList.length; index++) {
      const element = this.selectedtemplateList[index];
      if (element.LetterID == this.selectedtmplSets.LetterID){
        console.log(index);        
        this.selectedtemplateList.splice(index, 0);
      }
    }
  }

  resetAllVal() {
    this.selectedMailSets = undefined;
    this.SelectedDeliveryLists = [{ RoleId: '', EMailToType: 'To', MailType: 'Email', id: this.myId }];
    this.mySubject = '';
    this.editClicked = false;
    this.mailsetName = '';
    this.DataHideStatus = true;
    this.selectedtemplateList = [];
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

  onSelectionChangeList(e) {
    if (e.addedItems[0]) {
      this.singleDeliveryIdSelected = e.addedItems[0].id;
      this.resetVal = this.singleDeliveryIdSelected;
      console.log(this.singleDeliveryIdSelected);
    }
  }

  onSelectionChanged(e) {
    this.selectedMailSets = e.addedItems[0];
    if (this.selectedMailSets) {
      this.mailsetName = this.selectedMailSets.MailSetName;
      this.getSelectedmailsetDetails(this.selectedMailSets.MailSetID);
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

  getDeliveryRoles() {
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




  getDeliverymailtype() {
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
  AddSubject(val) {
    this.mySubject = this.mySubject + val;
  }
  Add() {
    this.myId = this.myId + 1;
    console.log(this.selectedtemplateList);   
    console.log(this.selectedtmplSets); 
    for (let index = 0; index < this.selectedtemplateList.length; index++) {
      const element = this.selectedtemplateList[index];
      if (element.LetterID == this.selectedtmplSets.LetterID) {
        this.selectedtemplateList[index].Mail_AddressTemplatesList.push({ RoleId: '', EMailToType: 'To', mytoList:this.toList[0], MailType: 'Email' });
        // this.selectedtmplSets.Mail_AddressTemplatesList.push({ RoleId: '', EMailToType: 'To', MailType: 'Email', id: this.myId });
      }
    }
    // setTimeout(() => {
    //   var container = document.getElementById("List");
    //   console.log(container);      
    //   container.scrollTop = container.scrollHeight;
    // }, 100);

  }

  EditOptions() {
    console.log('edit');
    this.editClicked = true;
    this.DataHideStatus = false;
    
  }



  SaveOptions() {

  }
  
  close() {
    this.dialogRef.close(false);
  }
}