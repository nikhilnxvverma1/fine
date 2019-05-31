import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { DataService } from './core/data.service';

import { IconFilePipe } from './components/icon-file.pipe';
import { PrefixRemoveSpacePipe } from './components/prefix-remove-space.pipe';
import { SelectedDataItemPipe } from './components/selected-data-item.pipe';
import { UnitSpacePipe } from './components/unit-space.pipe';
import { InfoBoxComponent } from './components/info-box/info-box.component';
import { DataAreaComponent } from './components/data-area/data-area.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { SelectionFieldComponent } from './components/selection-field/selection-field.component';
import { ContextComponent } from './components/context/context.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { DeletionComponent } from './components/deletion/deletion.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { OperationComponent } from './components/operation/operation.component';
import { OperationProgressComponent } from './components/operation-progress/operation-progress.component';
import { SunburstComponent } from './components/sunburst/sunburst.component';
import { UsageDetailsComponent } from './components/usage-details/usage-details.component';
import { DataItemComponent } from './components/data-item/data-item.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
	WebviewDirective,
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
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [ElectronService,DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
