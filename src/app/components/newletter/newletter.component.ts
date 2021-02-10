import { Component, ElementRef, OnInit } from '@angular/core';
import { AppService } from "../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from '@angular/material/dialog';
import { create, ReferencesTabCommandId, createOptions, FileTabItemId, Size, RichEdit, Interval, ViewType, DocumentFormat, PrintMode, RichEditUnit, RibbonTabType, RibbonButtonItem } from 'devexpress-richedit';
import { ListingDialogComponent } from '../../common/dialogs/listing/listing.dialog';
import { ParagraphDialogComponent } from '../../common/dialogs/paragraph/paragraph.dialog';
import { OptionsDialogComponent } from '../../common/dialogs/options/options.dialog';
import { MailsetsDialogComponent } from '../../common/dialogs/mailsets/mail-sets.dialog';
import { PickNoteDialogComponent } from '../../common/dialogs/pick-note/pick-note.dialog';
import { EditListDialogComponent } from '../../common/dialogs/edit-list/edit-list.dialog';
import { PickpictureDialogComponent } from '../../common/dialogs/pick-picture/pick-picture.dialog';
import { BatchLetterDialogComponent } from '../../common/dialogs/batch-letter/batch-letter.dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DescriptionLetterDialogComponent } from '../../common/dialogs/description-letter/description-letter.dialog';
import { Router } from "@angular/router";
import { SpellcheckerService } from '../../spellchecker.service';
import { ConfirmDialogComponent } from '../../common/dialogs/confirm/confirm.dialog';
// import printJS from 'print-js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-newletter',
  templateUrl: './newletter.component.html',
  styleUrls: ['./newletter.component.css']
})
export class NewletterComponent implements OnInit {
  private rich: RichEdit;
  DevExpress: any;

  TemplateList: any;
  toothList: any;
  selectedData: any;
  emailList: any;
  myDialogName: string;
  paragraphList: any;
  selectedPara: any;
  emails: any;
  resetVal: any = undefined;
  resetPara: any = undefined;
  printerReset: any = undefined;
  templateselectedS: boolean;
  selectedtmplt: any;
  EmailListShowData: any = [];
  checkbox: any = {};
  sendData: any;
  templat64: any;
  tempCBCTId: number = 0;
  tempUrl: any;
  comesFromLetterList: boolean = false;
  emailfrom: any = 1;
  EditlistData: any = {};
  envelopList: any;
  printerNameList: any;
  tempCategory: any;
  tempLetterId: any = 0;
  tempPatientsQuery: any;
  emailfromDefault: any = undefined;
  toothDefault: any = undefined;
  printTextArea: any;
  emailPrintStatus: string = 'email';
  PersonCategory: string;
  envelopReset: any = undefined;
  envelops: boolean = false;
  products = [];
  editButton: any;
  isTemplateChecked: boolean = true;
  radioType = [];
  closeButton: any;
  address: any = '';
  saveButton: any;
  tempTo: any = [];
  tempCc: any = [];
  tempBcc: any = [];
  isPrinting = false;
  documentAsBase64Global: any;
  TodayDate: Date = new Date();

  constructor(private router: Router, private snackbar: MatSnackBar, private spellcheckerService: SpellcheckerService, private element: ElementRef, private spinner: NgxSpinnerService, public dialog: MatDialog, private AppService: AppService, public datepipe: DatePipe) {
    this.selectedData = {};
    this.emails = {
      to: '',
      cc: '',
      bcc: ''
    };
    this.EmailListShowData.addressItem = [];
    this.EditlistData.ToData = [];
    this.EditlistData.CCData = [];
    this.EditlistData.BCCData = [];
    this.EditlistData.letterData = [];
    this.editButton = {
      icon: "edit",
      type: "default",
      onClick: () => {
        this.OpenListDialog(true, 'email');
      }
    };

    this.saveButton = {
      icon: "save",
      type: "default",
      onClick: () => {
        this.addAddresses(this.address);
      }


    };

  }

  ngOnInit(): void {
    this.radioType = [
      {
        value: 'Template',
        check: true
      },
      {
        value: 'Mail Sets',
        check: false
      }
    ];
    this.getPatientInfo();
    this.getTempDrop();
    this.getEmailList();
    this.getParagraph();
    this.resetVal = undefined;
    this.checkbox = {
      pdf: false,
      dr: false,
      ptnt: false,
      attachOriginal: false
    };
    this.templateselectedS = false;
    this.products = [];

  }

  radioTypeChange(event) {
    if (event.value == 'Mail Sets') {
      this.OpenMailSetsDialog();
    }
  }

  addAddresses(val) {
    if (!this.products.includes(val.trim())) {
      this.products.push(val);
      this.address = '';
    }
  }

  clearInput(val) {
    this.emails[val] = '';
    if (val == 'cc') {
      this.tempCc = '';
      this.EditlistData.CCData = [];
      this.EmailListShowData.addressItem = this.EmailListShowData.addressItem.filter(function (value, index, arr) {
        return value.Email_ToType != 'Cc';
      });
    }
    if (val == 'to') {
      this.tempTo = '';
      this.EditlistData.ToData = [];
      this.EmailListShowData.addressItem = this.EmailListShowData.addressItem.filter(function (value, index, arr) {
        return value.Email_ToType != 'To';
      });
    }
    if (val == 'bcc') {
      this.tempBcc = '';
      this.EditlistData.BCCData = [];
      this.EmailListShowData.addressItem = this.EmailListShowData.addressItem.filter(function (value, index, arr) {
        return value.Email_ToType != 'Bcc';
      });
    }
  }

  saveDeletedItem(item: any) {
    this.AppService.saveDeletedItem(item);
  }

  deleteAddress() {
    this.products = [];
    this.EditlistData.letterData = []
  }

