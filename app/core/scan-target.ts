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
import {LeafElement} from "./leaf-element";
import {DisplayElement} from "./display-element";
import {SunburstComponent} from "../sunburst.component";

export class ScanTarget{
    _totalElements=0;
    private _name:string;
    private _type:ScanTargetType;
    private _total:number;
    private _available:number;
    private _used:number;
    private _folderStack:Folder[]=[];
    private _sortOption:SortOption=SortOption.Size;
    private _sortedInDescending:boolean=false;
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
        //toggle if the same option is chosen again
        //(Warning: UI design logic inserted in core class)
        if(value==this._sortOption){
            this._sortedInDescending=!this._sortedInDescending;
        }else{
            this._sortedInDescending=false;
        }
        this._sortOption = value;
        this.topFolder().sort(this.sortOption,this._sortedInDescending,false);
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

    /** Sorts the topmost folder based on size in the descending order*/
    public sortDescendingBasedOnSize(){
        this._sortedInDescending=true;
        this.topFolder().sort(this.sortOption,this._sortedInDescending,false);
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

    populateDisplayElementTree(root:GroupElement):GroupElement{
        var depth=0;
        this._totalElements=0;
        this.traverseBigItems(root,SunburstComponent.STARTING_CHILDREN_TO_SHOW,depth);
        return root;
    }

    traverseBigItems(groupElement:GroupElement,upperFew:number,depth:number){
        if(depth>SunburstComponent.MAX_DEPTH||
            upperFew<1||
            !groupElement.getDataItem().isDirectory()){
            return;
        }
        var displayElements=this.upperDisplayElementsFor(groupElement,upperFew);
        var i=0;
        for(i=0;i<displayElements.length;i++){
            if(displayElements[i].isGroup()){

                var fraction=displayElements[i].getDataItem().size/groupElement.getDataItem().size;
                var reducedUpperFew=upperFew*fraction;
                if(reducedUpperFew<1&&depth<SunburstComponent.MANDATORY_DEPTH){
                    reducedUpperFew=1;
                }
                this.traverseBigItems((<GroupElement>displayElements[i]),reducedUpperFew,depth+1);
            }
        }
    }

    upperDisplayElementsFor(groupElement:GroupElement,upperFew:number):DisplayElement[]{

        var folder=groupElement.getDataItem();

        //get depth information to calculate 'h'
        var depth=folder.depth+1;
        if(upperFew<1){
            return null;
        }
        var sortedCopy=folder.sort(SortOption.Size,false,true);//sorts in ascending order
        var childrenToShow:DisplayElement[]=[];
        var sizeOfDisplayedElements=0;
        for(var i=0;i<upperFew&&i<sortedCopy.length;i++){
            var child=sortedCopy[sortedCopy.length-1-i];
            sizeOfDisplayedElements+=child.size;
            var childElement;
            if(child.isDirectory()){
                childElement=new GroupElement();
                childElement.folder=<Folder>child;
            }else{
                childElement=new LeafElement();
                childElement.file=child;
            }

            childElement.parent=groupElement;
            childrenToShow.push(childElement);
            this._totalElements++;
        }

        groupElement.omissionCount=sortedCopy.length-childrenToShow.length;
        groupElement.omissionSize=folder.size-sizeOfDisplayedElements;
        groupElement.children=childrenToShow;
        return childrenToShow;
    }

    groupElementFor(folder:Folder):GroupElement{
        return null;
    }

    leafElementFor(file:File):LeafElement{
        return null;
    }

    makeGroupElementFor(folder:Folder){

    }
}