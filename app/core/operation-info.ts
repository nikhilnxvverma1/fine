/**
 * Created by NikhilVerma on 11/07/16.
 */

import {Inject,NgZone} from "@angular/core";
import {DataOperation} from "./data-operation";
import {ServiceProgress} from "./service-progress";

export class OperationInfo{
    private _dataOperation:DataOperation;
    public count:number=0;
    private _total:number;
    public serviceProgress:ServiceProgress;
    public zone:NgZone;

    constructor(dataOperation:DataOperation,total:number,serviceProgress:ServiceProgress,zone:NgZone) {
        this._dataOperation=dataOperation;
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

