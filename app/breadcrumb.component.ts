import {Component} from 'angular2/core';
import {DataService} from "./core/data.service";
import {RootModel} from "./core/root-model";
import {Input} from "angular2/core";
import {DataItem} from "./core/data-item";
import {Context} from "./core/context";
import {Data} from "./core/data";

@Component({
    inputs:['rootModel'],
    selector: 'breadcrumb',
    templateUrl:'app/template/breadcrumb.component.html'
})
export class BreadcrumbComponent {

    public rootModel:RootModel;

    constructor(private _dataService: DataService) { }

    openRoot(){
        var remote=require('remote');
        var dialog=remote.require('dialog');
        dialog.showOpenDialog({ properties: ['openDirectory']},(folderToOpen)=>{
            var dataItems:DataItem[]=this._dataService.readDirectory(folderToOpen[0]);
            this.rootModel.rootDirectory=folderToOpen[0];
            //create a new context holding the value of the root now
            var context=new Context();//null context meaning root
            context.data=new Data(dataItems);
            this.rootModel.contextStack.splice(0,this.rootModel.contextStack.length);
            this.rootModel.contextStack.push(context);
            console.log('RootModel Model folder: '+this.rootModel.rootDirectory);
        });
    }
}