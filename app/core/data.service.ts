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
import {Tracker} from "./tracker";
import {PostExecution} from "./post-execution";
import {OperationInfo} from "./operation-info";
import {ScanInfo} from "./scan-info";
import {ScanCallback} from "./scan-callback";
@Injectable()
export class DataService{

    public static sizeCollected:number=0;

    constructor(private _zone:NgZone){}

    get zone():NgZone {
        return this._zone;
    }

    public readDirectory(directoryPath:string):DataItem[]{

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

    public scanDirectoryRecursively(directoryPath:string,name:string,parentFolder:Folder):Folder{

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

    public scanFolder(folder:Folder,tracker:Tracker){

        var fs=require('fs-extra');

        let path = folder.getFullyQualifiedPath();
        fs.readdir(path,(err, folderChildren:string[])=>{
            if(err) throw err;

            folder.countOfChildrenLeft=folderChildren.length;
            if(folder.parent==null){
                this._zone.run(()=>{
                    tracker.totalChildrenOfRoot=folder.countOfChildrenLeft;
                });
            }

            var scanInfo=new ScanInfo(folder,this,tracker);
            if(folder.countOfChildrenLeft==0){
                if(folder.parent!=null){
                    folder.parent.childScanned(folder,scanInfo);
                }else{
                    this._zone.run(()=>{
                        tracker.scanDidEnd();
                    });
                }
            }else{

                for(var i in folderChildren){
                    var name=folderChildren[i];
                    var scanCallback=new ScanCallback(name,scanInfo);

                    let childPath;
                    if (path=='/') {
                        childPath = '/' + name;
                    }else{
                        childPath = path + '/' + name;
                    }
                    fs.stat(childPath,scanCallback.callback);
                }
            }

        });
    }


    public moveFiles(dataItems:DataItem[],
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

    public deleteFiles(dataItems:DataItem[],
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

    public renameFiles(dataItems:DataItem[],
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
