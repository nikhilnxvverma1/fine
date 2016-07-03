import {DataItem} from './data-item'
import {Stats} from "fs";
import {SortOption} from "./sort-option";

export class Folder extends DataItem{

    private _children:DataItem[]=[];
    private _parent:Folder;


    constructor(name:string) {
        super(name);
        this.isDirectory=true;
    }

    get children():DataItem[] {
        return this._children;
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


    get parent():Folder {
        return this._parent;
    }

    set parent(value:Folder) {
        this._parent = value;
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

    sort(sortOption:SortOption){
        this.quickSort(this.children,0,this.children.length-1,sortOption);
    }

    private swap(items:DataItem[], firstIndex:number, secondIndex:number){
        var temp = items[firstIndex];
        items[firstIndex] = items[secondIndex];
        items[secondIndex] = temp;
    }

    private partition(items:DataItem[], left:number, right:number,sortOption:SortOption) {

        var pivot   = items[Math.floor((right + left) / 2)],
            i       = left,
            j       = right;

        while (i <= j) {

            while (items[i].lessThan(pivot,sortOption)) {
                i++;
            }
            while (items[j].greaterThan(pivot,sortOption)) {
                j--;
            }
            if (i <= j) {
                this.swap(items, i, j);
                i++;
                j--;
            }
        }
        return i;
    }
    private quickSort(items:DataItem[], left:number, right:number,sortOption:SortOption) {

        var index;

        if (items.length > 1) {

            index = this.partition(items, left, right,sortOption);
            if (left < index - 1) {
                this.quickSort(items, left, index - 1,sortOption);
            }

            if (index < right) {
                this.quickSort(items, index, right,sortOption);
            }
        }
        return items;
    }
}