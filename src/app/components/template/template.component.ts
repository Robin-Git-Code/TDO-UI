import { Component, ElementRef, ViewChild, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { create, createOptions, FileTabItemId, Size, RichEdit, Interval, ViewType, DocumentFormat, RichEditUnit, RibbonTabType, WrapType, ReferencesTabCommandId, TableLayoutTabCommandId, RibbonButtonItem } from 'devexpress-richedit';
import { AppService } from "../../app.service";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { staticLists } from '../../app.constant';
import { MatchDialogComponent } from '../../common/dialogs/match/match.dialog';
import { ListingDialogComponent } from '../../common/dialogs/listing/listing.dialog';
import { ConfirmDialogComponent } from '../../common/dialogs/confirm/confirm.dialog';
import { AddTemplateDialogComponent } from '../../common/dialogs/add-template/add-template.dialog';
import { SpellcheckerService } from '../../spellchecker.service';
import { DeleteDialogComponent } from '../../common/dialogs/delete-template/delete-template';
import { fromEvent } from 'rxjs';
import { map, filter, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from "@angular/router";
import { OptionsDialogComponent } from '../../common/dialogs/options/options.dialog';
import { DescriptionLetterDialogComponent } from '../../common/dialogs/description-letter/description-letter.dialog';

let richEdit: any;
let DevExpress: any;

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})

export class TemplateComponent implements AfterViewInit, OnDestroy {

  intervalScroll: any = 99;
  scrollCheck: boolean = false;
  myIndexx: any = 0;
  typesOfShoes: string[] = ['Name', 'Handle'];
  private rich: RichEdit;
  BookMarkNumber: number = 0;
  TemplateList: any;
  selectedTemplate: any;
  FormatData: any;
  insertTokens: string = '';
  idReportForMatch: number;
  token: string = '';
  TodayDate: Date = new Date();
  templateSelectData: any;
  SaveAsFlag: boolean;
  renameIndex: number;
  TestButtonStatus: boolean;
  PickInformationAreaList: any;
  TokenList: any = [];
  searchKeyword: any = '';
  pickInfoId: any = '0';
  FormatList: any = [];
  PictureList: any = [];
  ReportList: any = [];
  totalBookMarkList: any = [];
  TestButtonShow: boolean = true;
  selectReportType: number;
  TestTempBase64: string;
  pictuesss: string = 'assets/images/letters/placeholder/PickPicture.jpg';
  picureSelected: string = 'assets/images/letters/placeholder/PickPicture.jpg';
  AskforSave: boolean = false;
  myPicturesData: any;
  invalidInput: boolean = false;
  picureSelectedName: string = 'CustomPicture';
  newButtonClicked: boolean = false;
  selectedmultipleToken: any = [];
  selectedFormat: any;
  raisedFromDropDown: boolean;
  TemplateListSearchDummy: any[] = [];
  showDropdownTemplate = false;
  myDialogName: string;
  myposition: any;
  insertTableStatus: any;
  products: any;
  tableSelectedData: any;
  showDataBeforeSearchOption: boolean = false;
  showErrorInfo: any;
  pictureStatus: string = 'inline';
  resetVal: string = null;
  fixedL: boolean = false;
  disableStatus: boolean = false;
  envelop: boolean = false;
  tempInitialFixed: boolean;
  tempInitialDisable: boolean;
  saveOnTabChange = false;
  defaultPickInfo: any = undefined;
  resetFormatInfo: any = undefined;
  resetPictureInfo: any = undefined;
  defaultReportList: any = undefined;
  callNow: boolean = false;
  tempTokenList: any = [];
  checkbox: any = {};

  @ViewChild('searchKeywordRef') searchKeywordRef: ElementRef;

  constructor(private router: Router, private element: ElementRef, private spellcheckerService: SpellcheckerService, private snackbar: MatSnackBar, public datepipe: DatePipe, private spinner: NgxSpinnerService, public dialog: MatDialog, private AppService: AppService) {

  }

