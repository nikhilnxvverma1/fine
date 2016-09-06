/**
 * Created by NikhilVerma on 10/06/16.
 */

import {Component,Injectable,OnInit} from '@angular/core';
import {DataItem} from "./core/data-item";
import {Output,Input,EventEmitter} from "@angular/core";
import {ServiceProgress} from './core/service-progress'
import {DataOperation} from './core/data-operation'
import {ScanTarget} from "./core/scan-target";
declare var $:any;
declare var Materialize:any;

@Component({
    selector: 'operation-progress',
    templateUrl:'app/template/operation-progress.component.html',
})
export class OperationProgressComponent implements ServiceProgress,OnInit{
    ngOnInit():any {
        //noinspection TypeScriptUnresolvedFunction
        $('.tooltipped').tooltip({delay: 50});
        return undefined;
    }

    @Input('scanTarget') private _scanTarget:ScanTarget;
    private _currentOperation:string;
    public hide:boolean=true;
    public progress=0;
    @Output('removeFromContext') removeFromContext=new EventEmitter<DataItem>();

    operationStarted(operation:DataOperation){
        this.hide=false;
        this.progress=0;
    }

    beganProcessingDataItem(dataItem:DataItem,operation:DataOperation){
        this._currentOperation=this.stringForOperation(operation);
        $('#progressBarContainer').tooltip({tooltip:this._currentOperation});
    }

    processedDataItem(dataItem:DataItem,count:number,total:number, operation:DataOperation) {
        this.progress=(count / total)*100;
        this._currentOperation=this.stringForOperation(operation)+ " : "+Math.floor(this.progress)+"%";
        $('#progressBarContainer').tooltip({tooltip:this._currentOperation});
    }

    operationCompleted(total:number,operation:DataOperation) {
        //this.progress=0;//this will get reset later
        this.hide=true;
        switch(operation){
            case DataOperation.Rename:
                this.alertToast(total+' Files Renamed', 2000);
                break;
            case DataOperation.Group:
                this.alertToast(total+' Files Grouped', 2000);
                break;
            case DataOperation.Move:
                this.alertToast('Finished Moving '+total+' Files', 2000);
                break;
            case DataOperation.Copy:
                break;
            case DataOperation.Trash:
                this.alertToast(total+' Files Moved to Trash', 2000);
                break;
            case DataOperation.HardDelete:
                this.alertToast(total+' Files Deleted permanently', 2000);
                break;
        }
    }

    errorOnDataItem(err, dataItem:DataItem, operation:DataOperation) {
    }

    errorOnDataOperation(err, operation:DataOperation) {
    }

    alertToast(message:string,delay:number){
        Materialize.toast(message, delay);
    }

    private stringForOperation(operation):string {
        var operationString:string;
        switch (operation) {
            case DataOperation.Rename:
                operationString = "Rename";
                break;
            case DataOperation.Move:
                operationString = "Move";
                break;
            case DataOperation.Copy:
                operationString = "Copy";
                break;
            case DataOperation.Group:
                operationString = "Group";
                break;
            case DataOperation.Trash:
                operationString = "Trash";
                break;
            case DataOperation.HardDelete:
                operationString = "Delete";
                break;
        }
        return operationString;
    };
}