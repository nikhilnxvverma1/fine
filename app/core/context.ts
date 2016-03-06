import {Folder} from './folder'
import {Tag} from './tag'
import {Data} from "./data";

export class Context {
    public parentFolder:Folder;//null means this is the root
    public tags:Tag[];
    public data:Data;

}