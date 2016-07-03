/**
 * Created by NikhilVerma on 18/06/16.
 */
import {ScanTargetType} from "./scan-target-type";
import {DataItem} from "./data-item";
import {Folder} from "./folder";
import {SortOption} from "./sort-option";

export class ScanTarget{
    private _name:string;
    private _type:ScanTargetType;
    private _total:number;
    private _available:number;
    private _used:number;
    private _progress:number;
    private _rootScanResult:Folder;
    private _folderStack:Folder[]=[];
    private _sortOption:SortOption;


    constructor(name:string, type:ScanTargetType, total:number, used:number, progress:number) {
        this._name = name;
        this._type = type;
        this.total=total;
        this.available = total-used;
        this.used = used;
        this.progress = progress;
    }

    get name():string {
        return this._name;
    }

    get type():ScanTargetType {
        return this._type;
    }

    get total():number {
        return this._total;
    }

    set total(value:number) {
        this._total = value;
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


    get rootScanResult():Folder {
        return this._rootScanResult;
    }

    set rootScanResult(value:Folder) {
        this._rootScanResult = value;
    }

    get folderStack():Folder[] {
        return this._folderStack;
    }

    set folderStack(value:Array) {
        this._folderStack = value;
    }

    get sortOption():SortOption {
        return this._sortOption;
    }

    set sortOption(value:SortOption) {
        this._sortOption = value;
        this.folderStack[this.folderStack.length-1].sort(this.sortOption);
    }
}