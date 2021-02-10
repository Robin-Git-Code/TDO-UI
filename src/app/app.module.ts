import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

// DevExtreme Angular
import {
  DxListModule, DxSelectBoxModule, DxTemplateModule, DxCheckBoxModule, DxTextAreaModule,
  DxNumberBoxModule, DxDateBoxModule, DxTabsModule, DxToolbarModule,
  DxFormModule, DxButtonModule, DxTextBoxModule, DxDropDownButtonModule, DxDataGridModule, DxBulletModule
} from 'devextreme-angular';


// Angular material
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';

//NGX
import { NgxSpinnerModule } from "ngx-spinner";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Angular pipes
import { DatePipe } from '@angular/common';
import { FilterPipe } from './common/pipes/filter-pipe';

//Components & Dialogs
import { AppComponent } from './app.component';
import { TemplateComponent } from './components/template/template.component';
import { NewletterComponent } from './components/newletter/newletter.component';
import { HeaderComponent } from './common/header/header';

import { ParagraphDialogComponent } from './common/dialogs/paragraph/paragraph.dialog';
import { OptionsDialogComponent } from './common/dialogs/options/options.dialog';
import { MatchDialogComponent } from './common/dialogs/match/match.dialog';
import { ListingDialogComponent } from './common/dialogs/listing/listing.dialog';
import { ConfirmDialogComponent } from './common/dialogs/confirm/confirm.dialog';
import { AddTemplateDialogComponent } from './common/dialogs/add-template/add-template.dialog';
import { MailsetsDialogComponent } from './common/dialogs/mailsets/mail-sets.dialog';
import { MailSetOptionsDialogComponent } from './common/dialogs/mail-set-options/mail-set-options.dialog';
import { PickNoteDialogComponent } from './common/dialogs/pick-note/pick-note.dialog';
import { EditListDialogComponent } from './common/dialogs/edit-list/edit-list.dialog';
import { PickpictureDialogComponent } from './common/dialogs/pick-picture/pick-picture.dialog';
import { BatchLetterDialogComponent } from './common/dialogs/batch-letter/batch-letter.dialog';
import { LetterListDialogComponent } from './common/dialogs/letter-list/letter-list.dialog';
import { MailSetOptionstmplateDialogComponent } from './common/dialogs/mail-set-template-list/mail-set-template-list';
import { DescriptionLetterDialogComponent } from './common/dialogs/description-letter/description-letter.dialog';
import { DeleteDialogComponent } from './common/dialogs/delete-template/delete-template';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    FilterPipe,
    AppComponent,
    TemplateComponent, ListingDialogComponent, MatchDialogComponent, HeaderComponent,
    AddTemplateDialogComponent, ParagraphDialogComponent, OptionsDialogComponent, ConfirmDialogComponent, NewletterComponent, MailsetsDialogComponent, LetterListDialogComponent, BatchLetterDialogComponent, PickpictureDialogComponent, MailSetOptionstmplateDialogComponent, MailSetOptionsDialogComponent, EditListDialogComponent, DeleteDialogComponent, PickNoteDialogComponent, DescriptionLetterDialogComponent
  ],
  imports: [
    BrowserModule, InfiniteScrollModule, AppRoutingModule, MatDialogModule, MatSnackBarModule, MatRadioModule, MatSelectModule, MatListModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatInputModule, BrowserAnimationsModule, NgxSpinnerModule, MatTooltipModule, HttpClientModule, MatAutocompleteModule, MatGridListModule, DxBulletModule,
    DxListModule, DxTabsModule, DxTemplateModule, MatTabsModule, DxCheckBoxModule, DxTextAreaModule,
    DxSelectBoxModule, DxToolbarModule, DxDropDownButtonModule, DxDateBoxModule, MatPaginatorModule, DxButtonModule, MatTableModule, DragDropModule,
    DxNumberBoxModule, MatCheckboxModule, DxTextBoxModule,
    DxFormModule, MatMenuModule, DxDataGridModule, MatIconModule
  ],
  providers: [DatePipe, NewletterComponent],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
