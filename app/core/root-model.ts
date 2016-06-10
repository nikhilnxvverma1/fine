import {Context} from './context'
import {Injectable} from "@angular/core";

//@Injectable()
export class RootModel{
    public rootDirectory:string;
    public contextStack:Context[]=[];

    getFullPathTillEnd(){
        var fullPath:string=this.rootDirectory;
        for(var i=0;i<this.contextStack.length;i++){
            var context:Context=this.contextStack[i];
            if(context.parentFolder!=null){
                fullPath+='/'+context.parentFolder.name;
            }
        }
        console.log('full path:'+fullPath);
        return fullPath;
    }
}

