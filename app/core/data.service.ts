import {Injectable} from 'angular2/core';
import {DataItem} from "./data-item";
import {Folder} from "./folder";
import {File} from "./file";
import {NgZone} from "angular2/core";

@Injectable()
export class DataService{

    constructor(private _zone:NgZone){

    }

    readDirectory(directoryPath:string):DataItem[]{

        var fs=require('fs');

        var dataItemsResult:DataItem[]=[];

        fs.readdir(directoryPath,(err,dataItems)=>{
            if(err) throw err;
            dataItems.forEach((dataItem=>{

                fs.stat(directoryPath+'/'+dataItem,(err,stats)=>{
                    this._zone.run(()=>{
                        if(err) throw err;
                        //console.log("name : "+dataItem+" is direcotyr"+stats.isDirectory());
                        if(stats.isDirectory()){
                            var folder=new Folder(dataItem,stats);
                            dataItemsResult.push(folder);
                        }else{
                            var file=new File(dataItem,stats);
                            dataItemsResult.push(file);
                        }
                    });
                })
            }));
        });
        return dataItemsResult;
    }

}