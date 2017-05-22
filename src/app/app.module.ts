import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { IconFilePipe } from './icon-file.pipe';
import { PrefixRemoveSpacePipe } from './prefix-remove-space.pipe';
import { SelectedDataItemPipe } from './selected-data-item.pipe';
import { UnitSpacePipe } from './unit-space.pipe';

@NgModule({
  declarations: [
    AppComponent,
    IconFilePipe,
    PrefixRemoveSpacePipe,
    SelectedDataItemPipe,
    UnitSpacePipe
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
