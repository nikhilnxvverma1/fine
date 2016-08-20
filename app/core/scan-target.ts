/**
 * Created by NikhilVerma on 18/06/16.
 */
import {ScanTargetType} from "./scan-target-type";
import {DataItem} from "./data-item";
import {Folder} from "./folder";
import {SortOption} from "./sort-option";
import {Tracker} from "./tracker";
import {ScanStatus} from "./scan-status";

export class ScanTarget{
    private _name:string;
    private _type:ScanTargetType;
    private _total:number;
    private _available:number;
    private _used:number;
    private _folderStack:Folder[]=[];
    private _sortOption:SortOption;
    private _tracker:Tracker=new Tracker();

    constructor(name:string, type:ScanTargetType, total:number, used:number) {
        this._name = name;
        this._type = type;
        this.total=total;
        this.available = total-used;
        this.used = used;
        //this.tracker.scanStatus=ScanStatus.Scanned;
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

    get folderStack():Folder[] {
        return this._folderStack;
    }

    set folderStack(value:Array<Folder>) {
        this._folderStack = value;
    }

    get sortOption():SortOption {
        return this._sortOption;
    }

    set sortOption(value:SortOption) {
        this._sortOption = value;
        this.topFolder().sort(this.sortOption);
    }

    get tracker():Tracker {
        return this._tracker;
    }

    set tracker(value:Tracker) {
        this._tracker = value;
    }

    public topFolder():Folder{
        return this.folderStack[this.folderStack.length-1];
    }

    public jumpToFolder(folder:Folder){
        //go back till you find top folder
        var topFolder=this.topFolder();
        var foldersInBetween=[];
        var currentFolder=folder;

        while(currentFolder!=null&&currentFolder!=topFolder){
            foldersInBetween.push(currentFolder);
            currentFolder=currentFolder.parent;
        }
        if(currentFolder!=null){
            let length = foldersInBetween.length;
            for(var i=0; i<length; i++){
                //push in the reverse order
                this.folderStack.push(foldersInBetween[length-1-i]);
            }
        }else{
            //this means that the folders is before the current working directory
            //truncate the entire folder stack first
            this.folderStack.splice(0,this.folderStack.length);

            //add in folders so far collected in the reverse order
            let length = foldersInBetween.length;
            for(var i=0; i<length; i++){
                //push in the reverse order
                this.folderStack.push(foldersInBetween[length-1-i]);
            }

        }
    }
}