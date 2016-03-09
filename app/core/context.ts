import {Folder} from './folder'
import {Tag} from './tag'
import {Data} from "./data";
import {DataItem} from "./data-item";
import {TextTag} from "./text-tag";

export class Context {
    public parentFolder:Folder;//null means this is the root
    public tags:Tag[]=[];
    public dataItems:DataItem[];

    public getSelectedFiles():DataItem[]{
        var selectedDataItems:DataItem[]=[];

        for(var i=0;i<this.dataItems.length;i++){
            if(this.dataItems[i].qualifyingTags>0){
                selectedDataItems.push(this.dataItems[i]);
            }
        }

        return selectedDataItems;
    }
}