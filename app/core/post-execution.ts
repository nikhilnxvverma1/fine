/**
 * Created by NikhilVerma on 11/07/16.
 */

import {OperationInfo} from "./operation-info";
import {DataItem} from "./data-item";
import {DataOperation} from "./data-operation";

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
                        DataOperation.Rename);
                }
                this._operationInfo.count++;

                this._operationInfo.serviceProgress.processedDataItem(this._dataItem,
                    this._operationInfo.count,
                    this._operationInfo.total,
                    DataOperation.Rename);

                if(this._operationInfo.count==this._operationInfo.total){
                    this._operationInfo.serviceProgress.operationCompleted(this._operationInfo.total,DataOperation.Rename);
                }
            });
        }
    }

    protected updateAndNotifyProgress(dataOperation:DataOperation){
        this._operationInfo.count++;
        this._operationInfo.serviceProgress.processedDataItem(this._dataItem,
            this._operationInfo.count,
            this._operationInfo.total,
            DataOperation.Rename);

        if(this._operationInfo.count==this._operationInfo.total){
            this._operationInfo.serviceProgress.operationCompleted(this._operationInfo.total,DataOperation.Rename);
        }
    }

    protected allDataItemsProcessed():boolean{
        return this._operationInfo.count==this._operationInfo.total
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
                        DataOperation.Rename);
                }
                this._dataItem.name=this._newName;
                this.updateAndNotifyProgress(this._operationInfo.dataOperation);
            });
        }
    }
}

export class MovePostExecution extends PostExecution {
    constructor(_dataItem:DataItem, _index:number, _operationInfo:OperationInfo) {
        super(_dataItem, _index, _operationInfo);
    }
}

export class DeletePostExecution extends PostExecution {
    constructor(_dataItem:DataItem, _index:number, _operationInfo:OperationInfo) {
        super(_dataItem, _index, _operationInfo);
    }
}
