import { Component, EventEmitter,ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { AppService } from "../../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DxListComponent } from 'devextreme-angular';
import { pictureListData } from '../../../app.constant';
import { NewletterComponent } from '../../../components/newletter/newletter.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: './pick-picture.html',
  styleUrls: ['./pick-picture.css']
})
export class PickpictureDialogComponent {

  selectedPic = new EventEmitter(); 

  imageSizeData : any;
  filterBy : any;
  tags : any;
  filterList : any;
  filterSelected : any;
  savedData : any = {};
  tempSortBy : string = "";
  tempFilterList: string = "";
  imageListDatas : any;
  myheight : string = '64px';
  mywidth: string = '64px';
  imageListDat : any =[];
  selectedImagesList : any = [];
  tempImageSize : any = undefined;

  selectedmultipleFilter : any;
  selectedmultipleSortBy : any = [];
  filterDefault : any = undefined;
  callNow :boolean = false;

  constructor(
    public dialogRef: MatDialogRef<any>, private snackbar: MatSnackBar, private NewletterComponent: NewletterComponent, private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService, private AppService: AppService, public dialog: MatDialog) {
    dialogRef.disableClose = true;
    
  }
// localStorage.setItem(btoa("loggedData"), btoa(JSON.stringify(this.responseData)));
//	this.loggedinData = JSON.parse(atob(localStorage.getItem(btoa("loggedData"))));


  ngOnInit() {  
    this.imageSizeData = pictureListData.imageSize;
    this.filterBy = pictureListData.filterBy; 
    this.tempImageSize = this.imageSizeData[0];
    this.filterDefault = this.filterBy[0]; 
    this.tempSortBy = "";
    this.tempFilterList = "";
    if (localStorage.getItem(btoa("PickPicture"))){
      this.savedData = JSON.parse(atob(localStorage.getItem(btoa("PickPicture"))));      
      this.getItems(this.savedData.FiltersBy);
      for (let index = 0; index < this.savedData.SortByDatas.length; index++) {
        const element = this.savedData.SortByDatas[index];
        for (let index = 0; index < this.filterBy.length; index++) {
          const element2 = this.filterBy[index];
          if (element == element2.ID) {
            this.selectedmultipleSortBy.push(element2);
            this.tempSortBy = this.tempSortBy + element2.ID + ', ';
          }
        }
      }

      for (let index = 0; index < this.imageSizeData.length; index++) {
        const element = this.imageSizeData[index];       
        if (element.ID == this.savedData.ImageSize) {
          this.tempImageSize = this.imageSizeData[index];
          this.myheight = element.val;
          this.mywidth = element.val;
        }
      }

      for (let index = 0; index < this.filterBy.length; index++) {
        const element = this.filterBy[index];
        if (element.ID == this.savedData.FiltersBy) {
          this.filterDefault = this.filterBy[index];         
        }
      }
     
    }
    else{
      this.savedData = {
        ImageSize: 1,
        FiltersBy: 1,
        FiltersListsDatas: [],
        SortByDatas: []
      };
      this.getItems(1);
    } 
  }

  callbackImageInsert(i){
    var height = this.myheight.match(/\d+/g);
    var width = this.mywidth.match(/\d+/g); 
    let sendData = {
      Height: height[0],
      Width: width[0],
      url: this.imageListDat[i].objectURL
    }
    this.selectedPic.emit(sendData);     
  }

  insert(){
    this.dialogRef.close(this.selectedImagesList);
  }    

  onsizeChange(val){
    this.tempImageSize = val.selectedItem;
    this.savedData.ImageSize = val.selectedItem.ID;
    this.myheight = val.selectedItem.val;
    this.mywidth = val.selectedItem.val;
    localStorage.setItem(btoa("PickPicture"), btoa(JSON.stringify(this.savedData)));
    localStorage.setItem("PickPicture", JSON.stringify(this.savedData));
  }

  onfilterChange(val){
    this.filterDefault = val.selectedItem;
    this.savedData.FiltersBy = val.selectedItem.ID;
    if (this.callNow){
      this.savedData.FiltersListsDatas = [];
      localStorage.setItem(btoa("PickPicture"), btoa(JSON.stringify(this.savedData)));
      localStorage.setItem("PickPicture", JSON.stringify(this.savedData));
      this.getItems(val.selectedItem.ID);
    }
    setTimeout(() => {
        this.callNow = true;
    }, 1000);  
  }

