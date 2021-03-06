import {Stats} from "fs";
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
    private _red:number;
    private _green:number;
    private _blue:number;

    constructor(name:string) {
        this._name = name;
        this.computeRandomColor();
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

    get red():number {
        return this._red;
    }

    set red(value:number) {
        this._red = value;
    }

    get green():number {
        return this._green;
    }

    set green(value:number) {
        this._green = value;
    }

    get blue():number {
        return this._blue;
    }

    set blue(value:number) {
        this._blue = value;
    }

    public computeRandomColor(){
        this.red=Math.floor(Math.random()*256+1);
        this.green=Math.floor(Math.random()*256+1);
        this.blue=Math.floor(Math.random()*256+1);
    }

    public colorRGB():string{
        if(this.isDirectory()){
            return "rgb("+this.red+","+this.green+","+this.blue+")";
        }else{
            //return a gray color for all files
            return "rgb(70,70,70)";
        }
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

    public setRgb(r:number,g:number,b:number){
        this.red=r;
        this.green=g;
        this.blue=b;
    }
    
    protected copyAttributesFrom(dataItem:DataItem){
        this._parentUrl=dataItem._parentUrl;
        this._name=dataItem._name;
        this._selected=dataItem._selected;
        this._parent=dataItem._parent;
        this._creationDate=dataItem._creationDate;
        this._modifiedDate=dataItem._modifiedDate;
        this._size=dataItem._size;
        this._red=dataItem._red;
        this._green=dataItem._green;
        this._blue=dataItem._blue;
    }
    
    public abstract deepCopy():DataItem;
}