import {Component} from '@angular/core';
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {OnChanges} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";
import {DataItem} from "../../core/data-item";

import {SelectedDataItemPipe} from "../selected-data-item.pipe";
import {PrefixRemoveSpacePipe} from "../prefix-remove-space.pipe";
import {IconFilePipe} from "../icon-file.pipe";

@Component({
  selector: 'app-deletion',
  templateUrl: './deletion.component.html',
  styleUrls: ['./deletion.component.scss']
})
export class DeletionComponent{

    @Input('dataItems') public dataItems:DataItem[];
    @Output('trash') trash:EventEmitter<any>=new EventEmitter();
    @Output('hardDelete') hardDelete:EventEmitter<any>=new EventEmitter();

    constructor(private _zone:NgZone) {}

    trashSelectedFiles(){
        this.trash.emit(this);
    }

    hardDeleteSelectedFiles(){
        this.hardDelete.emit(this);
    }

}