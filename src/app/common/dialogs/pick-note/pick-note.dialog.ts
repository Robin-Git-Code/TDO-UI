import { Component, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxListComponent } from 'devextreme-angular';
import { picNotesData } from '../../../app.constant';


@Component({
  templateUrl: './pick-note.html',
  styleUrls: ['./pick-note.css']
})
export class PickNoteDialogComponent {

  selectedNote = new EventEmitter(); 


  picNotesData : any;
  sendData : any = [];
  NoteListData : any;
  selectedmultipleNote : any;
  test: any;
  noData : any;
  insertDate : boolean = true;

  defaultToothPatient : any = undefined;
  defaultPrivate: any = undefined;
  defaultAdministrative: any = undefined;
  defaultHidden: any = undefined;
  defaultTeeth: any = undefined;

  callNow: boolean = false;
  

  constructor(
    public dialogRef: MatDialogRef<any>, private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService, private AppService: AppService, public dialog: MatDialog) {
    dialogRef.disableClose = true;
    
  }



  ngOnInit() {
    this.picNotesData = picNotesData;
    this.defaultTeeth = this.picNotesData.Teeth[0];
    this.defaultHidden = this.picNotesData.Hidden[0];
    this.defaultAdministrative = this.picNotesData.Administrative[0];
    this.defaultPrivate = this.picNotesData.Private[0];
    this.defaultToothPatient = this.picNotesData.ToothPat[0];
    this.sendData = {
      ToothPatient : 1,
      Private: 1,
      Administrative : 1,
      Hidden:1,
      Teeth : 1,
      IsDesc : 0
    } 
    this.GetNotes();  
  }

  ontoothPChange(val){
    this.defaultToothPatient = val.selectedItem;
    this.sendData.ToothPatient = val.selectedItem.ID; 
    if (this.callNow) {
    this.GetNotes(); 
    }
    setTimeout(() => {
      this.callNow = true;
    }, 1000);  
  }
  onPrivateChange(val) {
    this.defaultPrivate = val.selectedItem;
    this.sendData.Private = val.selectedItem.ID;
    if (this.callNow) {
      this.GetNotes();
    }
    setTimeout(() => {
      this.callNow = true;
    }, 1000);  
  }
  onAdministrativeChange(val) {
    this.defaultAdministrative = val.selectedItem;
    this.sendData.Administrative = val.selectedItem.ID;
    if (this.callNow) {
      this.GetNotes();
    }
    setTimeout(() => {
      this.callNow = true;
    }, 1000);  
  }
  onHiddenChange(val) {
    this.defaultHidden = val.selectedItem;
    this.sendData.Hidden = val.selectedItem.ID;
    if (this.callNow) {
      this.GetNotes();
    }
    setTimeout(() => {
      this.callNow = true;
    }, 1000);  
  }
  onTeethChange(val) {
    this.defaultTeeth = val.selectedItem;
    this.sendData.Teeth = val.selectedItem.ID;
    if (this.callNow) {
      this.GetNotes();
    }
    setTimeout(() => {
      this.callNow = true;
    }, 1000);  
  }

  GetNotes(){
    this.spinner.show();
    this.noData = false;
    let url = "NewLetter/GetNotesList" ;
    this.AppService.POST(url, this.sendData).subscribe((resp: any) => { 
      this.spinner.hide();
      this.NoteListData = resp.Result.NoteList;
      if (this.NoteListData.length==0){
        this.noData = true;
      }
    });
  }

  userclick(val){ 
    if (this.insertDate){
      this.selectedNote.emit(val.Date + ' : ' + val.Note); 
    }  
    else{
      this.selectedNote.emit(val.Note); 
    }
    
  }

  insertNotes(){ 
    this.dialogRef.close(this.selectedmultipleNote);  
  }
    
  

  close() {
    this.dialogRef.close(false);
  }
}