import {Context} from './context'
import {DataService} from './data.service'
import {Operation} from './operation'

export class Root{
    public shell:DataService;
    public rootDirectory:string;
    public contextStack:Context[];
}

