import {Injectable} from 'angular2/core';

@Injectable()
export class DataService{

    readDirectory(directoryPath:string){

        var fs=require('fs');

        fs.readdir(directoryPath,(err,dataItems)=>{
            if(err) throw err;
            dataItems.forEach((dataItem=>{
                fs.stat(directoryPath+'/'+dataItem,(err,stats)=>{
                    if(err) throw err;
                    console.log("name : "+dataItem+" is direcotyr"+stats.isDirectory());
                })
            }));
        });
    }

}