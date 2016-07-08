import {Injectable} from '@angular/core';
import {DataItem} from "./data-item";
import {Folder} from "./folder";
import {File} from "./file";
import {Inject,NgZone} from "@angular/core";
import {Stats} from "fs";
import {ServiceProgress} from "./service-progress";
import {OperationProgressComponent} from "../operation-progress.component";
import {DataOperation} from "./data-operation";
/// <reference path="../../typings/main/ambient/node/node.d.ts" />
//import fs=require('fs');
/// <reference path="../jslib/disk-usage.d.ts" />
//import diskUsage=require("../../jslib/disk-usage.js")
import {ScanTarget} from "./scan-target";
import {ScanTargetType} from "./scan-target-type";
@Injectable()
export class DataService{

    constructor(private _zone:NgZone){}

    readDirectory(directoryPath:string):DataItem[]{

        var fs=require('fs-extra');

        var dataItemsResult:DataItem[]=[];
        //var dirPath:string=directoryPath;

        fs.readdir(directoryPath,(err,dataItems)=>{
            if(err) throw err;
            dataItems.forEach((dataItem=>{

                fs.stat(directoryPath+'/'+dataItem,(err,stats)=>{
                    this._zone.run(()=>{
                        if(err) throw err;

                        if(stats.isDirectory()){
                            var folder=new Folder(dataItem);
                            folder.parentUrl=directoryPath;
                            folder.setStatsInfo(stats);
                            dataItemsResult.push(folder);
                        }else{
                            var file=new File(dataItem);
                            file.parentUrl=directoryPath;
                            file.setStatsInfo(stats);
                            dataItemsResult.push(file);
                        }
                    });
                })
            }));
        });
        return dataItemsResult;
    }

    scanDirectoryRecursively(directoryPath:string,name:string,parentFolder:Folder):Folder{

        var fs=require('fs-extra');

        var folder:Folder=new Folder(name);
        folder.parent=parentFolder;
        folder.parentUrl=directoryPath;

        let path = folder.getFullyQualifiedPath();
        fs.readdir(path,(err, folderChildren)=>{
            if(err) throw err;
            folderChildren.forEach((item=>{

                let childPath;

                if (path=='/') {
                    childPath = '/' + item;
                }else{
                    childPath = path + '/' + item;
                }
                fs.stat(childPath,(err, stats)=>{
                    this._zone.run(()=>{
                        if(err) throw err;

                        let containerPath = path=='/'?path:path+'/';
                        if(stats.isDirectory()){
                            var childFolder=this.scanDirectoryRecursively(containerPath,item,folder);
                            childFolder.setStatsInfo(stats);
                            childFolder.parentUrl= containerPath;
                            folder.addDataItem(childFolder);
                        }else{
                            var file=new File(item);
                            file.setStatsInfo(stats);
                            file.parentUrl=containerPath
                            folder.addDataItem(file);
                        }
                    });
                })
            }));
        });
        return folder;
    }



    moveFiles(dataItems:DataItem[],
              directory:string,
              deleteAfterMoving:boolean,
              serviceProgress:ServiceProgress,
              dataOperation:DataOperation){

        serviceProgress.operationStarted(dataOperation);
        var count=0;
        var total=dataItems.length;

        var fs=require('fs-extra');
        for(var i=0;i<dataItems.length;i++){
            let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
            let newPath = directory+dataItems[i].name;
            if(deleteAfterMoving){
                var operationInfo=new OperationInfo(DataOperation.Move,total,serviceProgress,this._zone);
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                var postExecution:PostExecution=new PostExecution(dataItems[i],i,operationInfo);
                fs.move(fullyQualifiedPath,newPath,postExecution.callback);
            }else{
                //copy everything over
                var operationInfo=new OperationInfo(DataOperation.Copy,total,serviceProgress,this._zone);
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                var postExecution:PostExecution=new PostExecution(dataItems[i],i,operationInfo);
                fs.copy(fullyQualifiedPath,newPath,postExecution.callback);
            }
        }

    }

    deleteFiles(dataItems:DataItem[],
                permenantly:boolean,
                serviceProgress:ServiceProgress,
                dataOperation:DataOperation){
        serviceProgress.operationStarted(dataOperation);
        var count=0;
        var total=dataItems.length;

        if(permenantly){
            var operationInfo=new OperationInfo(DataOperation.HardDelete,total,serviceProgress,this._zone);
            var fs=require('fs-extra');
            for(var i=0;i<dataItems.length;i++){
                let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                var postExecution:PostExecution=new PostExecution(dataItems[i],i,operationInfo);
                fs.remove(fullyQualifiedPath,postExecution.callback);
            }
        }else{
            var operationInfo=new OperationInfo(DataOperation.Trash,total,serviceProgress,this._zone);
            var trash=require('trash');
            for(var i=0;i<dataItems.length;i++){
                let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                var postExecution:PostExecution=new PostExecution(dataItems[i],i,operationInfo);
                //TODO consider doing it all in one go, for performance reasons
                trash([fullyQualifiedPath]).then(postExecution.callback);
            }
        }

    }

    renameFiles(dataItems:DataItem[],
                newName:string,
                serviceProgress:ServiceProgress,
                dataOperation:DataOperation){
        serviceProgress.operationStarted(dataOperation);
        var count=0;
        var total=dataItems.length;

        var operationInfo=new OperationInfo(DataOperation.Rename,total,serviceProgress,this._zone);

        var fs=require('fs-extra');
        for(var i=0;i<dataItems.length;i++){
            let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
            let renamedPath;
            let extension='';
            var parts=dataItems[i].name.split('.');
            if(parts.length>1){
                extension='.'+parts.pop();
            }
            if(dataItems.length==1){
                renamedPath = dataItems[i].parentUrl + newName+extension;
            }else{
                renamedPath = dataItems[i].parentUrl + newName+'_'+(i+1)+extension;
            }

            serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
            var postExecution:PostExecution=new PostExecution(dataItems[i],i,operationInfo);
            fs.rename(fullyQualifiedPath,renamedPath,postExecution.callback);
        }
    }
}

class OperationInfo{
    private _dataOperation:DataOperation;
    public count:number=0;
    private _total:number;
    public serviceProgress:ServiceProgress;
    public zone:NgZone;

    constructor(dataOperation:DataOperation,total:number,serviceProgress:ServiceProgress,zone:NgZone) {
        this._dataOperation=dataOperation;
        this._total=total;
        this.serviceProgress = serviceProgress;
        this.zone=zone;
    }

    get total():number {
        return this._total;
    }

    get dataOperation():DataOperation {
        return this._dataOperation;
    }
}

class PostExecution{
    private _operationInfo:OperationInfo;
    private _dataItem:DataItem;
    private _index:number;

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
}
