import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { IconFilePipe } from './icon-file.pipe';
import { PrefixRemoveSpacePipe } from './prefix-remove-space.pipe';
import { SelectedDataItemPipe } from './selected-data-item.pipe';
import { UnitSpacePipe } from './unit-space.pipe';
import { InfoBoxComponent } from './info-box/info-box.component';
import { DataAreaComponent } from './data-area/data-area.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SelectionFieldComponent } from './selection-field/selection-field.component';
import { ContextComponent } from './context/context.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { DeletionComponent } from './deletion/deletion.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { OperationComponent } from './operation/operation.component';
import { OperationProgressComponent } from './operation-progress/operation-progress.component';
import { SunburstComponent } from './sunburst/sunburst.component';
import { UsageDetailsComponent } from './usage-details/usage-details.component';
import { DataItemComponent } from './data-item/data-item.component';

@NgModule({
  declarations: [
    AppComponent,
    IconFilePipe,
    PrefixRemoveSpacePipe,
    SelectedDataItemPipe,
    UnitSpacePipe,
    InfoBoxComponent,
    DataAreaComponent,
    BreadcrumbComponent,
    SelectionFieldComponent,
    ContextComponent,
    MainMenuComponent,
    DeletionComponent,
    FeedbackComponent,
    OperationComponent,
    OperationProgressComponent,
    SunburstComponent,
    UsageDetailsComponent,
    DataItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
