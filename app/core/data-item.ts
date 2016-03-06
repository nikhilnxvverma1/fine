import {Stats} from "fs";
export interface DataItem{
    name:string;
    isDirectory:boolean;
    stats:Stats;
}