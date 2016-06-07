import {Stats} from "fs";
export interface DataItem{
    name:string;
    isDirectory:boolean;
    stats:Stats;
    selected:boolean;
    //there is a many to many relationship between tags and data items
    qualifyingTags:number;//counter for the total number of tags this data-item is overlapping with

}