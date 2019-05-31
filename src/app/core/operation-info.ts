/**
 * Created by NikhilVerma on 11/07/16.
 */

import {Inject,NgZone} from "@angular/core";
import {DataOperation} from "./data-operation";
import {ServiceProgress} from "./service-progress";
import {ScanTarget} from "./scan-target";
import {DataItem} from "./data-item";
import {Folder} from "./folder";

export class OperationInfo{
    protected _dataOperation:DataOperation;
    private _scanTarget:ScanTarget;
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

    get scanTarget():ScanTarget {
        return this._scanTarget;
    }
}

export class DeleteOperationInfo extends OperationInfo{
    totalSizeDeletedSoFar=0;
}

export class MoveOperationInfo extends OperationInfo{
    folderToMoveTo:Folder;
    movedDataItems:DataItem[]=[];
    totalSizeSoFar=0;

    constructor(dataOperation:DataOperation,scanTarget:ScanTarget,
                total:number,serviceProgress:ServiceProgress,zone:NgZone,folderToMoveTo:Folder) {
        super(dataOperation,scanTarget,total,serviceProgress,zone);
        this.folderToMoveTo=folderToMoveTo;
    }
}