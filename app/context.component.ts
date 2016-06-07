import {Component} from '@angular/core';
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

@Component({
    selector: 'folder-context',
    directives:[SelectionFieldComponent,DataAreaComponent,InfoBoxComponent],
    templateUrl:'app/template/context.component.html',
})
export class ContextComponent {

    @Input('context') public context:Context;
    @Output('opendataitem') openDataItemEvent:EventEmitter=new EventEmitter();

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

}