import {Component,OnInit,ContentChild,ViewChild,AfterContentInit,OnChanges} from '@angular/core';
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
import {SunburstComponent} from "./sunburst.component";
import {UsageDetailComponent} from "./usage-detail.component";
import {ScanTarget} from "./core/scan-target";
import {OperationComponent} from "./operation.component";
import {ToggleStatus} from "./core/toggle-status";
import {trigger,state,style,transition,animate,keyframes} from "@angular/core";
import {Point} from "./core/point";
declare var $:any;

@Component({
    selector: 'folder-context',
    directives:[DataAreaComponent,InfoBoxComponent,DeletionComponent,OperationProgressComponent,SunburstComponent,
        OperationComponent,UsageDetailComponent,FORM_DIRECTIVES],
    templateUrl:'app/template/context.component.html',
    animations:[
        trigger("dataAreaToggle",[
            state("analyze",style({
                visibility:"collapse",
            })),
            state("organize",style({
                visibility:"visible"
            })),
            transition("analyze => organize",animate("0s 0.4s")),
            transition("organize => analyze",animate("0.4s"))
        ]),
        trigger("sunburstToggle",[
            state("analyze",style({
                visibility:"visible"
            })),
            state("organize",style({
                visibility:"collapse"
            })),
            transition("analyze => organize",animate("0.4s")),
            transition("organize => analyze",animate("0s 0.4s"))
        ]),
        trigger("organizeLabelToggle",[
            state("analyze",style({
                top:"0px"
            })),
            state("organize",style({
                top:"100px"
            })),
            transition("analyze => organize",animate("0.4s ease-out")),
            transition("organize => analyze",animate("0.4s ease-in"))
        ]),
        trigger("analyzeLabelToggle",[
            state("analyze",style({
                top:"100px"
            })),
            state("organize",style({
                top:"0px"
            })),
            transition("analyze => organize",animate("0.4s ease-out")),
            transition("organize => analyze",animate("0.4s ease-in"))
        ]),
    ]
})
export class ContextComponent implements AfterContentInit,OnChanges{

    @Input('scanTarget') private _scanTarget:ScanTarget;
    public context:Context=new Context();
    @Output('opendataitem') openDataItemEvent=new EventEmitter<DataItem>();
    @Output('jumpedToFolder') jumpedToFolderEvent=new EventEmitter<DataItem>();

    @ViewChild(OperationProgressComponent) operationProgress:OperationProgressComponent;
    @ViewChild(DataAreaComponent) private _dataAreaComponent:DataAreaComponent;
    @ViewChild(SunburstComponent) private _sunburstComponent:SunburstComponent;

    organizeFolder=false;

    toggleStatus=new ToggleStatus();


    constructor(@Inject private dataService:DataService,private _zone:NgZone) {}

    ngAfterContentInit() {
        // this.operationProgress is now with value set
    }

    ngOnChanges():any {
        console.log("Content did change in sunburst");
        return undefined;
    }

    getSunburstComponent():SunburstComponent{
        return this._sunburstComponent;
    }

    openDataItem(dataItem:DataItem){
        console.log("will open folder"+dataItem.name);
        this.openDataItemEvent.emit(dataItem);
        //if it came in the analyze section, the sunburst chart
        //this new sunburst chart will be applicable
        if(dataItem.isDirectory()){
            this._sunburstComponent.makeSunburst(this._scanTarget.displayTreeCurrent,false);
        }
    }

    toggleView(){
        this.organizeFolder=!this.organizeFolder;
        this.toggleStatus.inOrganizeState=!this.toggleStatus.inOrganizeState;
    }

    closeSortByMenu(){
        this._dataAreaComponent.isSortByMenuOpen=false;
    }

    sortBy(sortOption){
        this._scanTarget.sortOption=sortOption;
        console.log("Sort Option is "+sortOption);
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

    renameFiles(newName:string){
        console.log("rename all selected files to "+newName);
        //this.operationProgress.operationStarted(DataOperation.Rename);
        this.dataService.renameFiles(this.context.getSelectedFiles(),
            newName,
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

