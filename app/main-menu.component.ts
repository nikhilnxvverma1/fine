/**
 * Created by NikhilVerma on 18/06/16.
 */


import {Component} from '@angular/core';
import {DataItem} from "./core/data-item";
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";

import {ScanTarget} from "./core/scan-target";
import {FeedbackComponent} from "./feedback.component";

@Component({
    selector: 'main-menu',
    templateUrl:'app/template/main-menu.component.html',
    directives: [FeedbackComponent],
})
export class MainMenuComponent{

    @Input('scanTargets') public scanTargets:ScanTarget[];
    constructor(private _zone:NgZone) {}

    openFolderForScan(){
        var dialog=require('electron').remote.dialog;

        dialog.showOpenDialog({ properties: ['openDirectory']},(folderToOpen)=>{
            this._zone.run(()=>{

                if(folderToOpen==null) return;

                console.log('Folder to scan: '+folderToOpen);

            });
        });
    }

    openFeedbackForm(){
        console.log("Time to open the feedback form");
    }

}