import {Component,OnInit} from '@angular/core';
import {DataService} from "./core/data.service";
import {RootModel} from "./core/root-model";
import {Input} from "@angular/core";
import {DataItem} from "./core/data-item";
import {Context} from "./core/context";
import {Data} from "./core/data";
import {SelectionFieldComponent} from "./selection-field.component";
import {DataAreaComponent} from "./data-area.component";
import {InfoBoxComponent} from "./info-box.component";
import {Output,EventEmitter} from "@angular/core";
import {Tag} from "./core/tag";
import {NgZone} from "@angular/core";
import {SelectedDataItem} from "./pipe/selected-data-item.pipe";
import {DeletionComponent} from "./deletion.component";
import { FORM_DIRECTIVES } from '@angular/common';

@Component({
    selector: 'folder-context',
    directives:[DataAreaComponent,InfoBoxComponent,DeletionComponent,FORM_DIRECTIVES],
    templateUrl:'app/template/context.component.html',
})
export class ContextComponent implements OnInit{

    @Input('context') public context:Context;
    @Output('opendataitem') openDataItemEvent:EventEmitter=new EventEmitter();

    constructor(private _zone:NgZone) {}

    ngOnInit():any {

        //initialization of the collapsible popouts
        //noinspection TypeScriptUnresolvedFunction
        $('.collapsible').collapsible({//ignore the red, the method is loaded before
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    }

    openDataItem(dataItem:DataItem){
        console.log("will open folder"+dataItem.name);
        this.openDataItemEvent.emit(dataItem);
    }

    incrementDataItemsQualifying(tag:Tag){
      console.log('will increment items qualifiying '+tag.name);
        this.matchForTagAndAdd(tag,1);
    }

    decrementDataItemsQualifying(tag:Tag){
        console.log('will decrement items qualifiying '+tag.name);
        this.matchForTagAndAdd(tag,-1);
    }

    matchForTagAndAdd(tag:Tag, increment:number){
        for(var i=0;i<this.context.dataItems.length;i++){
            var dataItem:DataItem=this.context.dataItems[i];
            var dataItemName=dataItem.name.toLowerCase();
            var tagName=tag.name.toLowerCase();
            var position =dataItemName.search(tagName);
            if(position!=-1){
                dataItem.qualifyingTags+=increment;
            }
        }
        console.log("List o selected files are :");
        var selected=this.context.getSelectedFiles();
        for(var i=0;i<selected.length;i++){
            console.log(selected[i].name);
        }

    }

    moveToLocation(){
        var dialog=require('electron').remote.dialog;

        dialog.showOpenDialog({ properties: ['openDirectory']},(folderToOpen)=>{
            this._zone.run(()=>{
                console.log('Will move to folder: '+folderToOpen);

            });
        });
    }

    confirmDeletingFiles(){
        $('#confirmDeleteModal').openModal();
    }

}