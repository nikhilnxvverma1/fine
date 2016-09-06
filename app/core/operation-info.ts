/**
 * Created by NikhilVerma on 11/07/16.
 */

import {Inject,NgZone} from "@angular/core";
import {DataOperation} from "./data-operation";
import {ServiceProgress} from "./service-progress";
import {ScanTarget} from "./scan-target";
import {DataItem} from "./data-item";

export class OperationInfo{
    protected _dataOperation:DataOperation;
    protected _scanTarget:ScanTarget;
    public count:number=0;
    private _total:number;
    public serviceProgress:ServiceProgress;
    public zone:NgZone;

    constructor(dataOperation:DataOperation,scanTarget:ScanTarget,total:number,serviceProgress:ServiceProgress,zone:NgZone) {
        this._dataOperation=dataOperation;
        this._scanTarget=scanTarget;
        this._total=total;
        this.serviceProgress = serviceProgress;
        this.zone=zone;
    }

    get total():number {
        return this._total;
    }

    get dataOperation():DataOperation {
        return this._dataOperation;
    }
}

export class DeleteOperationInfo extends OperationInfo{
    totalSizeDeletedSoFar=0;
}

export class MoveOperationInfo extends OperationInfo{
    movedDataItems:DataItem[]=[];
    totalSizeSoFar=0;
}