/**
 * Created by NikhilVerma on 18/06/16.
 */


import {Component,ViewChild} from '@angular/core';
import {DataItem} from "./core/data-item";
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";
import {trigger,state,style,transition,animate} from "@angular/core";

import {ScanTarget} from "./core/scan-target";
import {FeedbackComponent} from "./feedback.component";
import {UnitSpace} from "./pipe/unit-space.pipe";

@Component({
    selector: 'main-menu',
    templateUrl:'app/template/main-menu.component.html',
    directives: [FeedbackComponent],
    pipes:[UnitSpace],
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
    private _isMenuOpen:boolean;
    constructor(private _zone:NgZone) {}
    @ViewChild(FeedbackComponent)private  _feedback:FeedbackComponent;

    get isMenuOpen():boolean {
        return this._isMenuOpen;
    }

    set isMenuOpen(value:boolean) {
        this._isMenuOpen = value;
    }

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
        this._feedback.isFeedbackOpen=!this._feedback.isFeedbackOpen;
    }

    changeMenuStateToClose(){
        this.isMenuOpen=false;
        this._feedback.isFeedbackOpen=false;
    }

    getMenuState(){
        return this.isMenuOpen?"open":"close";
    }

}