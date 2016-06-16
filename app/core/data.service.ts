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
                            var folder=new Folder(directoryPath,dataItem,stats);
                            dataItemsResult.push(folder);
                        }else{
                            var file=new File(directoryPath,dataItem,stats);
                            dataItemsResult.push(file);
                        }
                    });
                })
            }));
        });
        return dataItemsResult;
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
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                fs.move(fullyQualifiedPath,newPath,(err)=>{
                    if(err) throw err;
                    console.log("moved file");
                    this._zone.run(()=>{
                        count++;
                        serviceProgress.processedDataItem(count,total,dataOperation);
                        if(count==total){
                            serviceProgress.operationCompleted(total,dataOperation);
                        }
                    });
                });
            }else{
                //copy everything over
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                fs.copy(fullyQualifiedPath,newPath,(err)=>{
                    if(err) throw err;
                    console.log("copied file");

                    this._zone.run(()=>{
                        count++;
                        serviceProgress.processedDataItem(count,total,dataOperation);
                        if(count==total){
                            serviceProgress.operationCompleted(total,dataOperation);
                        }
                    });

                });
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
            var fs=require('fs-extra');
            for(var i=0;i<dataItems.length;i++){
                let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                fs.remove(fullyQualifiedPath,(err)=>{
                   if(err)throw err;
                    console.log("Deleted item");

                    this._zone.run(()=>{
                        count++;
                        serviceProgress.processedDataItem(count,total,dataOperation);
                        if(count==total){
                            serviceProgress.operationCompleted(total,dataOperation);
                        }
                    });
                });
            }
        }else{
            var trash=require('trash');
            for(var i=0;i<dataItems.length;i++){
                let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
                serviceProgress.beganProcessingDataItem(dataItems[i],dataOperation);
                trash([fullyQualifiedPath]).then(() => {//TODO consider doing it all in one go, for performance reasons
                    console.log('trashed item');

                    this._zone.run(()=>{
                        count++;
                        serviceProgress.processedDataItem(count,total,dataOperation);
                        if(count==total){
                            serviceProgress.operationCompleted(total,dataOperation);
                        }
                    });
                });
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
            //fs.rename(fullyQualifiedPath,renamedPath,(err)=>{
            //    if(err)throw err;
            //    console.log("renamed item");
            //
            //    //serviceProgress.processedDataItem()
            //
            //    this._zone.run(()=>{
            //        count++;
            //        serviceProgress.processedDataItem(count,total,dataOperation);
            //        if(count==total){
            //            serviceProgress.operationCompleted(total,dataOperation);
            //        }
            //    });
            //
            //});

            //var postExecution={
            //    "dataItem":dataItems[i],
            //    "index":i,
            //    "callback":(err)=>{
            //        if(err)throw err;
            //        console.log("renamed item "+this.index);
            //
            //        this._zone.run(()=>{
            //            count++;
            //            serviceProgress.processedDataItem(count,total,dataOperation);
            //            if(count==total){
            //                serviceProgress.operationCompleted(total,dataOperation);
            //            }
            //        });
            //    }
            //};

            var postExecution:PostExecution=new PostExecution(dataItems[i],i);

            fs.rename(fullyQualifiedPath,renamedPath,postExecution.callback);
        }
    }
}

class PostExecution{
    private dataItem:DataItem;
    private index:number;

    public callback;// <----IMPORTANT : callback should always be an ES6 arrow function defined in the constructor
    //this is because it binds the value of "this"

    constructor(_dataItem:DataItem,_index:number){
        this.dataItem=_dataItem;
        this.index=_index;

        //arrow function that preserves the value of "this" context
        this.callback=(err)=>{
            if(err)throw err;
            console.log("renamed item "+this.index);

            //this._zone.run(()=>{
            //    count++;
            //    serviceProgress.processedDataItem(count,total,dataOperation);
            //    if(count==total){
            //        serviceProgress.operationCompleted(total,dataOperation);
            //    }
            //});
        }
    }
}