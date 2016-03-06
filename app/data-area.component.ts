import {Component,OnInit} from 'angular2/core';
import {DataItemComponent} from "./data-item.component";
import {Input} from "angular2/core";
import {Context} from "./core/context";
import {RootModel} from "./core/root-model";
import {OnChanges} from "angular2/core";
import {Data} from "./core/data";

@Component({
    selector: 'data-area',
    templateUrl:'app/template/data-area.component.html',
    directives: [DataItemComponent]

})
export class DataAreaComponent implements OnInit,OnChanges{
    ngOnChanges(changes:{}):any {
        console.log("Changes made to the rootmodel");
        return undefined;
    }
    ngOnInit():any {
        return undefined;
    }

    @Input('context') public context:Context;

    addNewContext(folder){
        console.log("will open folder"+folder);
    }

}