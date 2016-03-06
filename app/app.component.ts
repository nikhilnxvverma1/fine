import {Component,OnInit} from 'angular2/core';
import {DataService} from './core/data.service'
import {InfoBoxComponent} from "./info-box.component";
import {DataAreaComponent} from "./data-area.component";
import {BreadcrumbComponent} from "./breadcrumb.component";
import {SelectionFieldComponent} from "./selection-field.component";
import {RootModel} from "./core/root-model";

@Component({
    selector: 'app',
    templateUrl:'app/template/app.component.html',
    providers: [DataService],
    directives: [
        BreadcrumbComponent,
        SelectionFieldComponent,
        DataAreaComponent,
        InfoBoxComponent
    ],
})
export class AppComponent implements OnInit{

    public rootModel:RootModel=new RootModel();

    constructor(){
        this.rootModel=new RootModel();
    }
    //consuming the injection here will not make it available for its children
    //constructor(private _dataService:DataService){}
    ngOnInit():any {

        //dom initializations
        //noinspection TypeScriptUnresolvedFunction
        $('.collapsible').collapsible({//ignore the red, the method is loaded before
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
        //this.rootModel=new RootModel();
    }


}