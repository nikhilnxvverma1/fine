/**
 * Created by NikhilVerma on 10/06/16.
 */

import {Component,Injectable} from '@angular/core';
import {DataItem} from "./core/data-item";
import {Output,EventEmitter} from "@angular/core";
import {ServiceProgress} from './core/service-progress'
import {DataOperation} from './core/data-operation'

@Component({
    selector: 'operation-progress',
    templateUrl:'app/template/operation-progress.component.html',
})
export class OperationProgressComponent implements ServiceProgress{

    public hide:boolean=true;
    public progress=0;
    @Output('removeFromContext') removeFromContext:EventEmitter<DataItem>=new EventEmitter();

    operationStarted(operation:DataOperation){
        console.log("Service Progress:operation started");
        this.hide=false;
        this.progress=0;
    }

    beganProcessingDataItem(dataItem:DataItem,operation:DataOperation){
        switch(operation){
            case DataOperation.Rename:
                break;
            case DataOperation.Group:
                this.removeFromContext.emit(dataItem);
                break;
            case DataOperation.Move:
                this.removeFromContext.emit(dataItem);
                break;
            case DataOperation.Copy:
                break;
            case DataOperation.Trash:
                this.removeFromContext.emit(dataItem);
                break;
            case DataOperation.HardDelete:
                this.removeFromContext.emit(dataItem);
                break;
        }
    }

    processedDataItem(count:number,total:number, operation:DataOperation) {
        this.progress=(count / total)*100;
        console.log("Service Progress:processed item: "+this.progress+"%");
    }

    operationCompleted(total:number,operation:DataOperation) {
        //this.progress=0;//this will get reset later
        this.hide=true;
        switch(operation){
            case DataOperation.Rename:
                this.alertToast(total+' Files Renamed', 4000);
                break;
            case DataOperation.Group:
                this.alertToast(total+' Files Grouped', 4000);
                break;
            case DataOperation.Move:
                this.alertToast('Finished Moving '+total+' Files', 4000);
                break;
            case DataOperation.Copy:
                break;
            case DataOperation.Trash:
                this.alertToast(total+' Files Moved to Trash', 4000);
                break;
            case DataOperation.HardDelete:
                this.alertToast(total+' Files Deleted permanently', 4000);
                break;
        }
        console.log("Service Progress:operation completed");
    }

    errorOnDataItem(err, dataItem:DataItem, operation:DataOperation) {
    }

    errorOnDataOperation(err, operation:DataOperation) {
    }

    alertToast(message:string,delay:number){
        Materialize.toast(message, delay);
    }
}