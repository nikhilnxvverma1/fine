import {Component,OnInit,ContentChild,ViewChild,AfterContentInit} from '@angular/core';
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
import {Inject,NgZone} from "@angular/core";
import {SelectedDataItem} from "./pipe/selected-data-item.pipe";
import {DeletionComponent} from "./deletion.component";
import { FORM_DIRECTIVES } from '@angular/common';
import {OperationProgressComponent} from "./operation-progress.component";
import {DataOperation} from './core/data-operation'
//TODO remove if unneeded

@Component({
    selector: 'folder-context',
    directives:[DataAreaComponent,InfoBoxComponent,DeletionComponent,OperationProgressComponent,FORM_DIRECTIVES],
    templateUrl:'app/template/context.component.html',
})
export class ContextComponent implements OnInit,AfterContentInit{

    @Input('context') public context:Context;
    @Output('opendataitem') openDataItemEvent:EventEmitter=new EventEmitter();
    rename:string='';
    @ViewChild(OperationProgressComponent) operationProgress:OperationProgressComponent;


    constructor(@Inject private dataService:DataService,private _zone:NgZone) {}

    ngOnInit():any {

        //initialization of the collapsible popouts
        //noinspection TypeScriptUnresolvedFunction
        $('.collapsible').collapsible({//ignore the red, the method is loaded before
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    }
    ngAfterContentInit() {
        // this.operationProgress is now with value set
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

    groupInFolder(folderName:string){
        if(folderName==null||folderName.length==0){
            return;
        }
        var selectedDataItems=this.context.getSelectedFiles();
        if(selectedDataItems==null||selectedDataItems.length==0){
            return;
        }
        var parentFolder:string=selectedDataItems[0].parentUrl;
        var newDirectory=parentFolder+folderName+'/';
        console.log("Moving selected files to Location: "+newDirectory);
        this.dataService.moveFiles(selectedDataItems,
            newDirectory,
            true,
            this.operationProgress,
            DataOperation.Group
        );
    }

    moveToLocation(deleteAfterMoving:boolean){
        var dialog=require('electron').remote.dialog;
        var moveOrCopy:DataOperation;
        if(deleteAfterMoving){
            moveOrCopy=DataOperation.Move;
        }else{
            moveOrCopy=DataOperation.Copy;
        }

        dialog.showOpenDialog({ properties: ['openDirectory']},(folderToOpen)=>{
            this._zone.run(()=>{
                console.log('Will move to folder: '+folderToOpen[0]+" delete after: "+deleteAfterMoving);
                this.dataService.moveFiles(this.context.getSelectedFiles(),
                    folderToOpen[0]+'/',
                    deleteAfterMoving,
                    this.operationProgress,
                    moveOrCopy);
            });
        });
    }

    moveToTrash(){
        console.log("Moving selected files to trash");
        this.dataService.deleteFiles(this.context.getSelectedFiles(),
            false,
            this.operationProgress,
            DataOperation.Trash);
    }

    renameFiles(){
        console.log("rename all selected files to "+this.rename);
        //this.operationProgress.operationStarted(DataOperation.Rename);
        this.dataService.renameFiles(this.context.getSelectedFiles(),
            this.rename,
            this.operationProgress,
            DataOperation.Rename);
    }

    deletePermenantly(){
        console.log("Delete selected files");
        this.dataService.deleteFiles(this.context.getSelectedFiles(),
            true,
            this.operationProgress,
            DataOperation.HardDelete);
    }

    confirmDeletingFiles(){
        //noinspection TypeScriptUnresolvedFunction
        $('#confirmDeleteModal').openModal();
    }

    removeFromContext(dataItem:DataItem){
        var index=this.context.dataItems.indexOf(dataItem);
        this.context.dataItems.splice(index,1);
        console.log("removed data item from context index"+index);
    }

}