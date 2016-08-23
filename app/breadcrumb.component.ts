import {Component} from '@angular/core';
import {DataService} from "./core/data.service";
import {RootModel} from "./core/root-model";
import {Input} from "@angular/core";
import {DataItem} from "./core/data-item";
import {Context} from "./core/context";
import {Data} from "./core/data";
import {Output,EventEmitter} from "@angular/core";
import {ContextComponent} from "./context.component";
import {OnChanges} from "@angular/core";
import {ChangeDetectorRef} from "@angular/core";
import {NgZone} from "@angular/core";
import {ScanTarget} from "./core/scan-target";
import {Folder} from "./core/folder";

@Component({
    selector: 'breadcrumb',
    directives:[ContextComponent],
    templateUrl:'app/template/breadcrumb.component.html',
    providers:[ChangeDetectorRef]
})
export class BreadcrumbComponent{

    //@Input('menuState') private _menuState:string;
    @Input('scanTarget') private _scanTarget:ScanTarget;
    @Input('rootModel') public rootModel:RootModel;
    @Input('contextStack') public contextStack:Context[];
    @Output('opendataitem') openDataItemEvent=new EventEmitter<DataItem>();
    @Output('openMainMenu') openMainMenuEvent=new EventEmitter<BreadcrumbComponent>();
    

    constructor(private _dataService: DataService,private _zone:NgZone) {}

    openRoot(){

        var dialog=require('electron').remote.dialog;

        dialog.showOpenDialog({ properties: ['openDirectory']},(folderToOpen)=>{
            this._zone.run(()=>{

                if(folderToOpen==null) return;
                var dataItems:DataItem[]=this._dataService.readDirectory(folderToOpen[0]);//this also needs to happen inside ng zone
                this.rootModel.rootDirectory=folderToOpen[0];
                //create a new context holding the value of the root now
                var context=new Context();//null context meaning root
                context.dataItems=dataItems;
                //this.rootModel.contextStack.splice(0,this.rootModel.contextStack.length);
                //this.rootModel.contextStack.push(context);
                this.contextStack.splice(0,this.rootModel.contextStack.length);
                this.contextStack.push(context);
                console.log('RootModel Model folder: '+this.rootModel.rootDirectory);

            });
        });
    }

    backTo(folder:Folder){

        var index:number=this._scanTarget.folderStack.indexOf(folder);
        if(index==this._scanTarget.folderStack.length-1) return;

        this._scanTarget.folderStack.splice(index+1,this._scanTarget.folderStack.length);
    }

    openDataItem(dataItem:DataItem){

        if(dataItem.isDirectory()){
            (<Folder>dataItem).sort(this._scanTarget.sortOption,false,false);
            this._scanTarget.folderStack.push(<Folder>dataItem);
        }else{

            //mind the subtle difference here. command line "open" requires those quotes for the full path
            let filePath=dataItem.getFullyQualifiedPath();
            var spawn = require('child_process').spawn;
            spawn('open', [filePath]);
        }
    }

    openMainMenu(){
        this.openMainMenuEvent.emit(this);
    }

}