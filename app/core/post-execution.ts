/**
 * Created by NikhilVerma on 11/07/16.
 */

import {OperationInfo} from "./operation-info";
import {DataItem} from "./data-item";
import {DataOperation} from "./data-operation";
import {DeleteOperationInfo} from "./operation-info";
import {MoveOperationInfo} from "./operation-info";
import {Folder} from "./folder";

export abstract class PostExecution{
    protected _operationInfo:OperationInfo;
    protected _dataItem:DataItem;
    protected _index:number;

    public callback;// <----IMPORTANT : callback should always be an ES6 arrow function defined in the constructor
    //this is because it binds the value of "this"

    constructor(_dataItem:DataItem,_index:number,_operationInfo:OperationInfo){
        this._dataItem=_dataItem;
        this._index=_index;
        this._operationInfo=_operationInfo;
        //arrow function that preserves the value of "this" context
        this.callback=(err)=>{
            console.log("performed operation on item "+this._operationInfo.dataOperation);

            this._operationInfo.zone.run(()=>{
                if(err){
                    this._operationInfo.serviceProgress.errorOnDataItem(
                        err,
                        this._dataItem,
                        this._operationInfo.dataOperation);
                }
                this.updateAndNotifyProgress();
            });
        }
    }

    protected updateAndNotifyProgress(){
        this._operationInfo.count++;
        this._operationInfo.serviceProgress.processedDataItem(this._dataItem,
            this._operationInfo.count,
            this._operationInfo.total,
            this._operationInfo.dataOperation);

        if(this._operationInfo.count==this._operationInfo.total){
            this._operationInfo.serviceProgress.operationCompleted(this._operationInfo.total,this._operationInfo.dataOperation);
        }
    }

    protected allDataItemsProcessed():boolean{
        return this._operationInfo.count==this._operationInfo.total
    }

    protected  removeFromParent(dataItem:DataItem){
        var parent=dataItem.parent;
        if(parent!=null){
            var index=parent.children.indexOf(dataItem);
            parent.children.splice(index,1);
        }
    }
}

export class RenamePostExecution extends PostExecution{
    private _newName:string;
    constructor(_dataItem:DataItem,_index:number,_operationInfo:OperationInfo,_newName:string){
        super(_dataItem,_index,_operationInfo);
        this._newName=_newName;
        //arrow function that preserves the value of "this" context
        this.callback=(err)=>{
            this._operationInfo.zone.run(()=>{
                if(err){
                    this._operationInfo.serviceProgress.errorOnDataItem(
                        err,
                        this._dataItem,
                        this._operationInfo.dataOperation);
                }
                this._dataItem.name=this._newName;
                this.updateAndNotifyProgress();
            });
        }
    }
}

export class MovePostExecution extends PostExecution {
    constructor(_dataItem:DataItem, _index:number, _operationInfo:MoveOperationInfo) {
        super(_dataItem, _index, _operationInfo);
        //arrow function that preserves the value of "this" context
        this.callback=(err)=>{
            this._operationInfo.zone.run(()=>{
                if(err){
                    this._operationInfo.serviceProgress.errorOnDataItem(
                        err,
                        this._dataItem,
                        this._operationInfo.dataOperation);
                }

                (<MoveOperationInfo>this._operationInfo).totalSizeSoFar+=this._dataItem.size;


                if (this._operationInfo.dataOperation==DataOperation.Move||
                    this._operationInfo.dataOperation==DataOperation.Group) {
                    this.removeFromParent(this._dataItem);
                    this._dataItem.selected=false;
                    (<MoveOperationInfo>this._operationInfo).movedDataItems.push(this._dataItem);
                }else if(this._operationInfo.dataOperation==DataOperation.Copy){
                    //create a clone of this and push that into the moved items
                    var clone=this._dataItem.deepCopy();
                    clone.selected=false;
                    var folderToMoveTo=(<MoveOperationInfo>this._operationInfo).folderToMoveTo;
                    if(folderToMoveTo!=null && clone.isDirectory()){
                        (<Folder>clone).depth=folderToMoveTo.depth+1;
                    }
                    (<MoveOperationInfo>this._operationInfo).movedDataItems.push(clone);
                }

                this.updateAndNotifyProgress();
                if(this.allDataItemsProcessed()){
                    //reduce the size from its parent all the way up to root
                    if (this._operationInfo.dataOperation==DataOperation.Move||
                        this._operationInfo.dataOperation==DataOperation.Group) {
                        this._dataItem.parent.addSize(-(<MoveOperationInfo>this._operationInfo).totalSizeSoFar);
                    }

                    //whichever place got moved should also be adjusted to add these moved items
                    var folderToMoveTo=(<MoveOperationInfo>this._operationInfo).folderToMoveTo;
                    if(folderToMoveTo!=null){
                        //add them as children
                        var movedItems=(<MoveOperationInfo>this._operationInfo).movedDataItems;
                        for(var i=0;i<movedItems.length;i++){
                            folderToMoveTo.children.push(movedItems[i]);
                            movedItems[i].parent=folderToMoveTo;
                        }

                        //add their cumulative size too
                        folderToMoveTo.addSize((<MoveOperationInfo>this._operationInfo).totalSizeSoFar);
                    }

                }
            });
        }
    }
}

export class DeletePostExecution extends PostExecution {
    constructor(_dataItem:DataItem, _index:number, _operationInfo:DeleteOperationInfo) {
        super(_dataItem, _index, _operationInfo);
        //arrow function that preserves the value of "this" context
        this.callback=(err)=>{
            this._operationInfo.zone.run(()=>{
                if(err){
                    this._operationInfo.serviceProgress.errorOnDataItem(
                        err,
                        this._dataItem,
                        this._operationInfo.dataOperation);
                }
                this.removeFromParent(this._dataItem);
                (<DeleteOperationInfo>this._operationInfo).totalSizeDeletedSoFar+=this._dataItem.size;
                this.updateAndNotifyProgress();
                if(this.allDataItemsProcessed()){
                    //reduce the size from its parent all the way up to root
                    this._dataItem.parent.addSize(-(<DeleteOperationInfo>this._operationInfo).totalSizeDeletedSoFar);
                }
            });
        }
    }
}
