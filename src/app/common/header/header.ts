import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { LetterListDialogComponent } from '../../common/dialogs/letter-list/letter-list.dialog';
import { AppService } from "../../app.service";
import { OptionsDialogComponent } from '../../common/dialogs/options/options.dialog';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { NewletterComponent } from '../../components/newletter/newletter.component';
import { ConfirmDialogComponent } from '../../common/dialogs/confirm/confirm.dialog'; 


@Component({
    selector: 'header',
    templateUrl: './header.html'
})
export class HeaderComponent {

    @Output() letterDataShow = new EventEmitter();
    @Output() callSaveLetterApi = new EventEmitter();
    @Output() callSaveTemplateApi = new EventEmitter();
    @Output() openOptionDialog = new EventEmitter();

    constructor(public dialog: MatDialog,public router: Router, private appService: AppService) { }

    ngOnInit() {
        // console.log('called')
       // this.openDialog();
    }

    onTabChanged(evt){       
        let status = evt.index == 0 ? '/' : '/template'; 
        console.log(status);
           
        let value = this.appService.getDocumentValue();
        let fixedLvalue = this.appService.getFixedLValue();
        if(status==this.router.url){
            return false;
        }else if(status == '/'){
            if(value){
                const message = 'Do you want to save currently opened template ?'
                if(!fixedLvalue){
                    this.openConfirmationDialog(status, message, 'template');
                }else{
                    this.router.navigate([status]);
                    this.appService.setDocumentValue(false);
                }
            }else{
                this.router.navigate([status]);
            }
        }else if(status == '/template'){
            if(value){
                const message = 'Do you want to save currently opened letter in the Generated Letters ?'
                this.openConfirmationDialog(status, message, 'letter');
            }else{
                this.router.navigate([status]);
            }
        }
    }
    
    openDialog() {
        const dialogRef = this.dialog.open(LetterListDialogComponent, {
            width: '90%'
        });
        dialogRef.afterClosed().subscribe(result => {
            this.appService.setDocumentValue(true);
            if (result) {
                this.letterDataShow.emit(result); 
            }
        });
    }

    // goto(status){
    //     let value = this.appService.getDocumentValue();
    //     let fixedLvalue = this.appService.getFixedLValue();
    //     if(status==this.router.url){
    //         return false;
    //     }else if(status == '/'){
    //         if(value){
    //             const message = 'Do you want to save currently opened template ?'
    //             if(!fixedLvalue){
    //                 this.openConfirmationDialog(status, message, 'template');
    //             }else{
    //                 this.router.navigate([status]);
    //                 this.appService.setDocumentValue(false);
    //             }
    //         }else{
    //             this.router.navigate([status]);
    //         }
    //     }else if(status == '/template'){
    //         if(value){
    //             const message = 'Do you want to save currently opened letter in the Generated Letters ?'
    //             this.openConfirmationDialog(status, message, 'letter');
    //         }else{
    //             this.router.navigate([status]);
    //         }
    //     }
        
    // }

    openConfirmationDialog(url:string, message:string, type: string){
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: message
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result == true) {     
                if(type == 'letter'){
                    this.callSaveLetterApi.emit();
                    this.appService.setDocumentValue(false);
                }else if(type == 'template'){
                    this.callSaveTemplateApi.emit();
                    this.appService.setDocumentValue(false);
                }
            }else if(result == undefined){
                this.router.navigate([url]);
                this.appService.setDocumentValue(false);
            }else{

            }
        });
    }

    openOptionsDialog() {
        this.openOptionDialog.emit();
    }
}