  onSelectionSortBy(val){
    this.savedData.SortByDatas = [];
    this.tempSortBy = "";
    for (let index = 0; index < this.selectedmultipleSortBy.length; index++) {
      const element = this.selectedmultipleSortBy[index];
      this.savedData.SortByDatas.push(element.ID);
      this.tempSortBy = this.tempSortBy + element.ID + ', ';
    }    
    localStorage.setItem(btoa("PickPicture"), btoa(JSON.stringify(this.savedData)));
    localStorage.setItem("PickPicture", JSON.stringify(this.savedData));
    this.getImageList();
  }

  valueChange(id,val,i){
    this.savedData.SortByDatas = [];
    this.tempSortBy = "";
    this.filterBy[i].checked = val;
    for (let index = 0; index < this.filterBy.length; index++) {
      const element = this.filterBy[index];
      if (element.checked){
        this.savedData.SortByDatas.push(element.ID);
        this.tempSortBy = this.tempSortBy + element.ID + ', ';
      }
    }
    localStorage.setItem(btoa("PickPicture"), btoa(JSON.stringify(this.savedData)));
    localStorage.setItem("PickPicture", JSON.stringify(this.savedData));
    this.getImageList();
  }

  onSelection(val){
    this.savedData.FiltersListsDatas = [];
    this.tempFilterList = "";
    for (let index = 0; index < this.selectedmultipleFilter.length; index++) {
      const element = this.selectedmultipleFilter[index];
      this.savedData.FiltersListsDatas.push(element.ID);
      this.tempFilterList = this.tempFilterList + element.Item + ', ';
    }
    localStorage.setItem(btoa("PickPicture"), btoa(JSON.stringify(this.savedData)));
    localStorage.setItem("PickPicture", JSON.stringify(this.savedData));
    this.getImageList(); 
  }

  valueChange2(id, val, i) {
    this.savedData.FiltersListsDatas = [];
    this.tempFilterList = "";
    this.filterList[i].checked = val;
    for (let index = 0; index < this.filterList.length; index++) {
      const element = this.filterList[index];
      if (element.checked) {
        this.savedData.FiltersListsDatas.push(element.ID);
        this.tempFilterList = this.tempFilterList + element.Item + ', ';
      }
    }
     
  }  

  getItems(id) {
    this.tempFilterList = "";
    this.selectedmultipleFilter = [];
    let url = 'NewLetter/GetFilterItemList?FilterItemId='+id;
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.filterList = resp.body;       
        if (this.savedData){
          for (let index = 0; index < this.filterList.length; index++) {
            const element = this.filterList[index];          
            for (let index = 0; index < this.savedData.FiltersListsDatas.length; index++) {
              const element2 = this.savedData.FiltersListsDatas[index];           
              if (element2 == element.ID) {
                this.selectedmultipleFilter.push(element);
              }
            }
          }
          for (let index = 0; index < this.savedData.FiltersListsDatas.length; index++) {
            const element = this.savedData.FiltersListsDatas[index];
            for (let index = 0; index < this.filterList.length; index++) {
              const element2 = this.filterList[index];
              if (element == element2.ID) {
                this.tempFilterList = this.tempFilterList + element2.Item + ', ';
              }
            }
          } 
        }
        this.getImageList();
      });
  }

  getImageList(){
    this.spinner.show();
    this.tempSortBy = this.tempSortBy.replace(/,\s*$/, "");
    this.tempFilterList = this.tempFilterList.replace(/,\s*$/, "");
    let url = "NewLetter/GetImageList";
    let data = {
      "Id": 0, "PatientId": 0, "ImageSizeId": this.savedData.ImageSize, "FilterById": this.savedData.FiltersBy, "FilterBy": this.tempFilterList, "SortBy": this.tempSortBy
    }
    this.AppService.POST(url, data).subscribe((resp: any) => {
      this.spinner.hide();
      console.log(resp);
      
      this.imageListDat = resp;
      // if (resp.body){
      //   this.imageListDat = resp.body;
      // }
      // else{
      //   this.imageListDat = resp;
      // }
      for (let index = 0; index < this.imageListDat.length; index++) {
        const element = this.imageListDat[index];
        let objectURL = 'data:image/png;base64,' + element.ImageBytes;
        element.objectURL = objectURL;
        element.image = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      }
      // this.imageListDatas = resp; 
      // for (let index = 0; index < this.imageListDatas.length; index++) {
      //   const element = this.imageListDatas[index];
      //   let data = {
      //     url : element,
      //     ID : index 
      //   }
      //   this.imageListDat.push(data);
      // }          
    });
  }
    
  

  close() {
    this.dialogRef.close(false);
  }
}