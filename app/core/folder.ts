import {DataItem} from './data-item'
import {Stats} from "fs";

export class Folder extends DataItem{

    private _children:DataItem[]=[];

    constructor(_parentUrl:string,_name:string,_stats:Stats){
        super(_parentUrl,_name,_stats);
        this.isDirectory=true;
    }

    get children():DataItem[] {
        return this._children;
    }

    addDataItem(dataItem:DataItem){
        this._children.push(dataItem);
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

}