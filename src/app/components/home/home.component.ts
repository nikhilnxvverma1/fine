import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import {DataService} from '../../core/data.service'
import {RootModel} from "../../core/root-model";
import {Context} from "../../core/context";
import {DataItem} from "../../core/data-item";
import {Folder} from "../../core/folder";
import {MainMenuComponent} from "../main-menu/main-menu.component";
import {ScanTarget} from "../../core/scan-target";
import {DummyData} from "../../core/dummy-data";
import {ScanTargetType} from "../../core/scan-target-type";
import * as freeDiskSpace from 'freediskspace';
import * as njds from 'nodejs-disks';
import * as childProcess from 'child_process';
import { Terminal } from "xterm";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit,AfterViewInit {

	public rootModel:RootModel=new RootModel();
    private _scanTargets:ScanTarget[]=[];
    private activeScanTarget:ScanTarget;
	@ViewChild(MainMenuComponent) mainMenu:MainMenuComponent;
	@ViewChild('xterm') xterm:ElementRef;
	private terminal:Terminal;

    constructor(private _dataService:DataService){
		this.scanInitialData();
	}
	
	ngOnInit(){
		
	}

	ngAfterViewInit(){
		// this.terminal = new Terminal();
		// this.terminal.open(this.xterm.nativeElement);
		// this.terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
	}

	private scanInitialData(){
		this.rootModel=new RootModel();

		var folderToOpen=['/Users/NikhilVerma/Downloads'];
		if(folderToOpen==null) return;
		var dataItems:DataItem[]=this._dataService.readDirectory(folderToOpen[0]);//this also needs to happen inside ng zone
		this.rootModel.rootDirectory=folderToOpen[0];

		//create a new context holding the value of the root now
		var context=new Context();//null context meaning root
		context.dataItems=dataItems;
		this.rootModel.contextStack.splice(0,this.rootModel.contextStack.length); // empty the array
		this.rootModel.contextStack.push(context);// push the context on a empty array
		console.log('RootModel Model folder(chan): '+this.rootModel.rootDirectory);

		this.getScanTargets();
	}

    getScanTargets(){
		var scanTargets=this._scanTargets;
		freeDiskSpace.driveList((err, drives) =>{
			for(var i in drives){
				freeDiskSpace.detail(drives[i],(err, data) =>{
						this._dataService.zone.run(()=>{
						var scanTarget=new ScanTarget(data.drive,'/',ScanTargetType.HardDisk,data.total,data.used);
						scanTargets.push(scanTarget);
						//console.log("scan target name : "+scanTarget.name);
						//if(this._scanTargets.length==1){
						//    //scanTargets[0].rootScanResult=new DummyData().dummyDataItems(6,7,5,"Users/NikhilVerma/Documents","My Data");
						//    var folder=this._dataService.scanDirectoryRecursively('/Users/NikhilVerma/Documents/','Admission Process',null);
						//    scanTargets[0].folderStack.push(folder);
						//}
					});
				});
			}
		});
	}

    getScanTargetsNodejsDisks(){
        var scanTargets=this._scanTargets;
        
        var driveInfoList=[];
        njds.drives(
             (err, drives) =>{
                njds.drivesDetail(
                    drives,
                    (err, data) =>{
                        for(var i = 0; i<data.length; i++)
                        {

                            var scanTarget=new ScanTarget(data[i].drive,'/',ScanTargetType.HardDisk,data[i].total,data[i].used);
                            //var driveInfo={
                            //    "mountPoint":data[i].mountpoint,
                            //    "total":data[i].total,
                            //    "used":data[i].used,
                            //    "available":data[i].available,
                            //    "name":data[i].drive,
                            //    "usedPercentage":data[i].usedPer,
                            //    "freePercentage":data[i].freePer,
                            //};
                            //driveInfoList.push(driveInfo);
                            scanTargets.push(scanTarget);
                            //console.log("scan target name : "+scanTarget.name);
                            //if(this._scanTargets.length==1){
                            //    scanTargets[0].rootScanResult=new DummyData().dummyDataItems(6,7,5,"Users/NikhilVerma/Documents","My Data");
                            //}
                        }
                    }
                );
            }
        );
    }

    addFolderToScanTargets(folderPath:string){
        console.log("Will add folder:"+folderPath);
        var lastSlash=folderPath.lastIndexOf('/');
        var containerPath=folderPath.slice(0,lastSlash+1);
        var name=folderPath.slice(lastSlash+1);
        name=name==null?'':name;

        var folder=new Folder(name);
        folder.parentUrl=containerPath;
        var folderScanTarget=new ScanTarget(name,folderPath,ScanTargetType.Folder,-1,-1);
        this._scanTargets.push(folderScanTarget);
        folderScanTarget.folderStack.push(folder);
        folderScanTarget.tracker.scanDidStart();
        folder.depth=0;
        this._dataService.scanFolder(folder,folderScanTarget.tracker);

    }

    openScanResult(scanTarget:ScanTarget){
        console.log("Will open result for "+scanTarget.name);
        this.activeScanTarget=scanTarget;
        this.mainMenu.isMenuOpen=false;
    }

    openDataItem(dataItem:DataItem){
        console.log("about to open dataItem"+dataItem.name);

        if(dataItem.isDirectory()){

            let folderPath = dataItem.getFullyQualifiedPath()+'/';
            var dataItems:DataItem[]=this._dataService.readDirectory(folderPath);
            var context=new Context();//null context meaning root
            context.dataItems=dataItems;
            context.parentFolder=<Folder>dataItem;
            //this.rootModel.contextStack.splice(0,this.rootModel.contextStack.length);
            this.rootModel.contextStack.push(context);
        }else{

            //mind the subtle difference here. command line "open" requires those quotes for the full path
			let spawn=childProcess.spawn;
            let filePath=dataItem.getFullyQualifiedPath();
            spawn('open', [filePath]);
        }
    }

    changeMenuStateToOpen(){
        //this._isMenuOpen=true;
        this.mainMenu.isMenuOpen=true;
    }


}
