import {DataItem} from './data-item'
import {Stats} from "fs";

export class Folder implements DataItem{
    parentUrl:string;
    name:string;
    isDirectory:boolean;
    stats:Stats;
    selected:boolean;
    qualifyingTags:number;

    //metadata about folder
    constructor(_parentUrl:string,_name:string,_stats:Stats){
        this.parentUrl=_parentUrl;
        this.name=_name;
        this.isDirectory=true;
        this.stats=_stats;
        this.selected=false;
        this.qualifyingTags=0;
    }

    getFullyQualifiedPath():string{
        return this.parentUrl+this.name;
    }

}