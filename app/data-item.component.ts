import {Component} from 'angular2/core';
import {Input} from "angular2/core";
import {DataItem} from "./core/data-item";
import {Folder} from "./core/folder";
import {Output} from "angular2/core";
import {EventEmitter} from "angular2/core";

@Component({
    selector: 'data-item',
    templateUrl:'app/template/data-item.component.html'
})
export class DataItemComponent {

    @Input('dataItem') dataItem:DataItem;
    @Output('opendataitem') openDataItemEvent:EventEmitter<DataItem>=new EventEmitter();

    openDataItem(dataItem:DataItem){
        this.openDataItemEvent.emit(dataItem);
    }
}