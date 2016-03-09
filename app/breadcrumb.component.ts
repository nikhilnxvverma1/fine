import {Component} from 'angular2/core';
import {DataService} from "./core/data.service";
import {RootModel} from "./core/root-model";
import {Input} from "angular2/core";
import {DataItem} from "./core/data-item";
import {Context} from "./core/context";
import {Data} from "./core/data";
import {Output,EventEmitter} from "angular2/core";
import {ContextComponent} from "./context.component";
import {OnChanges} from "angular2/core";
import {ChangeDetectorRef} from "angular2/core";
import {NgZone} from "angular2/core";

@Component({
    selector: 'breadcrumb',
    directives:[ContextComponent],
    templateUrl:'app/template/breadcrumb.component.html',
    providers:[ChangeDetectorRef]
})
export class BreadcrumbComponent{

    @Input('rootModel') public rootModel:RootModel;
    @Input('contextStack') public contextStack:Context[];
    @Output('opendataitem') openDataItemEvent:EventEmitter=new EventEmitter();

    constructor(private _dataService: DataService,private _zone:NgZone) {}

    openRoot(){

        var remote=require('remote');
        var dialog=remote.require('dialog');

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

    backTo(context){

        var index:number=this.contextStack.indexOf(context);
        if(index==this.contextStack.length-1) return;

        this.contextStack.splice(index+1,this.contextStack.length);
    }

    openDataItem(dataItem){
        console.log("will open data item"+dataItem.name);
        this.openDataItemEvent.emit(dataItem);
    }

}