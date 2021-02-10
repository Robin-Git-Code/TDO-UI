import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './match-dialog.html'
})
export class MatchDialogComponent {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  dropDownData: any;
  SelectedshowMatchLists: any=[];

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog, private spinner: NgxSpinnerService, private AppService: AppService) { 
    dialogRef.disableClose = true;
    }  

  ngOnInit() {   
    this.SelectedshowMatchLists = [{ value: '|Not Null|', text: '' }];
    this.getListing();
  }

  getListing(){
   // this.spinner.show();
    if (!this.data){
      this.data = 0;
    }
    let url = 'LetterToken/OpenMatchPopup?idReport=' + this.data;
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        this.dropDownData = resp.body.ResultList;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  Submit(){
    console.log(this.SelectedshowMatchLists);
    
    let string = '';
    for (let index = 0; index < this.SelectedshowMatchLists.length; index++) {
      const element = this.SelectedshowMatchLists[index];
      if (element.text == '' && element.value==''){

      }
      else{
        string = string + '<<Match:' + element.value + '>>' + element.text;
      }
      
    }
    if (string == ''){
      this.dialogRef.close(); 
    }
    else{
      this.dialogRef.close(string + '<<Match>>');
    }
        
  }

  Remove(i){
    if (this.SelectedshowMatchLists.length==1){
      return false;
    }
    this.SelectedshowMatchLists.splice(i, 1);
  }

  AddEntry(){
    this.SelectedshowMatchLists.push({ 'value': '|Not Null|', 'text': '' });
    setTimeout(() => {
      var container = document.getElementById("matchList");
      console.log(container);      
      container.scrollTop = container.scrollHeight;
    }, 100); 
  }

  close() {
    this.dialogRef.close();
  }
  
} 