  ngAfterViewInit(): void {

    // the createOptions() method creates an object that contains RichEdit options initialized with default values
    const options = createOptions();

    options.bookmarks.visibility = true;
    options.bookmarks.color = '#ff0000';

    options.spellCheck.enabled = true;
    options.spellCheck.suggestionCount = 5;
    options.spellCheck.checkWordSpelling = (word, callback) => this.spellcheckerService.checkWordSpelling(word, callback);
    options.spellCheck.addWordToDictionary = (word) => this.spellcheckerService.addWordToDictionary(word);


    options.confirmOnLosingChanges.enabled = false;
    options.confirmOnLosingChanges.message = 'Are you sure you want to perform the action? All unsaved document data will be lost.';

    options.fields.updateFieldsBeforePrint = true;
    options.fields.updateFieldsOnPaste = true;

    options.mailMerge.activeRecord = 2;
    options.mailMerge.viewMergedData = true;
    options.mailMerge.dataSource = [
      { Name: 'Indy', age: 32 },
      { Name: 'Andy', age: 28 },
    ];

    // events
    options.events.activeSubDocumentChanged = (e) => {

    };
    options.events.autoCorrect = () => { };
    options.events.calculateDocumentVariable = () => { };
    options.events.characterPropertiesChanged = () => { };
    options.events.contentInserted = (e) => {
      //console.log(e);
    };
    options.events.contentRemoved = () => { };
    options.events.documentChanged = (e) => {
      this.AppService.setDocumentValue(true);
    };
    options.events.documentFormatted = () => { };
    options.events.documentLoaded = (s: any, e) => {

    };
    options.events.gotFocus = () => { };
    options.events.hyperlinkClick = () => { };
    options.events.keyDown = () => { };
    options.events.keyUp = () => { };
    options.events.paragraphPropertiesChanged = () => { };
    options.events.lostFocus = () => { };
    options.events.pointerDown = () => { };
    options.events.pointerUp = () => { };
    options.events.saving = (s, e) => {
      this.templat64 = e.base64;
    };
    options.events.saved = (s, e) => {
    };
    options.events.selectionChanged = () => { };
    options.events.customCommandExecuted = (s, e) => {
      switch (e.commandName) {
        case 'insertEmailSignature':
          s.document.insertParagraph(s.document.length);
          s.document.insertText(s.document.length, '_________');
          s.document.insertParagraph(s.document.length);
          s.document.insertText(s.document.length, 'Best regards,');
          s.document.insertParagraph(s.document.length);
          s.document.insertText(s.document.length, 'John Smith');
          s.document.insertParagraph(s.document.length);
          s.document.insertText(s.document.length, 'john@example.com');
          s.document.insertParagraph(s.document.length);
          s.document.insertText(s.document.length, '+1 (818) 844-0000');
          break;


        case 'downloads':
          this.downloadAlert();
          break;
      }
    };

    options.unit = RichEditUnit.Inch;

    options.view.viewType = ViewType.PrintLayout;
    options.view.simpleViewSettings.paddings = {
      left: 15,
      top: 15,
      right: 15,
      bottom: 15,
    };

    options.autoCorrect = {
      correctTwoInitialCapitals: true,
      detectUrls: true,
      enableAutomaticNumbering: true,
      replaceTextAsYouType: true,
      caseSensitiveReplacement: false,
      replaceInfoCollection: [
        { replace: "wnwd", with: "well-nourished, well-developed" },
        { replace: "(c)", with: "©" }
      ],
    };
    // capitalize the first letter at the beginning of a new sentence/line
    options.events.autoCorrect = function (s, e) {
      if (e.text.length == 1 && /\w/.test(e.text)) {
        var prevText = s.document.getText(new Interval(e.interval.start - 2, 2));
        if (prevText.length == 0 || /^(\. |\? |\! )$/.test(prevText) || prevText.charCodeAt(1) == 13) {
          var newText = e.text.toUpperCase();
          if (newText != e.text) {
            s.beginUpdate();
            s.history.beginTransaction();
            s.document.deleteText(e.interval);
            s.document.insertText(e.interval.start, newText);
            s.history.endTransaction();
            s.endUpdate();
            e.handled = true;
          }
        }
      }
    };

    // options.exportUrl = 'https://siteurl.com/api/';
    options.readOnly = false;
    options.width = '72%';
    options.height = '100%';
    options.ribbon.removeTab(RibbonTabType.MailMerge);

    // Remove Download Ribbon
    
    var FileTab = options.ribbon.getTab(RibbonTabType.File);
    var removedownload = FileTab.getItem(FileTabItemId.Download);
    FileTab.removeItem(removedownload);

    // Add Download

    var ribbonButton = new RibbonButtonItem("downloads", "TDO Save",
      { icon: "download", showText: true, beginGroup: true });
    options.ribbon.getTab(RibbonTabType.File).insertItem(ribbonButton, 2);

    this.rich = create(this.element.nativeElement.firstElementChild, options);
    this.rich.hasUnsavedChanges = true;

    //END
  }

  
  downloadAlert() {
    let displayDate =this.datepipe.transform(this.TodayDate, 'yyyy-MM-dd');
    let fileName = '';
    let tempPatientName = '';
    let tempTemplateName = '';
    
    if(this.selectedData){
      tempPatientName = this.selectedData.patient + ' - ';
      fileName = fileName + tempPatientName;
    }
    if(this.selectedtmplt){
      tempTemplateName = this.selectedtmplt.TemplateName + ' - ';
      fileName = fileName + tempTemplateName;
    }
    fileName = fileName + displayDate;
    fileName = fileName.replace(/[.*+?^${}()|[\]\\]/g, '');
    let data = {
      'showMessage': "Please name the documents to save",
      'desc': fileName
    }
    const dialogRef = this.dialog.open(DescriptionLetterDialogComponent, {
      width: '650px',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(this.checkDocumentName(result)){
          this.rich.downloadDocument(DocumentFormat.OpenXml, result);
        } else {
          this.snackbar.open('Invalid file name! Please avoid special characters- *&^$/\.: etc', '', {
            duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          setTimeout(() => {
            this.checkbox.dr = false;
          }, 100);
          return false;
        }
      }
    });
  }

  checkDocumentName(name){
    var format = /^[a-zA-Z0-9-_+ ]*$/;
    if( format.test(name) ){
      return true;
    }else{
      return false;
    }
  }

  handleValueChangeDoctorOnly(val) {
    let myChek = false;
    if (val.value) {
      if (this.EditlistData.ToData.length == 0 && this.EditlistData.CCData.length == 0 && this.EditlistData.BCCData.length == 0) {
        this.snackbar.open('Please select email recipients!', '', {
          duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        setTimeout(() => {
          this.checkbox.dr = false;
        }, 100);
        return false;
      }
      for (let index = 0; index < this.EditlistData.ToData.length; index++) {
        const element = this.EditlistData.ToData[index];
        if (element.Role == 'Patient' || element.Role == 'Other') {
          myChek = true;
        }
      }
      for (let index = 0; index < this.EditlistData.CCData.length; index++) {
        const element = this.EditlistData.CCData[index];
        if (element.Role == 'Patient' || element.Role == 'Other') {
          myChek = true;
        }
      }
      for (let index = 0; index < this.EditlistData.BCCData.length; index++) {
        const element = this.EditlistData.BCCData[index];
        if (element.Role == 'Patient' || element.Role == 'Other') {
          myChek = true;
        }
      }
      if (myChek) {
        this.snackbar.open('Invalid email recipients! \n\n You can only use this feature on valid email recipients. \n\n Valid recipients are Doctors (General Doctors or Referring Doctors) registered in the system.', '', {
          duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        setTimeout(() => {
          this.checkbox.dr = false;
        }, 100);
      }
      else {
        this.checkbox.pdf = false;
        this.checkbox.attachOriginal = false;
      }
    }
  }
  handleValueChangePatientOnly(val) {
    let myChek = false;
    if (val.value) {
      if (this.EditlistData.ToData.length == 0 && this.EditlistData.CCData.length == 0 && this.EditlistData.BCCData.length == 0) {
        this.snackbar.open('Please select email recipients!', '', {
          duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        setTimeout(() => {
          this.checkbox.ptnt = false;
        }, 100);
        return false;
      }
      for (let index = 0; index < this.EditlistData.ToData.length; index++) {
        const element = this.EditlistData.ToData[index];
        if (element.Role == 'Doctor' || element.Role == 'Other' || element.Role == 'Additional Doctor' || element.Role == 'Referring') {
          myChek = true;
        }
      }
      for (let index = 0; index < this.EditlistData.CCData.length; index++) {
        const element = this.EditlistData.CCData[index];
        if (element.Role == 'Doctor' || element.Role == 'Referring' || element.Role == 'Additional Doctor' || element.Role == 'Other') {
          myChek = true;
        }
      }
      for (let index = 0; index < this.EditlistData.BCCData.length; index++) {
        const element = this.EditlistData.BCCData[index];
        if (element.Role == 'Doctor' || element.Role == 'Referring' || element.Role == 'Additional Doctor' || element.Role == 'Other') {
          myChek = true;
        }
      }
      if (myChek) {
        this.snackbar.open('Invalid email recipients! \n\n You can only use this feature on valid email recipients. \n\n Valid recipients are Patient Only registered in the system.', '', {
          duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        setTimeout(() => {
          this.checkbox.ptnt = false;
        }, 100);
      }
      else {
        this.checkbox.pdf = false;
        this.checkbox.attachOriginal = false;
      }
    }
  }
  handleValueChangePdfOnly(val) {
    if (val.value) {
      if (this.EditlistData.ToData.length == 0 && this.EditlistData.CCData.length == 0 && this.EditlistData.BCCData.length == 0) {
        this.snackbar.open('Please select email recipients!', '', {
          duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        setTimeout(() => {
          this.checkbox.pdf = false;
        }, 100);
        return false;
      }
      this.checkbox.ptnt = false;
      this.checkbox.dr = false;
    }
  }
  handleValueChangeOriginalOnly(val) {
    if (val.value) {
      if (this.EditlistData.ToData.length == 0 && this.EditlistData.CCData.length == 0 && this.EditlistData.BCCData.length == 0) {
        this.snackbar.open('Please select email recipients!', '', {
          duration: 5000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        setTimeout(() => {
          this.checkbox.attachOriginal = false;
        }, 100);
        return false;
      }
      this.checkbox.ptnt = false;
      this.checkbox.dr = false;
    }
  }



  getPatientInfo() {
    this.spinner.show();
    let url = 'NewLetter';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        this.selectedData.patient = resp.body.Result.PatientName;
        this.selectedData.toothId = resp.body.Result.IdExam;
        this.envelopList = resp.body.Result.EnvelopList;
        this.envelopReset = this.envelopList[0];
        this.PersonCategory = resp.body.Result.PersonCategory;
        this.printerNameList = resp.body.Result.PrinterNameList;
        this.printerReset = this.printerNameList[0];
        //   console.log(this.envelopList);     
        //  console.log(this.printerNameList);   
        localStorage.setItem("PatientName", this.selectedData.patient);

        this.getToothList();
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getParagraph() {
    this.spinner.show();
    let url = 'NewLetter/Paragraph';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        this.paragraphList = resp.body.ResultList;
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getToothList() {
    this.spinner.show();
    let url = 'NewLetter/GetToothList';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        this.toothList = resp.body.ResultList;
        this.toothDefault = this.toothList[0];
        for (let index = 0; index < this.toothList.length; index++) {
          const element = this.toothList[index];
          if (this.selectedData.toothId == element.ID) {
            this.selectedData.date = element.D1;
            this.selectedData.Tooth = element.Tooth;
            this.toothDefault = this.toothList[index];
          }
        }
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getEmailList() {
    this.spinner.show();
    let url = 'NewLetter/GetEmailFrom';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.emailList = resp.body.Result;
        this.emailfromDefault = this.emailList[0];
        //  console.log(this.emailfrom);

      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getTempDrop() {
    this.spinner.show();
    let url = 'LetterTemplate?LetterName=&NewLetter=true';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.body) {
          this.TemplateList = resp.body.ResultList;
        }
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  getparaInfo(boilerId) {
    this.spinner.show();
    let url = 'NewLetter/Paragraph?BoilerId=' + boilerId;
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.body) {
          var subDocument = this.rich.selection.activeSubDocument;
          var position = this.rich.selection.active;
          subDocument.insertText(position, resp.body.Result.Content);
        }
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  openParaDialog() {
    const dialogRef = this.dialog.open(ParagraphDialogComponent, {
      width: '700px',
      data: this.selectedPara
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getParagraph();
        this.selectedPara = '';
      }
    });
  }

  openOptionsDialog() {

    const dialogRef = this.dialog.open(OptionsDialogComponent, {
      width: '900px',
      data: this.selectedPara
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getParagraph();
        this.selectedPara = '';
      }
    });
  }

  OpenBatchDialog() {
    if (!this.templateselectedS) {
      this.snackbar.open('You must select a letter to send a batch letter form.', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    const dialogRef = this.dialog.open(BatchLetterDialogComponent, {
      width: '920px',
      data: {
        tmplId: this.selectedtmplt.TemplateID,
        subject: this.selectedtmplt.Subject,
        description: this.selectedtmplt.TemplateName
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        setTimeout(() => {
          location.reload();
        }, 2500);
      }
    });
  }

  OpenMailSetsDialog() {
    const dialogRef = this.dialog.open(MailsetsDialogComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.radioType = [
        {
          value: 'Template',
          check: true
        },
        {
          value: 'Mail Sets',
          check: false
        }
      ];
    });
  }

  OpenListDialog(flag: boolean, type: String) {
    this.inputMailAdd();
    let myData = {
      status: this.emailPrintStatus,
      data: this.EditlistData,
      type: type,
      PersonCategory: this.PersonCategory,
      editList: flag
    }
    const dialogRef = this.dialog.open(EditListDialogComponent, {
      width: '1100px',
      data: myData,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // console.log(result);        
        this.checkbox = {
          pdf: false,
          dr: false,
          ptnt: false,
          attachOriginal: false
        };
        this.EditlistData = result;
        if (flag) {
          this.processMailType();
        } else {
          this.printTextArea = this.EditlistData ?.ToData[0] ?.FirstName + ' ' + this.EditlistData ?.ToData[0] ?.LastName + ' ' + '<' + this.EditlistData ?.ToData[0] ?.Address + '>' + ' ' + '(' + this.EditlistData ?.ToData[0] ?.Role + ')' + ', ';
          this.products.push(this.printTextArea);
        }
      }
    });
  }

  PickPictureDialog() {
    const dialogRef = this.dialog.open(PickpictureDialogComponent, {
      width: '700px'
    });
    const sub = dialogRef.componentInstance.selectedPic.subscribe((result) => {
      this.insertSelectedImage(result.url, result.Height, result.Width)
    });
  }

  OpenNotesDialog() {
    const dialogRef = this.dialog.open(PickNoteDialogComponent, {
      width: '900px'
    });
    const sub = dialogRef.componentInstance.selectedNote.subscribe((result) => {
      this.insertNotes(result)
    });

  }

  /////////////////////////////////
  onSelectionFromMail(val) {
    this.emailfromDefault = val.selectedItem;
    this.emailfrom = val.selectedItem.Id;
    //  console.log(this.emailfrom);    
  }

  onSelectionenvelopChanged(val) {
    //   console.log(val);  
    //console.log(val);    
    this.envelopReset = val.selectedItem;
  }

  onSelectionPrinterChanged(val) {
    console.log(val);
    this.printerReset = val.selectedItem;
  }

  insertNotes(note) {
    var subDocument = this.rich.selection.activeSubDocument;
    var position = this.rich.selection.active;

    this.rich.beginUpdate();
    this.rich.history.beginTransaction();
    var tmpTextInterval = subDocument.insertText(position, note);
    position = tmpTextInterval.end;

    this.rich.endUpdate();
    this.rich.history.endTransaction();

    this.rich.selection.setSelection(tmpTextInterval);
    this.rich.focus();
  }

  onParaChange(id) {
    console.log(this.paragraphList);

    for (let index = 0; index < this.paragraphList.length; index++) {
      const element = this.paragraphList[index];
      console.log(element);

      if (id == element.BoilerID) {
        this.selectedPara = element;
        console.log(this.selectedPara);
      }
    }
  }

  onParaChanged(val) {
    this.resetPara = val.selectedItem;
    this.getparaInfo(val.selectedItem.BoilerID);
    setTimeout(() => {
      this.resetPara = undefined;
    }, 500);
  }

  TestTokenAgain(id, data, tokenCat) {
    this.spinner.show();
    if (this.myDialogName == 'CBCT') {
      data.lCBCTID = id;
      this.tempCBCTId = id;
    }
    if (this.myDialogName == 'Notes') {
      data.lNoteID = id;
    }
    if (this.myDialogName == 'Prescription') {
      data.lPrescriptionID = id;
    }
    if (this.myDialogName == 'SecondaryInsurance') {
      data.lSecPatInsID = id;
    }
    if (this.myDialogName == 'DebitCredit') {
      data.lPatientStatement_Date = id.start;
      data.lPatientStatement_DateEnd = id.end;
    }
    if (this.myDialogName == 'MultiToothSummaryNote') {
      data.lMultiToothSummaryNoteID = id;
    }
    data.OpenDialogBox = tokenCat;
    let url = 'LetterTemplate/ReplaceTokensNew';
    this.AppService.POST(url, data).subscribe(
      (resp: any) => {
        console.log(resp, "cwecwfwrfwrf")
        this.spinner.hide();
        this.myDialogName = resp.Result.OpenDialogBox;
        if (resp.Result.OpenDialogBox) {
          const dialogRef = this.dialog.open(ListingDialogComponent, {
            width: '500px',
            data: resp.Result.OpenDialogBox
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.TestTokenAgain(result, resp.Result, '');
              return false;
            }
            else {
              this.resetVal = undefined;
              this.templateselectedS = false;
              return false;
              // this.TestTokenAgain('0', resp.Result, resp.Result.OpenDialogBox);
              // return false;
            }
          });
          return false;
        }
        var documentAsBase64 = resp.Result.ContentB;
        this.documentAsBase64Global = resp.Result.ContentB;
        this.rich.openDocument(documentAsBase64, 'myDoc.docx', DocumentFormat.OpenXml);
        this.rich.hasUnsavedChanges = true;
        this.selectedData.subject = resp.Result.Subject;
        this.selectedtmplt = resp.Result;
        this.templateselectedS = true;
        this.AppService.setDocumentValue(this.templateselectedS);
        this.getemailtoccbcc(this.selectedData.toothId, resp.Result.TemplateID)
      });
  }

  onSelectionChanged(val) {
    if (val.selectedItem) {
      this.resetVal = val.selectedItem;
      //  console.log(this.resetVal);
      if (this.comesFromLetterList) {
        this.comesFromLetterList = false;
        return false;
      }
      this.onChange(val.selectedItem.TemplateID);
    }

  }

  insertSelectedImage(imgUrl, heights, widths) {
    var subDocument = this.rich.selection.activeSubDocument;
    var position = this.rich.selection.active;
    var width = this.rich.unitConverter.pixelsToTwips(widths);
    var height = this.rich.unitConverter.pixelsToTwips(heights);
    var size = new Size(width, height);
    let tt = position.toString();
    subDocument.insertPicture(position, imgUrl, size, this.OnImageInsertedCallback);
  }
  OnImageInsertedCallback = e => {
    let subDocument = this.rich.selection.activeSubDocument;
    let images = subDocument.images.find(e.start);
    if (images == null || images.length <= 0) return;
    let image = images[0];
    let imageOriginalSize = image.originalSize;
    let newSize = image.actualSize;
    console.log(imageOriginalSize);
    if (imageOriginalSize.width > imageOriginalSize.height) {
      newSize.height = imageOriginalSize.height * (image.actualSize.width / imageOriginalSize.width)
    }
    else {
      newSize.width = imageOriginalSize.width * (image.actualSize.height / imageOriginalSize.height)
    }
    image.actualSize = newSize;
  }

  bindTemp(TemplateId) {
    console.log(TemplateId);
    
    for (let index = 0; index < this.TemplateList.length; index++) {
      const element = this.TemplateList[index];
      console.log(element.TemplateId);
      
      if (element.TemplateID == TemplateId) {
        this.comesFromLetterList = true;
        this.resetVal = element;
      }
    }
  }

  showOpenLetter(data) {

    this.spinner.show();
    let url = 'NewLetter/OpenLetter ';
    this.AppService.POST(url, data).subscribe(
      (resp: any) => {
        console.log(resp.saveLetter);
        
        this.selectedtmplt = {};
        this.selectedtmplt = resp.saveLetter;
        this.selectedtmplt.TemplateName = this.selectedtmplt.Description;
        this.spinner.hide();
        this.snackbar.open(resp.Message, '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        this.resetVal = {};
        this.printerReset = {};
        this.tempCategory = resp.saveLetter.Category;
        this.bindTemp(resp.saveLetter.TemplateId);
        this.resetVal.TemplateName = resp.saveLetter.Description;
        this.resetVal.TemplateId = resp.saveLetter.TemplateId;
        this.selectedData.toothId = resp.saveLetter.ExamId;
        this.EmailListShowData = resp.saveLetter.LetterAddressList;
        this.processLetterCall();
        this.tempLetterId = resp.saveLetter.LetterId;
        this.tempPatientsQuery = resp.saveLetter.PatientsQuery;
        this.printerReset.name = resp.saveLetter.PrinterDeviceName;

        this.selectedData.subject = resp.saveLetter.Subject;
        this.tempCBCTId = resp.saveLetter.g_lCBCTID;
        // console.log(resp.saveLetter.BSendLinkDr);

        this.checkbox = {
          pdf: resp.saveLetter.BSendPDF,
          dr: resp.saveLetter.BSendLinkDr,
          ptnt: resp.saveLetter.BSendLinkPatient,
          attachOriginal: resp.saveLetter.AttachOriginalImages
        };
        if (resp.saveLetter.Content) {
          var documentAsBase64 = resp.saveLetter.Content;
          this.rich.openDocument(documentAsBase64, 'myDoc.docx', DocumentFormat.OpenXml);
          this.rich.hasUnsavedChanges = true;
        }
        // this.selectedData.subject = resp.Result.Subject;
        // this.templateselectedS = true;
        // this.selectedtmplt = resp.Result;
        // this.getemailtoccbcc(this.selectedData.toothId, id);       
      });
  }

  onChange(id) {
    this.spinner.show();
    let url = 'LetterTemplate/ReplaceTokensNew';
    let data = {
      'TemplateId': id,
      'IsChangeTooth': true,
      'ChangeExamId': this.selectedData.toothId
    };
    this.AppService.POST(url, data).subscribe(
      (resp: any) => {
        this.spinner.hide();
        this.myDialogName = resp.Result.OpenDialogBox;
        if (resp.Result.OpenDialogBox) {
          const dialogRef = this.dialog.open(ListingDialogComponent, {
            width: '650px',
            data: resp.Result.OpenDialogBox
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.TestTokenAgain(result, resp.Result, '');
              return false;
            }
            else {
              this.resetVal = undefined;
              this.templateselectedS = false;
              return false;
            }
          });
          return false;
        }
        var documentAsBase64 = resp.Result.ContentB;
        this.documentAsBase64Global = resp.Result.ContentB;
        this.rich.openDocument(documentAsBase64, 'myDoc.docx', DocumentFormat.OpenXml);
        this.rich.hasUnsavedChanges = true;
        this.selectedData.subject = resp.Result.Subject;
        this.templateselectedS = true;
        this.AppService.setDocumentValue(this.templateselectedS);
        this.selectedtmplt = resp.Result;
        this.getemailtoccbcc(this.selectedData.toothId, id);
      },
      err => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  onToothChange(val) {
    this.toothDefault = val.selectedItem;
    for (let index = 0; index < this.toothList.length; index++) {
      const element = this.toothList[index];
      if (val.selectedItem.ID == element.ID) {
        this.selectedData.date = element.D1;
        this.selectedData.toothId = val.selectedItem.ID;
        if (this.resetVal ?.TemplateID) {
          this.onChange(this.resetVal.TemplateID);
        }
      }
    }
  }



  // printNewLetter() {
    
  //   let finalTempArray = this.EmailListShowData.addressItem;
  //   let myaddress = {
  //     'Subject': this.EmailListShowData.Subject,
  //     'addressItem': finalTempArray
  //   }
    
  //   console.log(this.selectedtmplt);
  //   if (!this.selectedtmplt) {
  //     const dialogRef = this.dialog.open(DescriptionLetterDialogComponent, {
  //       width: '650px'
  //     });
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result) {
  //         if (!this.printerReset) {
  //           this.printerReset = {};
  //           this.printerReset.name = 'Microsoft XPS Document Writer';
  //         }
  //         this.sendData = {
  //           "LetterId": this.tempLetterId,
  //           "TemplateId": 0,
  //           "ExamId": this.selectedData.toothId, //Select Tooth id
  //           "Content": this.templat64, //Template Byte
  //           "BSendPDF": this.checkbox.pdf, //checkbox 
  //           "BSendLinkDr": this.checkbox.dr, //checkbox 
  //           "BSendLinkPatient": this.checkbox.ptnt, //checkbox 
  //           "Description": result,
  //           "Tooth": this.selectedData.Tooth, //Tooth Selected
  //           "LetterAddressList": myaddress,
  //           "PrinterDevicename": this.printerReset.name
  //         }
  //         if (this.envelops) {
  //           this.sendData.EnvelopId = this.envelopReset.LetterID;
  //         }
  //         this.sendData.BSendPDF = this.checkbox.pdf;
  //         this.sendData.BSendLinkDr = this.checkbox.dr;
  //         this.sendData.BSendLinkPatient = this.checkbox.ptnt;
  //         this.sendData.LetterAddressList.Subject = this.selectedData.subject;
  //         this.tempUrl = 'NewLetter/PrintLetter';
  //         this.sendData.attachOriginalImages = this.checkbox.attachOriginal;
  //         this.sendData.g_lCBCTID = this.tempCBCTId;
  //         // this.rich.saveDocument();
  //         this.spinner.show();
  //         setTimeout(() => {
  //           this.sendData.Content = this.documentAsBase64Global;
  //           if (!this.sendData.LetterAddressList.Subject) {
  //             this.sendData.LetterAddressList.Subject = "";
  //           }
  //           this.AppService.POST(this.tempUrl, this.sendData).subscribe(
  //             (resp: any) => {
  //               this.spinner.hide();
  //               if (resp.StatusCode) {
  //                 this.snackbar.open(resp.Message, '', {
  //                   duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
  //                 });
  //                 return false;
  //               }
  //             });
  //         }, 1500);
  //       }
  //       else {
  //         return false;
  //       }
  //     });
  //   }
  //   else {
  //     if (!this.printerReset) {
  //       this.printerReset = {};
  //       this.printerReset.name = 'Microsoft XPS Document Writer';
  //     }
  //     this.sendData = {
  //       "LetterId": this.tempLetterId,
  //       "TemplateId": this.selectedtmplt.TemplateID,
  //       "ExamId": this.selectedData.toothId, //Select Tooth id
  //       "Content": this.templat64, //Template Byte
  //       "BSendPDF": this.checkbox.pdf, //checkbox 
  //       "BSendLinkDr": this.checkbox.dr, //checkbox 
  //       "BSendLinkPatient": this.checkbox.ptnt, //checkbox 
  //       "Description": this.selectedtmplt.TemplateName, //Template Name
  //       "Tooth": this.selectedData.Tooth, //Tooth Selected
  //       "LetterAddressList": myaddress,
  //       "PrinterDevicename": this.printerReset.name
  //     }
  //     if (this.envelops) {
  //       this.sendData.EnvelopId = this.envelopReset.LetterID;
  //     }
  //     this.sendData.BSendPDF = this.checkbox.pdf;
  //     this.sendData.BSendLinkDr = this.checkbox.dr;
  //     this.sendData.BSendLinkPatient = this.checkbox.ptnt;
  //     this.tempUrl = 'NewLetter/PrintLetter';
  //     this.sendData.attachOriginalImages = this.checkbox.attachOriginal;
  //     this.sendData.g_lCBCTID = this.tempCBCTId;
  //     this.sendData.Content = this.documentAsBase64Global;
  //     // this.rich.saveDocument();
  //     this.spinner.show();
  //     setTimeout(() => {
  //       this.sendData.Content = this.documentAsBase64Global;
  //       this.sendData.LetterAddressList.Subject = this.selectedData.subject;
  //       if (!this.sendData.LetterAddressList.Subject) {
  //         this.sendData.LetterAddressList.Subject = "";
  //       }
  //       this.AppService.POST(this.tempUrl, this.sendData).subscribe(
  //         (resp: any) => {
  //           this.spinner.hide();
  //           if (resp.StatusCode) {
  //             this.snackbar.open(resp.Message, '', {
  //               duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
  //             });

  //             if (resp.Result && resp.Result.length != 0){

  //               // this.rich.printDocument(this.DevExpress.RichEdit.PrintMode.Pdf);
                
  //               // var blob = new Blob([resp.Result], { type: "application/pdf" });
  //               // var link = document.createElement('a');
  //               // link.href = window.URL.createObjectURL(blob);
  //               // link.download = "testing.pdf";
  //               // link.click();

  //               // let fileUrl = window.URL.createObjectURL(resp.Result[0]);
  //               // let  myWindow =  window.open(fileUrl);
  //               // // myWindow = window.open(objectUrl)
  //               // myWindow.print()

  //               // var binaryData = [];
  //               // binaryData.push(this.documentAsBase64Global);
  //               // binaryData.push(resp.Result[0]);
  //               // let fileUrl = window.URL.createObjectURL(new Blob(binaryData, {type: "application/pdf"}))   
  //               // window.open(fileUrl).print();
  //               // myWindow = window.open(objectUrl)
  //               // window.print()   
                
  //               // const blob = new Blob([resp.Result[0].ContentB], { type: 'application/pdf' });
  //               // const url= window.URL.createObjectURL(blob);
  //               // printJS({printable:url, type:'pdf', showModal:true});
  //               // var documentAsBase64 = resp.Result[1].ContentB;

  //               printJS({
  //                 printable: resp.Result[0].ContentB, 
  //                 type: 'pdf', 
  //                 showModal:true, 
  //                 base64: true,
  //                 onError: function  (error) {
  //                   alert('Error found => ' + error.message)
  //                 }
  //               })
                
  //             }
  //             console.log(resp);
  //             return false;
  //           }
  //         });
  //     }, 1500);
  //   }

  // }

  saveNewLetter(status) {
    this.inputMailAdd();
    let tempSendArray = [];
    if (this.tempTo.length > 0) {
      for (let index = 0; index < this.tempTo.length; index++) {
        const element = this.tempTo[index];
        tempSendArray.push(element);
      }
    }
    if (this.tempBcc.length > 0) {
      for (let index = 0; index < this.tempBcc.length; index++) {
        const element = this.tempBcc[index];
        tempSendArray.push(element);
      }
    }
    if (this.tempCc.length > 0) {
      for (let index = 0; index < this.tempCc.length; index++) {
        const element = this.tempCc[index];
        tempSendArray.push(element);
      }
    }
    let finalTempArray = this.EmailListShowData.addressItem.concat(tempSendArray);
    let myaddress = {
      'Subject': this.EmailListShowData.Subject,
      'addressItem': finalTempArray
    }
    // if (this.emails.to == "" && this.emails.cc == "" && this.emails.bcc ==""){
    //   this.snackbar.open('Email list To/Cc/Bcc can not be empty', '', {
    //     duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
    //   });
    //   return false;
    // }
    if (this.emails.to == "" || !this.emails.to) {
      this.snackbar.open('Email list To can not be empty', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    if (!this.emailfrom || this.emailfrom == "") {
      this.snackbar.open('Please select Email From', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    if (this.selectedData.subject == '' || !this.selectedData.subject) {
      this.snackbar.open('Subject can not be empty', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    console.log(this.selectedtmplt);
    if (!this.selectedtmplt) {      
      let data = {
        'showMessage': "You did not select a template!Please enter a name / description to this freestyle letter!"
      }
      const dialogRef = this.dialog.open(DescriptionLetterDialogComponent, {
        width: '650px',
        data:data
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (!this.printerReset) {
            this.printerReset = {};
            this.printerReset.name = 'Microsoft XPS Document Writer';
          }
          this.sendData = {
            "LetterId": this.tempLetterId,
            "TemplateId": 0,
            "ExamId": this.selectedData.toothId, //Select Tooth id
            "Content": this.templat64, //Template Byte
            "BSendPDF": this.checkbox.pdf, //checkbox 
            "BSendLinkDr": this.checkbox.dr, //checkbox 
            "BSendLinkPatient": this.checkbox.ptnt, //checkbox 
            "Description": result,
            "Tooth": this.selectedData.Tooth, //Tooth Selected
            "LetterAddressList": myaddress,
            "PrinterDevicename": this.printerReset.name
          }
          if (this.envelops) {
            this.sendData.EnvelopId = this.envelopReset.LetterID;
          }
          this.sendData.BSendPDF = this.checkbox.pdf;
          this.sendData.BSendLinkDr = this.checkbox.dr;
          this.sendData.BSendLinkPatient = this.checkbox.ptnt;
          this.sendData.LetterAddressList.Subject = this.selectedData.subject;
          this.tempUrl = 'NewLetter/Save';
          if (status) {
            this.tempUrl = 'NewLetter/SaveAndSendNow';
            this.sendData.attachOriginalImages = this.checkbox.attachOriginal;
            this.sendData.g_lCBCTID = this.tempCBCTId;
          }
          this.rich.saveDocument();
          this.spinner.show();
          setTimeout(() => {
            this.sendData.Content = this.templat64;
            if (!this.sendData.LetterAddressList.Subject) {
              this.sendData.LetterAddressList.Subject = "";
            }
            this.AppService.POST(this.tempUrl, this.sendData).subscribe(
              (resp: any) => {
                this.spinner.hide();
                if (resp.StatusCode) {
                  this.snackbar.open(resp.Message, '', {
                    duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
                  });
                  if (resp.NeedReportSend && this.tempUrl == 'NewLetter/SaveAndSendNow') {
                    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                      width: '500px',
                      data: resp.ReportMessage
                    });
                    dialogRef.afterClosed().subscribe(result => {
                      if (result) {
                        let sendData = { "TemplateId": 0, "ExamId": this.selectedData.toothId, "NeedReportSent": true };
                        this.AppService.POST('NewLetter/ReportSent', sendData).subscribe(
                          (resp: any) => {
                            this.snackbar.open(resp.Message, '', {
                              duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
                            });
                            setTimeout(() => {
                              if (status == undefined) {
                                this.router.navigate(['/template']);
                              } else {
                                if (this.tempUrl == 'NewLetter/SaveAndSendNow') {
                                  location.reload();
                                }
                              }
                            }, 2500);
                            return false;
                          });
                      }
                      else {
                        setTimeout(() => {
                          if (status == undefined) {
                            this.router.navigate(['/template']);
                          } else {
                            if (this.tempUrl == 'NewLetter/SaveAndSendNow') {
                              location.reload();
                            }

                          }
                        }, 2500);
                        return false;
                      }
                    });
                  }
                  else {
                    setTimeout(() => {
                      if (status == undefined) {
                        this.router.navigate(['/template']);
                      } else {
                        if (this.tempUrl == 'NewLetter/SaveAndSendNow') {
                          location.reload();
                        }

                      }
                    }, 2500);
                    return false;
                  }
                  return false;
                }
              });
          }, 1500);
        }
        else {
          return false;
        }
      });
    }
    else {
      if (!this.printerReset) {
        this.printerReset = {};
        this.printerReset.name = 'Microsoft XPS Document Writer';
      }
      this.sendData = {
        "LetterId": this.tempLetterId,
        "TemplateId": this.selectedtmplt.TemplateID,
        "ExamId": this.selectedData.toothId, //Select Tooth id
        "Content": this.templat64, //Template Byte
        "BSendPDF": this.checkbox.pdf, //checkbox 
        "BSendLinkDr": this.checkbox.dr, //checkbox 
        "BSendLinkPatient": this.checkbox.ptnt, //checkbox 
        "Description": this.selectedtmplt.TemplateName, //Template Name
        "Tooth": this.selectedData.Tooth, //Tooth Selected
        "LetterAddressList": myaddress,
        "PrinterDevicename": this.printerReset.name
      }
      if (this.envelops) {
        this.sendData.EnvelopId = this.envelopReset.LetterID;
      }
      this.sendData.BSendPDF = this.checkbox.pdf;
      this.sendData.BSendLinkDr = this.checkbox.dr;
      this.sendData.BSendLinkPatient = this.checkbox.ptnt;
      this.tempUrl = 'NewLetter/Save';
      if (status) {
        this.tempUrl = 'NewLetter/SaveAndSendNow';
        this.sendData.attachOriginalImages = this.checkbox.attachOriginal;
        this.sendData.g_lCBCTID = this.tempCBCTId;
      }
      this.rich.saveDocument();
      this.spinner.show();
      setTimeout(() => {
        this.sendData.Content = this.templat64;
        this.sendData.LetterAddressList.Subject = this.selectedData.subject;
        if (!this.sendData.LetterAddressList.Subject) {
          this.sendData.LetterAddressList.Subject = "";
        }
        this.AppService.POST(this.tempUrl, this.sendData).subscribe(
          (resp: any) => {
            this.spinner.hide();
            if (resp.StatusCode) {
              this.snackbar.open(resp.Message, '', {
                duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
              });
              console.log(resp);
              if (resp.NeedReportSend && this.tempUrl == 'NewLetter/SaveAndSendNow') {
                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                  width: '500px',
                  data: resp.ReportMessage
                });
                dialogRef.afterClosed().subscribe(result => {
                  if (result) {
                    let sendData = { "TemplateId": this.selectedtmplt.TemplateID, "ExamId": this.selectedData.toothId, "NeedReportSent": true };
                    this.AppService.POST('NewLetter/ReportSent', sendData).subscribe(
                      (resp: any) => {
                        this.snackbar.open(resp.Message, '', {
                          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
                        });
                        setTimeout(() => {
                          if (status == undefined) {
                            this.router.navigate(['/template']);
                          } else {
                            if (this.tempUrl == 'NewLetter/SaveAndSendNow') {
                              location.reload();
                            }
                          }
                        }, 2500);
                        return false;
                      });
                  }
                  else {
                    setTimeout(() => {
                      if (status == undefined) {
                        this.router.navigate(['/template']);
                      } else {
                        if (this.tempUrl == 'NewLetter/SaveAndSendNow') {
                          location.reload();
                        }

                      }
                    }, 2500);
                    return false;
                  }
                });
              }
              else {
                setTimeout(() => {
                  if (status == undefined) {
                    this.router.navigate(['/template']);
                  } else {
                    if (this.tempUrl == 'NewLetter/SaveAndSendNow') {
                      location.reload();
                    }

                  }
                }, 2500);
                return false;
              }
              return false;
            }
          });
      }, 1500);
    }

  }

  processLetterCall() {
    this.EditlistData.ToData = [];
    this.EditlistData.CCData = [];
    this.EditlistData.BCCData = [];
    this.EditlistData.letterData = [];
    this.selectedData.subject = this.selectedData.subject + this.EmailListShowData.Subject;

    this.emails = {
      to: '',
      cc: '',
      bcc: '',
      letterData: ''
    };
    for (let index = 0; index < this.EmailListShowData.addressItem.length; index++) {
      const element = this.EmailListShowData.addressItem[index];
      if (element.Email_ToType.toLowerCase() == "to") {
        this.emails.to = this.emails.to + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Address + '>' + ' ' + '(' + element.Role + ')' + ', ';
        element.Email = element.Address;
        this.EditlistData.ToData.push(element);
      }
      if (element.Email_ToType.toLowerCase() == "cc") {
        this.emails.cc = this.emails.cc + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Address + '>' + ' ' + '(' + element.Role + ')' + ', ';
        element.Email = element.Address;
        this.EditlistData.CCData.push(element);
      }
      if (element.Email_ToType.toLowerCase() == "bcc") {
        this.emails.bcc = this.emails.bcc + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Address + '>' + ' ' + '(' + element.Role + ')' + ', ';
        element.Email = element.Address;
        this.EditlistData.BCCData.push(element);
      }
      if (element.MailType == 'Letter') {
        this.emails.letterData = this.emails.letterData + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Address + '>' + ' ' + '(' + element.Role + ')' + ', ';
        this.products.push(this.printTextArea);
        this.EditlistData.letterData.push(element);
      }
    }
    this.emails.to = this.emails.to.replace(/,\s*$/, "");
    this.emails.cc = this.emails.cc.replace(/,\s*$/, "");
    this.emails.bcc = this.emails.bcc.replace(/,\s*$/, "");
    this.emails.letterData = this.emails.letterData.replace(/,\s*$/, "");
  }


  getemailtoccbcc(id, tid) {
    this.spinner.show();
    let url = 'NewLetter/SetMailAddresses?examId=' + id + '&cboLetterStoreValue=' + tid;
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        this.EditlistData.ToData = [];
        this.EditlistData.CCData = [];
        this.EditlistData.BCCData = [];
        this.EditlistData.letterData = [];
        this.products = [];

        this.EmailListShowData = [];
        this.EmailListShowData = resp.body.Result;
        if (this.EmailListShowData.Subject) {
          this.selectedData.subject = this.selectedData.subject + this.EmailListShowData.Subject;
        }
        if (this.selectedData.subject == null || this.selectedData.subject == 'null') {
          this.selectedData.subject = '';
        }
        this.emails = {
          to: '',
          cc: '',
          bcc: ''
        };

        this.printTextArea = '';
        for (let index = 0; index < this.EmailListShowData.addressItem.length; index++) {
          const element = this.EmailListShowData.addressItem[index];
          if (element.Email_ToType.toLowerCase() == "to") {
            this.emails.to = this.emails.to + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Address + '>' + ' ' + '(' + element.Role + ')' + ', ';
            element.Email = element.Address;
            this.EditlistData.ToData.push(element);
          }
          if (element.Email_ToType.toLowerCase() == "cc") {
            this.emails.cc = this.emails.cc + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Address + '>' + ' ' + '(' + element.Role + ')' + ', ';
            element.Email = element.Address;
            this.EditlistData.CCData.push(element);
          }
          if (element.Email_ToType.toLowerCase() == "bcc") {
            this.emails.bcc = this.emails.bcc + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Address + '>' + ' ' + '(' + element.Role + ')' + ', ';
            element.Email = element.Address;
            this.EditlistData.BCCData.push(element);
          }
          if (element.MailType == 'Letter') {
            // this.printTextArea = this.printTextArea +  + ', ';         
            this.products.push(element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Address + '>' + ' ' + '(' + element.Role + ')');
            this.EditlistData.letterData.push(element);
          }
        }
        this.emails.to = this.emails.to.replace(/,\s*$/, "");
        this.emails.cc = this.emails.cc.replace(/,\s*$/, "");
        this.emails.bcc = this.emails.bcc.replace(/,\s*$/, "");
        this.printTextArea = this.printTextArea.replace(/,\s*$/, "");
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }

  inputMailAdd() {
    this.tempTo = [];
    this.tempBcc = [];
    this.tempCc = [];
    let toData = this.emails.to.split(',');
    let ccData = this.emails.cc.split(',');
    let bccData = this.emails.bcc.split(',');

    for (let index = 0; index < toData.length; index++) {
      const element = toData[index];
      if (this.ValidateEmail(element.trim())) {
        let final = {
          Address: element.trim(),
          Email: element.trim(),
          Email_ToType: "To",
          MailType: "Email",
          PersonId: 0,
          Role: "Other"
        }
        this.tempTo.push(final);
      }
    }

    for (let index = 0; index < ccData.length; index++) {
      const element = ccData[index];
      if (this.ValidateEmail(element.trim())) {
        let final = {
          Address: element.trim(),
          Email: element.trim(),
          Email_ToType: "Cc",
          MailType: "Email",
          PersonId: 0,
          Role: "Other"
        }
        this.tempCc.push(final);
      }
    }
    for (let index = 0; index < bccData.length; index++) {
      const element = bccData[index];
      if (this.ValidateEmail(element.trim())) {
        let final = {
          Address: element.trim(),
          Email: element.trim(),
          Email_ToType: "Bcc",
          MailType: "Email",
          PersonId: 0,
          Role: "Other"
        }
        this.tempBcc.push(final);
      }
    }
  }

  ValidateEmail(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
      return (true)
    }
    return (false)
  }


  processMailType() {
    this.EmailListShowData.addressItem = [];
    this.emails = {
      to: '',
      cc: '',
      bcc: '',
      letterData: '',
    };
    for (let index = 0; index < this.EditlistData.ToData.length; index++) {

      const element = this.EditlistData.ToData[index];
      this.emails.to = this.emails.to + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Email + '>' + ' ' + '(' + element.Role + ')' + ', ';
      element.Email_ToType = "To";
      element.Address = element.Email;
      element.MailType = "Email";
      this.EmailListShowData.addressItem.push(element);
    }
    for (let index = 0; index < this.EditlistData.CCData.length; index++) {
      const element = this.EditlistData.CCData[index];
      this.emails.cc = this.emails.cc + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Email + '>' + ' ' + '(' + element.Role + ')' + ', ';
      element.Email_ToType = "Cc";
      element.Address = element.Email;
      element.MailType = "Email";
      this.EmailListShowData.addressItem.push(element);
    }
    for (let index = 0; index < this.EditlistData.BCCData.length; index++) {
      const element = this.EditlistData.BCCData[index];
      this.emails.bcc = this.emails.bcc + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Email + '>' + ' ' + '(' + element.Role + ')' + ', ';
      element.Email_ToType = "Bcc";
      element.Address = element.Email;
      element.MailType = "Email";
      this.EmailListShowData.addressItem.push(element);
    }
    for (let index = 0; index < this.EditlistData.letterData.length; index++) {
      this.emails.letterData = ''
      const element = this.EditlistData.letterData[index];
      this.emails.letterData = this.emails.letterData + element.FirstName + ' ' + element.LastName + ' ' + '<' + element.Address + '>' + ' ' + '(' + element.Role + ')' + ', ';
      element.Email_ToType = "";
      element.Address = element.Address;
      element.MailType = "Letter";
      if (!this.products.includes(this.emails.letterData)) {
        this.EmailListShowData.addressItem.push(element);
        this.products.push(this.emails.letterData);
      }

    }
    if (this.tempTo.length > 0) {
      for (let index = 0; index < this.tempTo.length; index++) {
        const element = this.tempTo[index];
        this.emails.to = this.emails.to + element.Email + ',';
      }
    }
    if (this.tempBcc.length > 0) {
      for (let index = 0; index < this.tempBcc.length; index++) {
        const element = this.tempBcc[index];
        this.emails.bcc = this.emails.bcc + element.Email + ',';
      }
    }
    if (this.tempCc.length > 0) {
      for (let index = 0; index < this.tempCc.length; index++) {
        const element = this.tempCc[index];
        this.emails.cc = this.emails.cc + element.Email + ',';
      }
    }
    this.emails.to = this.emails.to.replace(/,\s*$/, "");
    this.emails.cc = this.emails.cc.replace(/,\s*$/, "");
    this.emails.bcc = this.emails.bcc.replace(/,\s*$/, "");
    this.emails.letterData = this.emails.letterData.replace(/,\s*$/, "");
  }

  clearList() {
    this.emails = {};
    this.EmailListShowData.addressItem = [];
    this.EditlistData.ToData = [];
    this.EditlistData.CCData = [];
    this.EditlistData.BCCData = [];
    this.printTextArea = '';
    this.checkbox = {
      pdf: false,
      dr: false,
      ptnt: false,
      attachOriginal: false
    };
  }

  activeStatus(status) {
    this.emailPrintStatus = status;
    console.log(this.emailPrintStatus);
  }

  ngOnDestroy() {
    if (this.rich) {
      this.rich.dispose();
      this.rich = null;
    }
  }
}
