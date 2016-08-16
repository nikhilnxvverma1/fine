/**
 * Created by NikhilVerma on 11/07/16.
 */

import {ScanInfo} from "./scan-info";
import {Stats} from "fs";
import {Folder} from "./folder";
import {File} from "./file";
import {DataService} from "./data.service";

export class ScanCallback{

    private _scanInfo:ScanInfo;
    public callback;
    private name;

    constructor(name:string, scanInfo:ScanInfo) {
        this.name=name;
        this._scanInfo=scanInfo;
        this.callback=(err,stats:Stats)=>{
            if(err) throw err;
            let path = this._scanInfo.parent.getFullyQualifiedPath();
            let containerPath = path=='/'?path:path+'/';
            if(stats.isDirectory()){
                var childFolder=new Folder(this.name);
                childFolder.setStatsInfo(stats);
                childFolder.parentUrl= containerPath;
                childFolder.parent=this._scanInfo.parent;//this takes care of depth information too
                this._scanInfo.dataService.scanFolder(childFolder,this._scanInfo.tracker);
            }else{
                var file=new File(this.name);
                file.setStatsInfo(stats);
                file.parentUrl=containerPath;
                file.parent=this._scanInfo.parent;
                file.parent.childScanned(file,this._scanInfo);
                this._scanInfo.tracker.addSize(stats.size);
                DataService.sizeCollected+=stats.size;
                //console.log("size collected "+DataService.sizeCollected);

            }
        }
    }
}
