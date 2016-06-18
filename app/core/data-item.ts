import {Stats} from "fs";
import {Timestamp} from "rxjs/Rx.KitchenSink";
export abstract class DataItem{
    private _parentUrl:string;
    private _name:string;
    private _isDirectory:boolean;
    private _selected:boolean;

    private _creationDate:Date;
    private _modifiedDate:Date;
    private _size:number;

    constructor(parentUrl:string, name:string,stats:Stats) {
        this.parentUrl = parentUrl;
        this.name = name;
        if(stats!=null){
            this._creationDate=stats.birthtime;
            this._modifiedDate=stats.mtime;
            this._size=stats.blksize
        }
    }

    get parentUrl():string {
        return this._parentUrl;
    }

    set parentUrl(value:string) {
        this._parentUrl = value;
    }

    get name():string {
        return this._name;
    }

    set name(value:string) {
        this._name = value;
    }

    get isDirectory():boolean {
        return this._isDirectory;
    }

    set isDirectory(value:boolean) {
        this._isDirectory = value;
    }

    get selected():boolean {
        return this._selected;
    }

    set selected(value:boolean) {
        this._selected = value;
    }


    get creationDate():Date {
        return this._creationDate;
    }

    set creationDate(value:Date) {
        this._creationDate = value;
    }

    get modifiedDate():Date {
        return this._modifiedDate;
    }

    set modifiedDate(value:Date) {
        this._modifiedDate = value;
    }

    get size():number {
        return this._size;
    }

    set size(value:number) {
        this._size = value;
    }

    getFullyQualifiedPath():string{
        return this._parentUrl+this._name;
    }
}