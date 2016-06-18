import {DataItem} from './data-item'
import {Stats} from "fs";

export class Folder extends DataItem{

    private _children:DataItem[];

    constructor(_parentUrl:string,_name:string,_stats:Stats){
        super(_parentUrl,_name,_stats);
    }

    get children():DataItem[] {
        return this._children;
    }

    addDataItem(dataItem:DataItem){
        this._children.push(dataItem);
    }

}