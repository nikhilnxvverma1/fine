import { Component, OnInit } from '@angular/core';
import {Input,Inject,ElementRef} from "@angular/core";
import {DataItem} from "../../core/data-item";
import {Folder} from "../../core/folder";
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {IconFilePipe} from "../icon-file.pipe";

@Component({
  selector: 'app-data-item',
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.scss']
})
export class DataItemComponent {

    @Input('dataItem') dataItem:DataItem;
    @Output('opendataitem') openDataItemEvent=new EventEmitter<DataItem>();
    @Output('deselectall') deselectEvent=new EventEmitter<DataItem>();
    @Output('selectpreceding') selectPrecedingEvent=new EventEmitter<DataItem>();

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