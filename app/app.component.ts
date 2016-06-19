import {Component} from '@angular/core';
import {DataService} from './core/data.service'
import {InfoBoxComponent} from "./info-box.component";
import {DataAreaComponent} from "./data-area.component";
import {BreadcrumbComponent} from "./breadcrumb.component";
import {SelectionFieldComponent} from "./selection-field.component";
import {RootModel} from "./core/root-model";
import {Context} from "./core/context";
import {DataItem} from "./core/data-item";
import {Data} from "./core/data";
import {ContextComponent} from "./context.component";
import {Inject} from "@angular/core";
import {Folder} from "./core/folder";
import {MainMenuComponent} from "./main-menu.component";
import {ScanTarget} from "./core/scan-target";
import {DummyData} from "./core/dummy-data";

@Component({
    selector: 'app',
    templateUrl:'app/template/app.component.html',
    providers: [DataService],
    directives: [
        BreadcrumbComponent,
        ContextComponent,
        MainMenuComponent
    ],
})
export class AppComponent{

    public rootModel:RootModel=new RootModel();
    private _scanTargets:ScanTarget[];

    constructor(@Inject private _dataService:DataService){
        this.rootModel=new RootModel();

            var folderToOpen=['/Users/NikhilVerma/Desktop/dummy/'];
            if(folderToOpen==null) return;
            var dataItems:DataItem[]=this._dataService.readDirectory(folderToOpen[0]);//this also needs to happen inside ng zone
            this.rootModel.rootDirectory=folderToOpen[0];
            //create a new context holding the value of the root now
            var context=new Context();//null context meaning root
            context.dataItems=dataItems;
            this.rootModel.contextStack.splice(0,this.rootModel.contextStack.length);
            this.rootModel.contextStack.push(context);
            //this.contextStack.splice(0,this.rootModel.contextStack.length);
            //this.contextStack.push(context);
            console.log('RootModel Model folder(chan): '+this.rootModel.rootDirectory);

        let dummyData = new DummyData();
        this._scanTargets=dummyData.dummyScanTargets();
            this._scanTargets[0].rootScanResult=dummyData.dummyDataItems(6,7,5,"Users/NikhilVerma/Documents","My Data");
    }


    openDataItem(dataItem:DataItem){
        console.log("about to open dataItem"+dataItem.name);

        if(dataItem.isDirectory){

            let folderPath = dataItem.getFullyQualifiedPath()+'/';
            var dataItems:DataItem[]=this._dataService.readDirectory(folderPath);
            var context=new Context();//null context meaning root
            context.dataItems=dataItems;
            context.parentFolder=<Folder>dataItem;
            //this.rootModel.contextStack.splice(0,this.rootModel.contextStack.length);
            this.rootModel.contextStack.push(context);
        }else{

            //mind the subtle difference here. command line "open" requires those quotes for the full path
            let filePath=dataItem.getFullyQualifiedPath();
            var spawn = require('child_process').spawn
            spawn('open', [filePath]);
        }
    }



}