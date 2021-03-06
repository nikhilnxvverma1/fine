import {Injectable} from '@angular/core';
import {DataItem} from "./data-item";
import {Folder} from "./folder";
import {File} from "./file";
import {Inject,NgZone} from "@angular/core";
import {Stats} from "fs";
import {ServiceProgress} from "./service-progress";
import {OperationProgressComponent} from "../components/operation-progress/operation-progress.component";
import {DataOperation} from "./data-operation";
import {ScanTarget} from "./scan-target";
import {ScanTargetType} from "./scan-target-type";
import {Tracker} from "./tracker";
import {PostExecution} from "./post-execution";
import {OperationInfo} from "./operation-info";
import {ScanInfo} from "./scan-info";
import {ScanCallback} from "./scan-callback";
import {RenamePostExecution} from "./post-execution";
import {DeletePostExecution} from "./post-execution";
import {MovePostExecution} from "./post-execution";
import {DeleteOperationInfo} from "./operation-info";
import {MoveOperationInfo} from "./operation-info";
import * as fs from 'fs-extra';

@Injectable()
export class DataService{

    public static sizeCollected:number=0;

    constructor(private _zone:NgZone){}

    get zone():NgZone {
        return this._zone;
    }

    public readDirectory(directoryPath:string):DataItem[]{

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
                    fs.lstat(childPath,scanCallback.callback);
                }
            }

        });
    }


    public moveFiles(dataItems:DataItem[],
                     scanTarget:ScanTarget,
                     directory:string,
                     folderToMoveTo:Folder,//this can be null in case the folder is outside the scan target's hierarchy
                     deleteAfterMoving:boolean,
                     serviceProgress:ServiceProgress,
                     dataOperation:DataOperation){

        serviceProgress.operationStarted(dataOperation);
        var count=0;
        var total=dataItems.length;

        var operationInfo=new MoveOperationInfo(dataOperation,scanTarget,total,
            serviceProgress,this._zone,folderToMoveTo);

        for(var i=0;i<dataItems.length;i++){
            let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
            let newPath = directory+dataItems[i].name;
            if(deleteAfterMoving){
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                var postExecution:PostExecution=new MovePostExecution(dataItems[i],i,operationInfo);
                fs.move(fullyQualifiedPath,newPath,postExecution.callback);
            }else{
                //copy everything over
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                var postExecution:PostExecution=new MovePostExecution(dataItems[i],i,operationInfo);
                fs.copy(fullyQualifiedPath,newPath,postExecution.callback);
            }
        }

    }

    public deleteFiles(dataItems:DataItem[],
                       scanTarget:ScanTarget,
                       permenantly:boolean,
                       serviceProgress:ServiceProgress,
                       dataOperation:DataOperation) {
        serviceProgress.operationStarted(dataOperation);
        var count=0;
        var total=dataItems.length;

        if(permenantly){
            var operationInfo=new DeleteOperationInfo(DataOperation.HardDelete,scanTarget,total,serviceProgress,this._zone);
            for(var i=0;i<dataItems.length;i++){
                let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                var postExecution:PostExecution=new DeletePostExecution(dataItems[i],i,operationInfo);
                fs.remove(fullyQualifiedPath,postExecution.callback);
            }
        }else{
            var operationInfo=new DeleteOperationInfo(DataOperation.Trash,scanTarget,total,serviceProgress,this._zone);
            var trash=require('trash');
            for(var i=0;i<dataItems.length;i++){
                let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                var postExecution:PostExecution=new DeletePostExecution(dataItems[i],i,operationInfo);
                //TODO consider doing it all in one go, for performance reasons
                trash([fullyQualifiedPath]).then(postExecution.callback);
            }
        }

    }

    public renameFiles(dataItems:DataItem[],
                       scanTarget:ScanTarget,
                       newName:string,
                       serviceProgress:ServiceProgress,
                       dataOperation:DataOperation){
        serviceProgress.operationStarted(dataOperation);
        var count=0;
        var total=dataItems.length;

        var operationInfo=new OperationInfo(DataOperation.Rename,scanTarget,total,serviceProgress,this._zone);

        
        for(var i=0;i<dataItems.length;i++){
            let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
            let renamedPath;
            let extension='';
            var parts=dataItems[i].name.split('.');
            if(parts.length>1){
                extension='.'+parts.pop();
            }
            var newDataItemName:string;
            if(dataItems.length==1){
                newDataItemName=newName+extension;
            }else{
                newDataItemName=newName+'_'+(i+1)+extension;
            }
            renamedPath = dataItems[i].parentUrl + newDataItemName;

            serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
            var postExecution:PostExecution=new RenamePostExecution(dataItems[i],i,operationInfo,newDataItemName);
            fs.rename(fullyQualifiedPath,renamedPath,postExecution.callback);
        }
    }
}
