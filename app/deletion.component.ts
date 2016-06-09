/**
 * Created by NikhilVerma on 08/06/16.
 */

import {Component} from '@angular/core';
import {DataItem} from "./core/data-item";
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {OnChanges} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";

import {SelectedDataItem} from "./pipe/selected-data-item.pipe";
import {PrefixAndRemoveSpace} from "./pipe/prefix-remove-space.pipe";

@Component({
    selector: 'deletion',
    templateUrl:'app/template/deletion.component.html',
    pipes: [SelectedDataItem,PrefixAndRemoveSpace]
})
export class DeletionComponent implements OnChanges{

    @Input('dataItems') public dataItems:DataItem[];
    @Output('trash') trash:EventEmitter=new EventEmitter();
    @Output('hardDelete') hardDelete:EventEmitter=new EventEmitter();

    ngOnChanges(changes:{}):any {
        console.log("Changes made to the rootmodel(inside deletion) len="+this.dataItems.length);
        return undefined;
    }

    constructor(private _zone:NgZone) {}

    trashSelectedFiles(){
        this.trash.emit(this);
    }

    hardDeleteSelectedFiles(){
        this.hardDelete.emit(this);
    }

}