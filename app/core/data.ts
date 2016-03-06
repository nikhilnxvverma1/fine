import {DataItem} from './data-item'

//this class is mostly a container for data in a directory
export class Data {
    public dataItems:DataItem[];

    constructor(_dataItems:DataItem[]){
        this.dataItems=_dataItems;
    }
}