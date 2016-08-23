/**
 * Created by NikhilVerma on 18/06/16.
 */
import {ScanTargetType} from "./scan-target-type";
import {DataItem} from "./data-item";
import {Folder} from "./folder";
import {SortOption} from "./sort-option";
import {Tracker} from "./tracker";
import {ScanStatus} from "./scan-status";
import {GroupElement} from "./group-element";

export class ScanTarget{
    private _name:string;
    private _type:ScanTargetType;
    private _total:number;
    private _available:number;
    private _used:number;
    private _folderStack:Folder[]=[];
    private _sortOption:SortOption=SortOption.Size;
    private _tracker:Tracker=new Tracker(this);
    private _displayTreeRoot:GroupElement;
    private _displayTreeCurrent:GroupElement;
    private _showAllItems:boolean=false;

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
        this.topFolder().sort(this.sortOption,false,false);
    }

    get tracker():Tracker {
        return this._tracker;
    }

    set tracker(value:Tracker) {
        this._tracker = value;
    }

    get displayTreeRoot():GroupElement {
        return this._displayTreeRoot;
    }

    set displayTreeRoot(value:GroupElement) {
        this._displayTreeRoot = value;
    }

    get displayTreeCurrent():GroupElement {
        return this._displayTreeCurrent;
    }

    set displayTreeCurrent(value:GroupElement) {
        this._displayTreeCurrent = value;
        this._showAllItems=false;
    }

    get showAllItems():boolean {
        return this._showAllItems;
    }

    set showAllItems(value:boolean) {
        this._showAllItems = value;
    }

    public topFolder():Folder{
        return this.folderStack[this.folderStack.length-1];
    }

    /**
     * jumps to the specified folder by adding relevant folders in the folder stack
     * @param folder folder to jump to
     * @returns {boolean} true if the folder is ahead of the
     * current working directory,false otherwise
     */
    public jumpToFolder(folder:Folder):boolean{
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
            return true;
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
            return false;
        }
    }
}