import {Component,OnInit} from '@angular/core';
import {DataItemComponent} from "./data-item.component";
import {Input} from "@angular/core";
import {Context} from "./core/context";
import {RootModel} from "./core/root-model";
import {OnChanges} from "@angular/core";
import {Data} from "./core/data";
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {DataItem} from "./core/data-item";

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

    //@Input('context') public context:Context;
    @Input('dataItems') public dataItems:DataItem[];
    @Output('opendataitem') openDataItemEvent:EventEmitter=new EventEmitter();

    openDataItem(dataItem){
        console.log("will open data item"+dataItem.name);
        this.openDataItemEvent.emit(dataItem);
    }

}