import {Component} from '@angular/core';
import {Input,Inject,ElementRef} from "@angular/core";
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
    @Output('deselectall') deselectEvent:EventEmitter<DataItem>=new EventEmitter();
    @Output('selectpreceding') selectPrecedingEvent:EventEmitter<DataItem>=new EventEmitter();

    constructor(private _elementRef:ElementRef) {
    }


    get elementRef():ElementRef {
        return this._elementRef;
    }

    openDataItem(dataItem:DataItem){
        this.deselectEvent.emit(dataItem);
        this.openDataItemEvent.emit(dataItem);
    }

    selectDataItem(dataItem:DataItem,event:MouseEvent){
        if(event.shiftKey){
            dataItem.selected=true;
            this.selectPrecedingEvent.emit(dataItem);
        }else{
            if(event.metaKey){
                dataItem.selected=!dataItem.selected;
            }else{
                this.deselectEvent.emit(dataItem);
                dataItem.selected=true;
            }
        }
    }
}