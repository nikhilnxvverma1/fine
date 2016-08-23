import {DataItem} from './data-item'
import {Stats} from "fs";
import {SortOption} from "./sort-option";
import {DataService} from "./data.service";
import {Tracker} from "./tracker";
import {ScanInfo} from "./scan-info";

export class Folder extends DataItem{

    private _children:DataItem[]=[];
    private _depth:number;

    private _countOfChildrenLeft:number;

    constructor(name:string) {
        super(name);
    }

    get children():DataItem[] {
        return this._children;
    }

    get countOfChildrenLeft():number {
        return this._countOfChildrenLeft;
    }

    set countOfChildrenLeft(value:number) {
        this._countOfChildrenLeft = value;
    }

    get depth():number {
        return this._depth;
    }

    set depth(value:number) {
        this._depth = value;
    }

    public childScanned(child:DataItem,scanInfo:ScanInfo):boolean{


        this._children.push(child);
        if(this.parent==null){
            scanInfo.dataService.zone.run(()=>{
                this._countOfChildrenLeft--;
                this.size=this.size+child.size;
                if(this._countOfChildrenLeft==0){
                    scanInfo.tracker.scanDidEnd();
                }
            });
        }else{
            this._countOfChildrenLeft--;
            this.size=this.size+child.size;
            if(this._countOfChildrenLeft==0){
                this.parent.childScanned(this,scanInfo);
            }
        }
        return this._countOfChildrenLeft==0;
    }

    addDataItem(dataItem:DataItem){
        this._children.push(dataItem);
        this.addSize(dataItem.size);
    }

    removeDataItem(dataItem:DataItem){
        var index=this._children.indexOf(dataItem);
        if(index!=-1){
            this._children.splice(index,1);
            this.addSize(-dataItem.size);
        }
    }


    public selectPrecedingDataItems(dataItem:DataItem){
        var endIndex=this.children.indexOf(dataItem);
        var i=endIndex-1;
        while(i>=0){
            if(!this.children[i].selected){
                this.children[i].selected=true;
            }else{
                break;
            }
            i--;
        }
    }

    public setSelectionForAll(selected:boolean){
        for(var i=0;i<this.children.length;i++){
            this.children[i].selected=selected;
        }
    }


    public setStatsInfo(stats:Stats){
        this.creationDate=stats.birthtime;
        this.modifiedDate=stats.mtime;
    }

    isDirectory():boolean {
        return true;
    }

    protected parentChangedTo(newParent:Folder) {
        super.parentChangedTo(newParent);
        this.depth=newParent.depth+1;
    }

    /**
     * Adds specified size to this folder's existing size and calls the same method
     * on its parent folder so that the effect is propogated upwards in the heirarchy
     * @param sizeToAdd size which can also be negative in case items are removed
     */
    public addSize(sizeToAdd:number){
        this.size=this.size+sizeToAdd;
        if(this._parent!=null){
            this._parent.addSize(sizeToAdd);
        }
    }

    /**
     * Sorts the children based on the sort option
     * @param sortOption size, modification date, name etc
     * @param descending if true sorts the array in descending order
     * @param sortCopy if true, sorts a copy of the children array,
     * leaving the order of the original array same
     * @return returns the sorted array
     */
    sort(sortOption:SortOption,descending:boolean,sortCopy:boolean):DataItem[]{
        if(sortCopy){
            //create a copy of the original children array
            var childrenCopy=[];
            for(var i=0;i<this.children.length;i++){
                childrenCopy.push(this.children[i]);
            }
            this.quickSort(childrenCopy,0,this.children.length-1,sortOption,descending);
            return childrenCopy;
        }else{
            this.quickSort(this.children,0,this.children.length-1,sortOption,descending);
            return this.children;
        }
    }

    private swap(items:DataItem[], firstIndex:number, secondIndex:number){
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
    }

    private partition(items:DataItem[], left:number, right:number,sortOption:SortOption,descending:boolean) {

        var pivot   = items[Math.floor((right + left) / 2)],
            i       = left,
            j       = right;

        while (i <= j) {

            if (descending) {
                while (items[i].greaterThan(pivot, sortOption)) {
                    i++;
                }
                while (items[j].lessThan(pivot, sortOption)) {
                    j--;
                }
            } else {
                while (items[i].lessThan(pivot, sortOption)) {
                    i++;
                }
                while (items[j].greaterThan(pivot, sortOption)) {
                    j--;
                }
            }
            if (i <= j) {
                this.swap(items, i, j);
                i++;
                j--;
            }
        }
        return i;
    }
    private quickSort(items:DataItem[], left:number, right:number,sortOption:SortOption,descending:boolean) {

        var index;

        if (items.length > 1) {

            index = this.partition(items, left, right,sortOption,descending);
            if (left < index - 1) {
                this.quickSort(items, left, index - 1,sortOption,descending);
            }

            if (index < right) {
                this.quickSort(items, index, right,sortOption,descending);
            }
        }
        return items;
    }
}