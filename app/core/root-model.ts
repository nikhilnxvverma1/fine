import {Context} from './context'
import {Operation} from './operation'
import {Injectable} from "angular2/core";

@Injectable()
export class RootModel{
    public rootDirectory:string;
    public contextStack:Context[];
}

