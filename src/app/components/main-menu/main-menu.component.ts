import {Component,ViewChild} from '@angular/core';
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";
import {trigger,state,style,transition,animate} from "@angular/animations";
import {DataItem} from "../../core/data-item";

import {ScanTarget} from "../../core/scan-target";
import {FeedbackComponent} from "../feedback/feedback.component";
import {UnitSpacePipe} from "../unit-space.pipe";
import {ScanStatus} from "../../core/scan-status";
import * as electron from 'electron';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  animations:[
        trigger('menuState',[
            state('open',style({
                left:"0"
            })),
            state('close',style({
                left:"-100%"
            })),
            transition('open => close',animate('200ms ease-in')),
            transition('close => open',animate('200ms ease-out')),
        ]),
        trigger('darkOverlayState',[
            state('open',style({
                visibility:"initial"
            })),
            state('close',style({
                visibility:"collapse"
            })),
            transition('open => close',animate('100ms ease-in')),
            transition('close => open',animate('100ms ease-out')),
        ])
    ]
})
export class MainMenuComponent{

    @Input('scanTargets') public scanTargets:ScanTarget[];
    @Input('activeScanTarget') public activeScanTarget:ScanTarget;
    @Output('addFolderToScanTargets') addFolderEvent=new EventEmitter<string>();
    @Output('openScanResult') openScanResultEvent=new EventEmitter<ScanTarget>();
    private _isMenuOpen:boolean=true;
    constructor(private _zone:NgZone) {}
    @ViewChild(FeedbackComponent)private  _feedback:FeedbackComponent;

    get isMenuOpen():boolean {
        return this._isMenuOpen;
    }

    set isMenuOpen(value:boolean) {
        this._isMenuOpen = value;
    }

    openFolderForScan(){
        var dialog=electron.remote.dialog;

        dialog.showOpenDialog({ properties: ['openDirectory']},(folderToOpen)=>{
            this._zone.run(()=>{

                if(folderToOpen==null) return;

                this.addFolderEvent.emit(folderToOpen[0]);
                console.log('Folder to scan: '+folderToOpen);

            });
        });
    }

    openFeedbackForm(){
        console.log("Time to open the feedback form");
        this._feedback.isFeedbackOpen=!this._feedback.isFeedbackOpen;
    }

    changeMenuStateToClose(){
        this.isMenuOpen=false;
        this._feedback.isFeedbackOpen=false;
    }

    getMenuState(){
        return this.isMenuOpen?"open":"close";
    }

    actOnScanTarget(scanTarget:ScanTarget,event:Event){
        switch(scanTarget.tracker.scanStatus){
            case ScanStatus.Unscanned:
                break;
            case ScanStatus.CurrentlyScanning:
                break;
            case ScanStatus.Scanned:
                this.openScanResultEvent.emit(scanTarget)
                break;
        }
        event.stopPropagation();
        console.log("acting on scan target : "+scanTarget.name);
    }

}