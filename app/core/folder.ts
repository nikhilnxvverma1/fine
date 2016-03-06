import {DataItem} from './data-item'
import {Stats} from "fs";

export class Folder implements DataItem{
    name:string;
    isDirectory:boolean;
    stats:Stats;
    //metadata about folder
    constructor(_name:string,_stats:Stats){
        this.name=_name;
        this.isDirectory=true;
        this.stats=_stats;
    }
}