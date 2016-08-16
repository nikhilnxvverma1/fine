import {Stats} from "fs";
import {Timestamp} from "rxjs/Rx.KitchenSink";
import {SortOption} from "./sort-option";
import {Folder} from "./folder";
export abstract class DataItem{
    private _parentUrl:string;
    private _name:string;
    private _selected:boolean;
    protected _parent:Folder;

    private _creationDate:Date;
    private _modifiedDate:Date;
    private _size:number=0;

    constructor(name:string) {
        this._name = name;
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

    get selected():boolean {
        return this._selected;
    }

    set selected(value:boolean) {
        this._selected = value;
    }

    get parent():Folder {
        return this._parent;
    }

    set parent(value:Folder) {
        this._parent = value;
        this.parentChangedTo(value);
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

    isDirectory():boolean {
        return false;
    }

    protected parentChangedTo(newParent:Folder){
        this.parentUrl=newParent.parentUrl+newParent.name+'/';
    }


    /**
     * @returns {string} gives the fully qualified path without the trailing slash
     */
    public getFullyQualifiedPath():string{
        return this._parentUrl+this._name;
    }

    public setStatsInfo(stats:Stats){
        this._creationDate=stats.birthtime;
        this._modifiedDate=stats.mtime;
        this._size=stats.size;
    }

    public lessThan(dataItem:DataItem,sortOption:SortOption):boolean{
        switch (sortOption){
            case SortOption.Size:
                return this.size<dataItem.size;
            case SortOption.Type:
            {
                var thisExtension=this.getExtension().toLowerCase();
                var otherExtension=dataItem.getExtension().toLowerCase();
                return thisExtension.localeCompare(otherExtension)==-1;
                //if(this._isDirectory){
                //    return true;
                //}else if(dataItem._isDirectory){
                //    return false;
                //}else{
                //    var thisExtension=this.getExtension().toLowerCase();
                //    var otherExtension=dataItem.getExtension().toLowerCase();
                //    return thisExtension.localeCompare(otherExtension)==-1;
                //}
            }
            case SortOption.Name:
            {
                var thisExtension=this.name.toLowerCase();
                var otherExtension=dataItem.name.toLowerCase();
                return this.name.localeCompare(dataItem.name)==-1;
            }
            case SortOption.CreationDate:
                return this.creationDate<dataItem.creationDate;
            case SortOption.ModificationDate:
                return this.modifiedDate<dataItem.modifiedDate;
        }
    }

    public greaterThan(dataItem:DataItem,sortOption:SortOption):boolean{
        switch (sortOption){
            case SortOption.Size:
                return this.size>dataItem.size;
            case SortOption.Type:
            {
                var thisExtension=this.getExtension().toLowerCase();
                var otherExtension=dataItem.getExtension().toLowerCase();
                return thisExtension.localeCompare(otherExtension)==1;

                //if(this._isDirectory){
                //    return false;
                //}else if(dataItem._isDirectory){
                //    return true;
                //}else{
                //    var thisExtension=this.getExtension().toLowerCase();
                //    var otherExtension=dataItem.getExtension().toLowerCase();
                //    return thisExtension.localeCompare(otherExtension)==1;
                //}
            }
            case SortOption.Name:
            {
                var thisExtension=this.name.toLowerCase();
                var otherExtension=dataItem.name.toLowerCase();
                return this.name.localeCompare(dataItem.name)==1;
            }
            case SortOption.CreationDate:
                return this.creationDate>dataItem.creationDate;
            case SortOption.ModificationDate:
                return this.modifiedDate>dataItem.modifiedDate;
        }
    }

    public getExtension():string{
        let extension='';
        var parts=this.name.split('.');
        if(parts.length>1){
            extension='.'+parts.pop();
        }
        return extension;
    }
}