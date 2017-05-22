import {DataItem} from './data-item';
import {Stats} from "fs";

export class File extends DataItem{

    constructor(_name:string){
        super(_name);
    }

    deepCopy():DataItem {
        var deepCopy=new File(this.name);
        deepCopy.copyAttributesFrom(this);
        return deepCopy;
    }
}


