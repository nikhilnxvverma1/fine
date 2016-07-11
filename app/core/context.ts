import {Folder} from './folder'
import {Tag} from './tag'
import {Data} from "./data";
import {DataItem} from "./data-item";
import {TextTag} from "./text-tag";
import {SortOption} from "./sort-option";

export class Context {

    public parentFolder:Folder;//null means this is the root
    public tags:Tag[]=[];
    public dataItems:DataItem[];
    public dummyFolder:Folder=new Folder('');//used for showing name of folder while filling 'group' textfield
    private _sortOption:SortOption;

    get sortOption():SortOption {
        return this._sortOption;
    }

    set sortOption(value:SortOption) {
        this._sortOption = value;
    }

    public getSelectedFiles():DataItem[]{
        var selectedDataItems:DataItem[]=[];

        for(var i=0;i<this.dataItems.length;i++){
            if(this.dataItems[i].selected){
                selectedDataItems.push(this.dataItems[i]);
            }
        }

        return selectedDataItems;
    }

    public setSelectionForAll(selected:boolean){
        for(var i=0;i<this.dataItems.length;i++){
            this.dataItems[i].selected=selected;
        }
    }

}