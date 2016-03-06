import {Injectable} from 'angular2/core';
import {DataItem} from "./data-item";
import {Folder} from "./folder";
import {File} from "./file";

@Injectable()
export class DataService{

    readDirectory(directoryPath:string):DataItem[]{

        var fs=require('fs');

        var dataItemsResult:DataItem[]=[];

        console.log("1");
        fs.readdir(directoryPath,(err,dataItems)=>{
            if(err) throw err;
            dataItems.forEach((dataItem=>{

                dataItems.push(dataItem);

                fs.stat(directoryPath+'/'+dataItem,(err,stats)=>{
                    if(err) throw err;
                    console.log("name : "+dataItem+" is direcotyr"+stats.isDirectory());
                    if(stats.isDirectory()){
                        var folder=new Folder(dataItem,stats);
                        dataItemsResult.push(folder);
                    }else{
                        var file=new File(dataItem,stats);
                        dataItemsResult.push(file);
                    }
                    console.log("2");
                })
            }));
        });
        console.log("3");
        return dataItemsResult;
    }

}