  ngOnInit() {
    this.getTempDrop();
    this.GetPickInformationAreaList();
    this.GetTokenList(this.pickInfoId, this.searchKeyword);
    this.FormatList = staticLists.formatList;
    this.PictureList = staticLists.pictureList;
    this.resetPictureInfo = this.PictureList[0];
    this.ReportList = staticLists.reportList;
    // this.defaultReportList = this.ReportList[0];
    this.insertTokens = '';
    this.token = '';
    this.selectedmultipleToken = [];
    this.templateSelectData = {
      value: '1',
      Subject: '',
      ReportType: '',
      width: '100',
      height: '100',
      SearchVal: ''
    }
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);


  }

  createNewTemp() {
    this.insertTokens = '';
    this.token = '';
    this.selectedmultipleToken = [];
    this.templateSelectData = {
      value: '1',
      Subject: '',
      ReportType: '',
      width: '100',
      height: '100',
      SearchVal: ''
    };
    this.picureSelected = 'assets/images/letters/placeholder/PickPicture.jpg';
    this.AskforSave = false;
    this.picureSelectedName = 'CustomPicture';
    this.resetVal = null;
    this.selectedTemplate = undefined;
    this.fixedL = false;
    this.disableStatus = false;
    this.tempInitialFixed = false;
    this.tempInitialDisable = false;
    if (this.PickInformationAreaList) {
      this.defaultPickInfo = this.PickInformationAreaList[0];
    }
  }

  onSelectionChanged(val) {
    if (val.selectedItem) {
      this.resetVal = val.selectedItem;
      this.onChange(val.selectedItem.TemplateID, '');
    } else {
    }

  }

  getTempDrop() {
    this.spinner.show();
    let url = 'LetterTemplate?LetterName=';
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.body) {
          this.TemplateList = resp.body.ResultList;
          this.TemplateListSearchDummy = resp.body.ResultList;
        }
      },
      err => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }
  ngAfterViewInit(): void {

    // the createOptions() method creates an object that contains RichEdit options initialized with default values
    const options = createOptions();

    options.bookmarks.visibility = true;
    options.bookmarks.color = '#ff0000';

    options.confirmOnLosingChanges.enabled = false;
    options.spellCheck.enabled = true;
    options.spellCheck.suggestionCount = 5;
    options.spellCheck.checkWordSpelling = (word, callback) => this.spellcheckerService.checkWordSpelling(word, callback);
    options.spellCheck.addWordToDictionary = (word) => this.spellcheckerService.addWordToDictionary(word);



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
      this.AskforSave = true;
    };
    options.events.documentFormatted = () => { };
    options.events.documentLoaded = (s: any, e) => {

      if (!this.raisedFromDropDown) {
        this.createNewTemp();
      }
      this.raisedFromDropDown = false;
      setTimeout(() => {
        this.AskforSave = false;
      }, 1000);
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
      this.alertSave(e.base64)
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

    //  options.exportUrl = 'https://siteurl.com/api/';
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

    // var SetAutoFitContents = 399;
    // var SetAutoFitWindow = 400;
    // var SetFixedColumnWidth = 401;
    // var subDocument = this.rich.selection.activeSubDocument;
    // console.log(subDocument);

    // let s:any;
    // for (var ind = 0, table; table = subDocument.tables.getByIndex(ind); ind++) {
    //   this.rich.selection.setSelection(table.interval.start);
    //   s._native.core.commandManager.getCommand(SetAutoFitWindow).execute(true); // private api
    //   console.log('I am checking now');

    // }
    // this.rich.selection.setSelection(0);
  }


  dbClicksEvent() {
    // console.log('double click');

  }
 
  downloadAlert() {
    let displayDate =this.datepipe.transform(this.TodayDate, 'yyyy-MM-dd');
    let fileName = '';
    let tempPatientName = '';
    let tempTemplateName = '';

    if(localStorage.getItem("PatientName")){
      tempPatientName = localStorage.getItem("PatientName") + ' - ';
      fileName = fileName + tempPatientName;
    }
    if(this.selectedTemplate){
      tempTemplateName = this.selectedTemplate.TemplateName + ' - ';
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

  checknewmyVal(index) {
    if (index == 0) {
      return 'Tooth';
    }
    if (index == 1) {
      return 'Code';
    }
    if (index == 2) {
      return 'Surface';
    }
    if (index == 3) {
      return 'Description';
    }
    if (index == 4) {
      return 'Est. # Visits';
    }
    if (index == 5) {
      return 'Prognosis';
    }
    if (index == 6) {
      return 'Original Fee';
    }
    if (index == 7) {
      return 'Fee';
    }
    if (index == 8) {
      return 'No Charge';
    }
    if (index == 9) {
      return 'Ins. Est.';
    }
    if (index == 10) {
      return 'Pt. Est.';
    }
    if (index == 11) {
      return 'Fee Category';
    }

    if (index == 12) {
      return 'Presented';
    }
    if (index == 13) {
      return 'Posted';
    }
    if (index == 14) {
      return 'Dr.';
    }
  }

  checknewmyVal2(index) {
    if (index == 0) {
      return '<<Tooth>>';
    }
    if (index == 1) {
      return '<<Code>>';
    }
    if (index == 2) {
      return '<<Surface>>';
    }
    if (index == 3) {
      return '<<Description>>';
    }
    if (index == 4) {
      return '<<NumVisits>>';
    }
    if (index == 5) {
      return '<<Prognosis>>';
    }
    if (index == 6) {
      return '<<OriginalFee>>';
    }
    if (index == 7) {
      return '<<Fee>>';
    }
    if (index == 8) {
      return '<<Charge>>';
    }
    if (index == 9) {
      return '<<InstEst>>';
    }
    if (index == 10) {
      return '<<PtEst>>';
    }
    if (index == 11) {
      return '<<FeeCategory>>';
    }

    if (index == 12) {
      return '<<Presented>>';
    }
    if (index == 13) {
      return '<<Posted>>';
    }
    if (index == 14) {
      return '<<Doctor>>';
    }
  }

  checkmyVal(index) {
    if (index == 0) {
      return 'Date';
    }
    if (index == 1) {
      return 'Tooth';
    }
    if (index == 2) {
      return 'Description';
    }
    if (index == 3) {
      return 'Claim #';
    }
    if (index == 4) {
      return 'Charges';
    }
    if (index == 5) {
      return 'Credit';
    }
    if (index == 6) {
      return 'Running Balance';
    }
  }

  checkmyVal2(index) {
    if (index == 0) {
      return '<<ItemDate>>';
    }
    if (index == 1) {
      return '<<Tooth>>';
    }
    if (index == 2) {
      return '<<Description>>';
    }
    if (index == 3) {
      return '<<Claim#>>';
    }
    if (index == 4) {
      return '<<Charges>>';
    }
    if (index == 5) {
      return '<<Credit>>';
    }
    if (index == 6) {
      return '<<Running Balance>>';
    }
  }

  createNewTable(token) {
    this.rich.beginUpdate();
    this.rich.history.beginTransaction();
    var subDocument = this.rich.selection.activeSubDocument;
    var position = this.rich.selection.active;
    var columnCount = 15;
    var rowCount = 3;
    var interval = subDocument.insertText(position, "<<" + token + ">><<Format:");
    var table = subDocument.tables.create(position + interval.length, columnCount, rowCount);
    for (var rowInd = 0, row; row = table.rows.getByIndex(rowInd); rowInd++) {
      if (rowInd == 0) {
        var cellInd = 0, cell; cell = row.cells.getByIndex(cellInd);
        subDocument.insertText(cell.interval.start, "<<" + token + ">>");
      }
      else {
        if (rowInd == 1) {
          for (var cellInd = 0, cell; cell = row.cells.getByIndex(cellInd); cellInd++) {
            var characterProperties = {
              bold: true,
              fontName: this.rich.document.fonts.getByIndex(0).name
            };
            var intervalc1 = subDocument.insertText(cell.interval.start, this.checknewmyVal(cellInd));
            subDocument.setCharacterProperties(intervalc1, characterProperties);
          }
        }
        else {
          for (var cellInd = 0, cell; cell = row.cells.getByIndex(cellInd); cellInd++) {
            subDocument.insertText(cell.interval.start, this.checknewmyVal2(cellInd));
          }

        }
      }
    }
    var interval2 = subDocument.insertText(position + interval.length + table.interval.length + 1, ">>");

    this.rich.history.endTransaction();
    this.rich.endUpdate();
  }

  onItemClick(val, item) {
    val.selectedItem = val.itemData;
    this.onButtonClick(val, item, true)
  }

  onButtonClick(val, item, status) {
    //restrict space and enter button
    if (val.event.keyCode == '13' || val.event.keyCode == '32') {
      return false;
    }
    let filterType = val.selectedItem;
    if (status) {
      this.selectedFormat = filterType.key;
      this.insertTokens = '<<Format:' + this.selectedFormat + '>>';
    }
    else {
      this.insertTokens = '';
    }

    this.token = '';
    this.tableSelectedData = [];

    if (item.TokenID > 1339 && item.TokenID < 1346 || item.TokenID == 1470 || item.TokenID > 1334 && item.TokenID < 1339) {
      if (item.TokenID == 1470) {
        this.createNewTable(item.Token);
        return false;
      } else if (item.TokenID > 1334 && item.TokenID < 1339 || item.TokenID == 1340) {
        this.createTable(item.Token, 6);
        return false;
      }
      else {
        this.createTable(item.Token, 0);
        return false;
      }
    }
    else {
      this.token = this.token + '<<' + item.Token + '>>';
      this.idReportForMatch = item.idReport;
    }
    console.log('from here');

    var subDocument = this.rich.selection.activeSubDocument;
    var position = this.rich.selection.active;
    if (this.selectedFormat == 'Match') {
      this.openMatchPopup();
      return false;
    }
    //  subDocument.insertText(position, this.token + this.insertTokens);

    this.rich.beginUpdate();
    this.rich.history.beginTransaction();
    var tmpTextInterval = subDocument.insertText(position, this.token + this.insertTokens);
    position = tmpTextInterval.end;

    this.rich.endUpdate();
    this.rich.history.endTransaction();
    this.rich.selection.setSelection(tmpTextInterval);
    this.rich.focus();

    this.insertTokens = '';
    this.selectedFormat = '';

  }

  createTable(token, count: number) {
    this.rich.beginUpdate();
    this.rich.history.beginTransaction();
    var subDocument = this.rich.selection.activeSubDocument;
    var position = this.rich.selection.active;
    var columnCount = 7;
    var rowCount = 3;
    if (count) {
      var columnCount = count;
    }
    var interval = subDocument.insertText(position, "<<" + token + ">><<Format:");
    var table = subDocument.tables.create(position + interval.length, columnCount, rowCount);
    for (var rowInd = 0, row; row = table.rows.getByIndex(rowInd); rowInd++) {
      if (rowInd == 0) {
        var cellInd = 0, cell; cell = row.cells.getByIndex(cellInd);
        subDocument.insertText(cell.interval.start, "<<" + token + ">>");
      }
      else {
        if (rowInd == 1) {
          for (var cellInd = 0, cell; cell = row.cells.getByIndex(cellInd); cellInd++) {
            var characterProperties = {
              bold: true,
              fontName: this.rich.document.fonts.getByIndex(0).name
            };
            var intervalc1 = subDocument.insertText(cell.interval.start, this.checkmyVal(cellInd));
            subDocument.setCharacterProperties(intervalc1, characterProperties);
          }
        }
        else {
          for (var cellInd = 0, cell; cell = row.cells.getByIndex(cellInd); cellInd++) {
            subDocument.insertText(cell.interval.start, this.checkmyVal2(cellInd));
          }

        }
      }
    }
    var interval2 = subDocument.insertText(position + interval.length + table.interval.length + 1, ">>");

    this.rich.history.endTransaction();
    this.rich.endUpdate();
  }


  openMatchPopup() {
    const dialogRef = this.dialog.open(MatchDialogComponent, {
      width: '650px',
      data: this.idReportForMatch
    });
    dialogRef.afterClosed().subscribe(result => {
      var subDocument = this.rich.selection.activeSubDocument;
      var position = this.rich.selection.active;
      this.FormatList = [];
      setTimeout(() => {
        this.FormatList = staticLists.formatList;
      }, 300);
      if (!result) {
        //  subDocument.insertText(position, this.token);
        this.selectedFormat = '';
        this.insertTokens = '';
        return false;
      }
      else {
        var subDocument = this.rich.selection.activeSubDocument;
        var position = this.rich.selection.active;
        subDocument.insertText(position, this.token + result);
        this.selectedFormat = '';
        this.insertTokens = '';
        return false;
      }
    });
    return false;
  }

  addTokenAtCursor() {
    if (this.insertTableStatus) {
      for (let index = 0; index < this.tableSelectedData.length; index++) {
        const element = this.tableSelectedData[index];
        if (element.TokenID == 1470) {
          this.createNewTable(element.Token);
        } else if (element.TokenID > 1334 && element.TokenID < 1339 || element.TokenID == 1340) {
          this.createTable(element.Token, 6);
        }
        else {
          this.createTable(element.Token, 0);
        }
      }
    }
    var subDocument = this.rich.selection.activeSubDocument;
    var position = this.rich.selection.active;
    if (this.selectedFormat == 'Match') {
      this.openMatchPopup();
      return false;
    }
    this.resetFormatInfo = undefined;
    subDocument.insertText(position, this.token + this.insertTokens);
    console.log(position);

    this.insertTokens = '';
    this.selectedFormat = '';
  }



  SaveDoctoServer(docName, base64) {
    this.spinner.show();
    let url = 'LetterTemplate';
    if (!this.selectedTemplate) {
      let data2 = { "DateCreated": this.TodayDate, "DateModified": this.TodayDate, "TemplateName": docName, "TypeCode": "L", "Content": base64, "ContentB": base64, "Category": 1, "Fixed": this.fixedL, "Orientation": 0, "PageWidth": 0, "Envelope": this.envelop, "PageHeight": 0, "PageMarginT": 0, "PageMarginB": 0, "PageMarginL": 0, "PageMarginR": 0, "Gen_Content": 0, "Disabled": this.disableStatus, "SystemDefault": false, "Format": 16, "FileName": "", "KeepInDatabase": true, "DefaultView": 1, "ReportType": this.templateSelectData.ReportType, "PrinterDeviceName": "", "upsize_ts": null, "Subject": this.templateSelectData.Subject, "LocationID": 0 }

      this.AppService.POST(url, data2).subscribe(
        (resp: any) => {
          this.snackbar.open(resp.Message, '', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          this.AppService.setDocumentValue(false);
          this.TemplateList.push(resp.Result);
          this.resetVal = resp.Result;
          if (this.AskforSave && this.newButtonClicked) {
            //  location.reload();
            this.rich.newDocument();

            this.onChange(1, '');
            this.templateSelectData = {
              value: '1',
              Subject: '',
              ReportType: '',
              width: '100',
              height: '100',
              SearchVal: ''
            }
            this.insertTokens = '';
            this.token = '';
            this.selectedmultipleToken = [];
            this.totalBookMarkList = [];
            this.AskforSave = false;
            this.newButtonClicked = false;
            this.resetPictureInfo = this.PictureList[0];
            this.createNewTemp();
            this.spinner.hide();
            return false;
          }
          else {
            this.AskforSave = false;
            this.newButtonClicked = false;
          }
          // this.onChange(resp.Result.TemplateID, resp.Result.TemplateName);
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          console.log(err);
        }
      );
      return false;
    }
    if (this.selectedTemplate && this.SaveAsFlag) {
      this.selectedTemplate.Content = base64;
      this.selectedTemplate.ContentB = base64;
      this.selectedTemplate.TemplateName = docName;
      this.selectedTemplate.Subject = this.templateSelectData.Subject;
      this.selectedTemplate.Disabled = this.disableStatus;
      this.selectedTemplate.Fixed = this.fixedL;
      this.selectedTemplate.Envelope = this.envelop;
      this.AppService.POST(url, this.selectedTemplate).subscribe(
        (resp: any) => {
          this.snackbar.open(resp.Message, '', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          this.SaveAsFlag = false;
          this.TemplateList.push(resp.Result);
          this.resetVal = resp.Result;
          this.AppService.setDocumentValue(false);
          this.onChange(resp.Result.TemplateID, resp.Result.TemplateName);
          this.spinner.hide();
        },
        err => {
          this.spinner.hide();
          console.log(err);
        }
      );
      return false;
    }
    else {
      let url = 'LetterTemplate';
      this.selectedTemplate.Content = base64;
      this.selectedTemplate.ContentB = base64;
      this.selectedTemplate.Subject = this.templateSelectData.Subject;
      this.selectedTemplate.Disabled = this.disableStatus;
      this.selectedTemplate.Fixed = this.fixedL;
      this.selectedTemplate.Envelope = this.envelop;
      this.AppService.PUT(url, this.selectedTemplate).subscribe(
        (resp: any) => {
          this.snackbar.open(resp.Message, '', {
            duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
          });
          this.spinner.hide();
          this.selectedTemplate = resp.Result;
          this.disableStatus = this.selectedTemplate.Disabled;
          this.fixedL = this.selectedTemplate.Fixed;
          this.tempInitialFixed = this.selectedTemplate.Fixed;
          this.tempInitialDisable = this.selectedTemplate.Disabled;
          this.templateSelectData.SearchVal = this.selectedTemplate.TemplateName;
          if (this.saveOnTabChange)
            this.router.navigate(['/']);
        },
        err => {
          this.spinner.hide();
          console.log(err);
        }
      );
      return false;
    }
  }

  TestOnServer(e) {
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
    this.TestButtonStatus = false;
    let url = 'LetterTemplate/ReplaceTokensNew';
    let data = {
      'ContentB': e
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
              this.testReset();
              return false;
            }
          });
          return false;
        }
        var documentAsBase64 = resp.Result.ContentB;
        this.rich.openDocument(documentAsBase64, 'myDoc.docx', DocumentFormat.OpenXml);
        this.rich.hasUnsavedChanges = true;
      }, err => {
        this.spinner.hide();
        console.log(err);
      });

  }

  TestTokenAgain(id, data, tokenCat) {
    this.spinner.show();
    if (this.myDialogName == 'CBCT') {
      data.lCBCTID = id;
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
              this.testReset();
              return false;
              // this.TestTokenAgain('0', resp.Result, resp.Result.OpenDialogBox);
              // return false;
            }
          });
          return false;
        }
        var documentAsBase64 = resp.Result.ContentB;
        this.rich.openDocument(documentAsBase64, 'myDoc.docx', DocumentFormat.OpenXml);
        this.rich.hasUnsavedChanges = true;
      });
  }

  alertSave(e) {
    // if (this.tempInitialFixed){
    //   return false;
    // }   
    if (this.TestButtonStatus) {
      this.TestOnServer(e);
      this.TestTempBase64 = e;
      return false
    }
    if (this.selectedTemplate && !this.SaveAsFlag) {
      this.SaveDoctoServer('', e);
      if (this.AskforSave && this.newButtonClicked) {
        //  location.reload();
        this.rich.newDocument();
        this.onChange(1, '');
        this.templateSelectData = {
          value: '1',
          Subject: '',
          ReportType: '',
          width: '100',
          height: '100',
          SearchVal: ''
        }
        this.insertTokens = '';
        this.token = '';
        this.totalBookMarkList = [];
        this.selectedmultipleToken = [];
        this.AskforSave = false;
        this.newButtonClicked = false;
        this.resetPictureInfo = this.PictureList[0];
        return false;
      }
      else {
        this.AskforSave = false;
        this.newButtonClicked = false;
      }
      return false;
    }
    else {
      const dialogRef = this.dialog.open(AddTemplateDialogComponent, {
        width: '500px',
        data: ''
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.SaveDoctoServer(result, e);

        }
      });
      return false;
    }
  }

  mychange(d) {
    if (d == '' || d == 0) {
      this.invalidInput = true;
    }
    setTimeout(() => {
      if (this.templateSelectData.width > 0 && this.templateSelectData.height > 0) {
        this.invalidInput = false;
      }
    }, 300);
  }

  searchTemplateName(name: any) {
    this.showDropdownTemplate = true;
    if (!name) {
      this.TemplateListSearchDummy = [...this.TemplateList];
    } else {
      this.TemplateListSearchDummy = [];
      this.TemplateListSearchDummy = this.TemplateList.filter((item) => {
        return item.TemplateName.toUpperCase().indexOf(name.toUpperCase()) > -1;
      });
    }
  }
  checkDropdownStatus() {
    if (this.showDropdownTemplate) {
      this.showDropdownTemplate = false
    }
    else {
      this.showDropdownTemplate = true;
    }
  }

  //reset() { this.heroes = HEROES.slice(); }



  onKey(event: any) {
    if (event.charCode == 46) {
    }
    else if (event.charCode > 47 && event.charCode < 58) {
    }
    else {
      event.preventDefault();
    }
  }
  // Abhipsa
  GetPickInformationAreaList() {
    this.spinner.show();
    let url = 'LetterToken/GetPickInformationAreaList';

    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.body.Message == 'Success') {
          this.PickInformationAreaList = resp.body.ResultList;
          this.defaultPickInfo = this.PickInformationAreaList[0];
        }
      });
  }
  GetTokenList(id, search) {
    this.spinner.show();
    this.TokenList = [];
    let url = 'LetterToken/GetTokenList?HostObjectId=' + id + '&SearchChar=' + search;
    if (id || search) {
      this.myIndexx = 0;
      this.intervalScroll = 99;
    }
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        this.spinner.hide();
        if (resp.body.Message == 'Success') {
          this.tempTokenList = resp.body.ResultList;
          this.intervalScroll = resp.body.ResultList.length;

          // this.TokenList = resp.body.ResultList;
          if (id != 0) {
            this.TokenList = resp.body.ResultList;
            return false;
          }
          for (let index = this.myIndexx; index < this.intervalScroll; index++) {
            if (this.tempTokenList[index]) {
              const element = this.tempTokenList[index];
              this.myIndexx = index;
              this.TokenList.push(element);
            }

          }
          this.myIndexx = this.myIndexx + 1;
        }
        else {
          this.TokenList = [];
        }
        this.showErrorInfo = resp.body.StatusCode;
      });
  }
  infiniteScroll() {

  }

  onScroll() {
    if (this.TokenList.length == this.tempTokenList.length) {
      this.scrollCheck = true;
      return false;
    }
    this.spinner.show();
    this.myIndexx = this.myIndexx + 1;
    this.intervalScroll = this.myIndexx + 100;
    for (let index = this.myIndexx; index < this.intervalScroll; index++) {
      if (this.tempTokenList[index]) {
        const element = this.tempTokenList[index];
        this.myIndexx = index;
        this.TokenList.push(element);
      }
    }
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
  }


  onChangePickInfo(data) {
    // return false;
    if (!this.TestButtonShow) {
      return false;
    }
    this.defaultPickInfo = data.selectedItem;
    this.pickInfoId = data.selectedItem.ID;
    this.selectedmultipleToken = [];
    if (this.callNow) {
      this.GetTokenList(this.pickInfoId, this.searchKeyword);
      this.scrollCheck = false;
    }
    setTimeout(() => {
      this.callNow = true;
    }, 1000);
  }
  onChangeSearchKey(data) {
    this.searchKeyword = data;
  }
  searchvaluechange(val) {
    if (val == '') {
      this.searchKeyword = '';
      this.onFilter();
    }
    else {
      fromEvent(this.searchKeywordRef.nativeElement, 'keyup').pipe(debounceTime(1200)).subscribe(res => {
        this.GetTokenList(this.pickInfoId, this.searchKeyword);
        this.scrollCheck = false;
      }
      );
    }
  }

  onFilter() {
    if (!this.TestButtonShow) {
      this.snackbar.open('Test mode is on, Please click on Test Reset button to perform action', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    this.selectedmultipleToken = [];
    // this.searchKeyword = '';
    this.GetTokenList(this.pickInfoId, this.searchKeyword);
    this.resetFormatInfo = undefined;

  }
  onTokenModelChange() {
    this.token = '';
    this.insertTableStatus = false;
    this.tableSelectedData = [];
    for (let index = 0; index < this.selectedmultipleToken.length; index++) {
      const element = this.selectedmultipleToken[index];
      if (element.TokenID > 1339 && element.TokenID < 1346 || element.TokenID == 1470 || element.TokenID > 1334 && element.TokenID < 1339) {
        this.insertTableStatus = true;
        this.tableSelectedData.push(element);
      }
      else {
        this.token = this.token + '<<' + element.Token + '>>';
        this.idReportForMatch = element.idReport;
      }

    }
  }
  onChangeReportFormat(data) {
    this.defaultReportList = data.selectedItem;
    this.templateSelectData.ReportType = data.selectedItem.value;
    if (this.selectedTemplate) {
      this.selectedTemplate.ReportType = data.selectedItem.value;
    }

  }
  onChangeFormat(data) {
    if (data.selectedItem) {
      this.selectedFormat = data.selectedItem.key;
      this.resetFormatInfo = data.selectedItem;
      this.insertTokens = '<<Format:' + this.selectedFormat + '>>';
    }
    else {
      this.insertTokens = '';
      return false;
    }
  }
  onChangePicture(data) {
    console.log(data.selectedItem);
    this.resetPictureInfo = data.selectedItem;
    this.picureSelected = data.selectedItem.image;
    this.picureSelectedName = data.selectedItem.value;
  }

  RenameTemp() {
    if (!this.TestButtonShow) {
      this.snackbar.open('Test mode is on, Please click on Test Reset button to perform action', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    const dialogRef = this.dialog.open(AddTemplateDialogComponent, {
      width: '500px',
      data: this.selectedTemplate.TemplateName
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.RenameTempServer(result);
      }
    });
    return false;
  }

  RenameTempServer(name) {
    this.spinner.show();
    let url = 'LetterTemplate';
    this.selectedTemplate.TemplateName = name;
    this.AppService.PUT(url, this.selectedTemplate).subscribe(
      (resp: any) => {
        this.spinner.hide();
        this.snackbar.open(resp.Message, '', {
          duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
        });
        for (let index = 0; index < this.TemplateList.length; index++) {
          const element = this.TemplateList[index];
          if (element.TemplateID == resp.Result.TemplateID) {
            this.TemplateList.splice(index, 1);
          }
        }
        this.TemplateList.push(resp.Result);
        this.resetVal = resp.Result;
        return false;
      },
      err => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  testDoc() {
    this.rich.hasUnsavedChanges = true;
    this.raisedFromDropDown = true;
    this.TestButtonStatus = true;
    this.TestButtonShow = false;
    this.rich.saveDocument();
  }

  testReset() {
    this.TestButtonShow = true;
    this.raisedFromDropDown = true;
    if (this.TestTempBase64) {
      this.rich.openDocument(this.TestTempBase64, 'myDoc.docx', DocumentFormat.OpenXml);
      this.rich.hasUnsavedChanges = true;
    }
  }


  DeleteTemplate() {
    if (!this.TestButtonShow) {
      this.snackbar.open('Test mode is on, Please click on Test Reset button to perform action', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    if (this.tempInitialFixed) {
      return false;
    }
    if (!this.selectedTemplate) {
      this.snackbar.open('No Template selected', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 1) {
        this.spinner.show();
        let url = 'LetterTemplate/Disabled?TemplateID=' + this.selectedTemplate.TemplateID;
        this.AppService.GET(url).subscribe(
          (resp: any) => {
            this.snackbar.open(resp.body.Message, '', {
              duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
            });
            this.spinner.hide();
            this.AskforSave = false;
            this.getTempDrop();
            this.OpenNewDoc();
          },
          err => {
            this.spinner.hide();
            console.log(err);
          }
        );
      }
      if (result == 2) {
        this.spinner.show();
        let url = 'LetterTemplate?TemplateID=' + this.selectedTemplate.TemplateID;
        this.AppService.DELETE(url).subscribe(
          (resp: any) => {
            this.snackbar.open(resp.body.Message, '', {
              duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
            });
            this.spinner.hide();
            this.getTempDrop();
            this.AskforSave = false;
            this.OpenNewDoc();
          },
          err => {
            this.spinner.hide();
            console.log(err);
          }
        );
      }
    });
    return false;
  }

  onChange(data, name) {
    setTimeout(() => {
      this.showDropdownTemplate = false;
      this.templateSelectData.SearchVal = name;
    }, 500);

    this.templateSelectData.SearchVal = name;
    this.TestButtonShow = true;
    if (data == '1') {
      this.selectedTemplate = '';
      this.templateSelectData = {
        value: '1',
        Subject: '',
        ReportType: '',
        width: '100',
        height: '100',
        SearchVal: ''
      }
      this.insertTokens = '';
      this.token = '';
      this.selectedmultipleToken = [];
      this.totalBookMarkList = [];
      return false;
    }
    this.spinner.show();
    let url = 'LetterTemplate?TemplateID=' + data;
    this.AppService.GET(url).subscribe(
      (resp: any) => {
        console.log(resp);

        this.spinner.hide();
        this.raisedFromDropDown = true;
        this.selectedTemplate = resp.body.Result;
        this.disableStatus = this.selectedTemplate.Disabled;
        this.fixedL = this.selectedTemplate.Fixed;
        this.AppService.setFixedLValue(this.fixedL);
        this.tempInitialFixed = this.selectedTemplate.Fixed;
        this.tempInitialDisable = this.selectedTemplate.Disabled;
        this.templateSelectData.SearchVal = this.selectedTemplate.TemplateName;
        this.envelop = this.selectedTemplate.Envelope;
        var documentAsBase64 = this.selectedTemplate.ContentB;
        this.rich.openDocument(documentAsBase64, 'myDoc.docx', DocumentFormat.OpenXml);

        this.rich.hasUnsavedChanges = true;
        this.templateSelectData.Subject = this.selectedTemplate.Subject;
        this.templateSelectData.value = data;
        // this.templateSelectData.ReportType = this.selectedTemplate.ReportType;
        if (this.saveOnTabChange) {
          this.router.navigate(['/']);
        }
        this.showDropdownTemplate = false
        for (let index = 0; index < this.TemplateList.length; index++) {
          const element = this.TemplateList[index];
          if (element.TemplateID == data) {
            this.renameIndex = index;
          }
        }
        console.log(this.ReportList);
        console.log(resp.body.Result.ReportType);

        for (let index = 0; index < this.ReportList.length; index++) {
          const element = this.ReportList[index];
          if (element.value == resp.body.Result.ReportType) {
            console.log(element);
            this.defaultReportList = element;
          }
        }
        setTimeout(() => {
          this.showDropdownTemplate = false;
          this.templateSelectData.SearchVal = this.selectedTemplate.TemplateName;
        }, 1500);

      },
      err => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }



  MakeBold() {
    var subDocument = richEdit.selection.activeSubDocument;
    var position = richEdit.selection.active;
    var characterProperties = {
      bold: true,
      fontName: richEdit.document.fonts.getByIndex(0).name,
    };

    richEdit.history.beginTransaction();
    richEdit.beginUpdate();
    var interval = subDocument.insertText(position, "Mathew Hayden");
    subDocument.setCharacterProperties(interval, characterProperties);
    richEdit.endUpdate();
    richEdit.history.endTransaction();
  }

  DeleteAll() {
    var subDocument = this.rich.selection.activeSubDocument;
    subDocument.deleteText(subDocument.interval);
  }

  OpenNewDoc() {
    this.AppService.setDocumentValue(false);
    let isFixedL = this.AppService.getFixedLValue();
    if (this.tempInitialFixed) {
      this.rich.newDocument();
      this.createNewTemp();
      return false;
    }
    if (!isFixedL && this.AskforSave) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: 'Do you want to save the current template?'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'closeButton') {
          return false;
        }
        if (result) {
          this.newButtonClicked = true;
          if (this.selectedTemplate) {
            this.SaveTemplate(false);
            this.resetPictureInfo = this.PictureList[0];
          }
          else {
            this.SaveTemplateAs();
            this.resetPictureInfo = this.PictureList[0];
          }
        }
        else {
          this.rich.newDocument();
          this.createNewTemp();
          this.resetVal = null;
          this.selectedTemplate = undefined;
          this.resetPictureInfo = this.PictureList[0];
          setTimeout(() => {

            this.onChange(1, '');
          }, 300);
        }
        this.GetTokenList(this.pickInfoId, this.searchKeyword);
        this.searchKeyword = '';
        this.token = '';
      });
      return false;
    }
    else {
      this.rich.newDocument();
      this.resetVal = null;
      this.selectedTemplate = undefined;
      this.createNewTemp();
      this.onChange(1, '');
      this.resetPictureInfo = this.PictureList[0];
    }
  }


  SaveTemplate(changeRoute: boolean) {
    if (!this.TestButtonShow) {
      this.snackbar.open('Test mode is on, Please click on Test Reset button to perform action', '', {
        duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
      });
      return false;
    }
    this.SaveAsFlag = false;
    this.rich.saveDocument();
    if (changeRoute) {
      this.saveOnTabChange = true;
    }
  }

  SaveTemplateAs() {
    // if (!this.TestButtonShow) {
    //   this.snackbar.open('Test mode is on, Please click on Test Reset to perform action', '', {
    //     duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: "success-dialog"
    //   });
    //   return false;
    // }
    this.SaveAsFlag = true;
    this.rich.saveDocument();
  }

  InsertBookMark() {
    this.BookMarkNumber++;
    var textInterval = this.rich.document.insertText(0, 'Test' + this.BookMarkNumber);
    var bookmark = this.rich.document.bookmarks.create(textInterval, 'TestBookMarkss' + this.BookMarkNumber);
  }

  outline() {
    console.log(this.picureSelectedName);
    var subDocument = this.rich.selection.activeSubDocument;
    var position = this.rich.selection.active;
    var width = this.rich.unitConverter.pixelsToTwips(this.templateSelectData.width);
    var height = this.rich.unitConverter.pixelsToTwips(this.templateSelectData.height);
    var size = new Size(width, height);
    //  var caption = 'A nice dog';
    // adds a figure caption and image description below the image
    function insertImageDescription(img, richEdit) {
      richEdit.document.insertParagraph(img.interval.start);
      var positionAfterImg = img.interval.start + 2;
      richEdit.document.insertParagraph(positionAfterImg);
      richEdit.document.insertText(positionAfterImg, ' ' + img.description);
      richEdit.selection.setSelection(positionAfterImg);
      richEdit.executeCommand(ReferencesTabCommandId.CreateFigureCaptionField);
      richEdit.document.insertParagraph(positionAfterImg);
    };
    var richEdit = this.rich;
    subDocument.images.createFloating(position, {
      url: this.picureSelected, actualSize: size, description: this.picureSelectedName, wrapType: WrapType.Square, callback: (function (img) { insertImageDescription(img, richEdit); })
    });
    // subDocument.images.createInline(position, {
    //   url: this.picureSelected, actualSize: size, description: '', callback: (function (img) { insertImageDescription(img, richEdit); })
    // });
  }

  openOptionsDialog() {
    const dialogRef = this.dialog.open(OptionsDialogComponent, {
      width: '900px'
    });
  }

  InsertClickPicture() {
    if (this.pictureStatus == 'outline') {
      this.outline();
      return false;
    }
    if (this.totalBookMarkList.length > 0) {
      for (let index = 0; index < this.totalBookMarkList.length; index++) {
        const element = this.totalBookMarkList[index];
        if (element == this.picureSelectedName) {
          this.picureSelectedName = this.picureSelectedName + 1;
        }
      }
    }

    var subDocument = this.rich.selection.activeSubDocument;
    var position = this.rich.selection.active;
    var width = this.rich.unitConverter.pixelsToTwips(this.templateSelectData.width);
    var height = this.rich.unitConverter.pixelsToTwips(this.templateSelectData.height);
    var size = new Size(width, height);
    let tt = position.toString();
    subDocument.insertPicture(position, this.picureSelected, size, function (interval) {
    });


    var textInterval = this.rich.document.insertText(position, '');
    var bookmark = this.rich.document.bookmarks.create(textInterval, this.picureSelectedName);
    this.totalBookMarkList.push(this.picureSelectedName);

  }

  OnImageInsertedCallback = e => {
    let subDocument = this.rich.selection.activeSubDocument;
    let images = subDocument.images.find(e.start);
    if (images == null || images.length <= 0) return;
    let image = images[0];
    let imageOriginalSize = image.originalSize;
    let newSize = image.actualSize;
    // if (imageOriginalSize.width >= imageOriginalSize.height) {
    newSize.width = imageOriginalSize.height * (image.actualSize.width / imageOriginalSize.width)
    // }
    // else {
    newSize.height = imageOriginalSize.width * (image.actualSize.height / imageOriginalSize.height)
    // }
    image.actualSize = newSize;
  }

  myclickPicture() {
    var width = this.rich.unitConverter.pixelsToTwips(this.templateSelectData.width);
    var height = this.rich.unitConverter.pixelsToTwips(this.templateSelectData.height);
    var size = new Size(width, height);
    var subDocument = this.rich.selection.activeSubDocument;
    var position = this.rich.selection.active;
    subDocument.images.createInline(position, { actualSize: size, description: "name", base64: '' });
  }

  ngOnDestroy() {
    if (this.rich) {
      this.rich.dispose();
      this.rich = null;
    }
  }

}





