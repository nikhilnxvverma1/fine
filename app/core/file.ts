import {DataItem} from './data-item';
import {Stats} from "fs";

export class File extends DataItem{

    constructor(_parentUrl:string,_name:string,_stats:Stats){
        super(_parentUrl,_name,_stats);
    }
}


