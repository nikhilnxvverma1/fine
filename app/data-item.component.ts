import {Component} from '@angular/core';
import {Input} from "@angular/core";
import {DataItem} from "./core/data-item";
import {Folder} from "./core/folder";
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";

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