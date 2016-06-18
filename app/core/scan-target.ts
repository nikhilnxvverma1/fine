/**
 * Created by NikhilVerma on 18/06/16.
 */
import {ScanTargetType} from "./scan-target-type";
import {DataItem} from "./data-item";

export class ScanTarget{
    private _name:string;
    private _type:ScanTargetType;
    private _available:number;
    private _used:number;
    private _progress:number;
    private _rootScanResult:DataItem;


    constructor(name:string, type:ScanTargetType, available:number, used:number, progress:number) {
        this._name = name;
        this._type = type;
        this.available = available;
        this.used = used;
        this.progress = progress;
    }

    get name():string {
        return this._name;
    }

    get type():ScanTargetType {
        return this._type;
    }

    get available():number {
        return this._available;
    }

    set available(value:number) {
        this._available = value;
    }

    get used():number {
        return this._used;
    }

    set used(value:number) {
        this._used = value;
    }

    get progress():number {
        return this._progress;
    }

    set progress(value:number) {
        this._progress = value;
    }


    get rootScanResult():DataItem {
        return this._rootScanResult;
    }

    set rootScanResult(value:DataItem) {
        this._rootScanResult = value;
    }
}