import {Injectable} from '@angular/core';
import {DataItem} from "./data-item";
import {Folder} from "./folder";
import {File} from "./file";
import {NgZone} from "@angular/core";
import {Stats} from "fs";
/// <reference path="../../typings/main/ambient/node/node.d.ts" />
//import fs=require('fs');
@Injectable()
export class DataService{

    constructor(private _zone:NgZone){

    }

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

    moveFiles(dataItems:DataItem[],directory:string,deleteAfterMoving:boolean){

        //var mv=require('mv');
        var fs=require('fs-extra');
        for(var i=0;i<dataItems.length;i++){
            let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
            let newPath = directory+dataItems[i].name;
            if(deleteAfterMoving){
                fs.move(fullyQualifiedPath,newPath,(err)=>{
                    if(err) throw err;
                    console.log("moved file");
                });
            }else{
                //copy everything over
                fs.copy(fullyQualifiedPath,newPath,(err)=>{
                    if(err) throw err;
                    console.log("copied file");
                });
            }
        }
    }

    deleteFiles(dataItems:DataItem[],permenantly:boolean){
        if(permenantly){
            var fs=require('fs-extra');
            for(var i=0;i<dataItems.length;i++){
                let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
                fs.remove(fullyQualifiedPath,(err)=>{
                   if(err)throw err;
                    console.log("Deleted item");
                });
            }
        }else{
            var trash=require('trash');
            for(var i=0;i<dataItems.length;i++){
                let fullyQualifiedPath = dataItems[i].getFullyQualifiedPath();
                trash([fullyQualifiedPath]).then(() => {//TODO consider doing it all in one go, for performance reasons
                    console.log('trashed item');
                });
            }
        }

    }

    renameFiles(dataItems:DataItem[],newName:string){
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
            fs.rename(fullyQualifiedPath,renamedPath,(err)=>{
                if(err)throw err;
                console.log("renamed item");
            });
        }
    }

}