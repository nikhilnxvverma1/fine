import {Component,OnInit} from 'angular2/core';
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

@Component({
    selector: 'app',
    templateUrl:'app/template/app.component.html',
    providers: [DataService],
    directives: [
        BreadcrumbComponent,
        ContextComponent
        //SelectionFieldComponent,
        //DataAreaComponent,
        //InfoBoxComponent
    ],
})
export class AppComponent implements OnInit{

    public rootModel:RootModel=new RootModel();

    //this is a patch for not having injections possible across multiple components
    //we should't "new" services
    private _dataService:DataService=new DataService();
    constructor(){
        this.rootModel=new RootModel();

    }
    //consuming the injection here will not make it available for its children
    constructor(private _dataService:DataService){}

    ngOnInit():any {

        //dom initializations
        //noinspection TypeScriptUnresolvedFunction
        $('.collapsible').collapsible({//ignore the red, the method is loaded before
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    }


    openDirectory(folder){
        console.log("about to open folder"+folder.name);
        var dataItems:DataItem[]=this._dataService.readDirectory(this.rootModel.getFullPathTillEnd()+'/'+folder.name);
        var context=new Context();//null context meaning root
        context.dataItems=dataItems;
        context.parentFolder=folder;
        //this.rootModel.contextStack.splice(0,this.rootModel.contextStack.length);
        this.rootModel.contextStack.push(context);
    }



}