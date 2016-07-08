/**
 * Created by NikhilVerma on 19/06/16.
 */

import {Component,OnInit} from '@angular/core';
import {DataItem} from "./core/data-item";
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";

import {ScanTarget} from "./core/scan-target";
import {UnitSpace} from "./pipe/unit-space.pipe";
import {ToggleStatus} from "./core/toggle-status";
import {trigger,state,style,transition,animate} from "@angular/core";
import {Folder} from "./core/folder";

@Component({
    selector: 'usageDetail',
    templateUrl:'app/template/usage-detail.component.html',
    pipes:[UnitSpace],
    animations:[
        trigger("usageHeaderToggle",[
            state("analyze",style({
                left:"0px",
                opacity:"1"
            })),
            state("organize",style({
                left:"300px",
                opacity:"0"
            })),
            transition("analyze => organize",animate("0.4s ease-out")),
            transition("organize => analyze",animate("0.4s 0.4s ease-in"))
        ]),
        trigger("usageDetailListToggle",[
            state("analyze",style({
                top:"0",
                opacity:"1"
            })),
            state("organize",style({
                top:"200px",
                opacity:"0"
            })),
            transition("analyze => organize",animate("0.4s ease-out")),
            transition("organize => analyze",animate("0.4s 0.4s ease-in"))
        ]),
        trigger("legendToggle",[
            state("analyze",style({
                transform:"scale(1,1)"
            })),
            state("organize",style({
                transform:"scale(0,0)"
            })),
            transition("analyze => organize",animate("0.4s ease-out")),
            transition("organize => analyze",animate("0.4s 0.4s ease-in"))
        ]),
        trigger("sizeToggle",[//<-- for some weird reason this thing makes slide in animation of the header work on the size
            state("analyze",style({
                opacity:"1"
            })),
            state("organize",style({
                opacity:"0"
            })),
            transition("analyze => organize",animate("0.4s ease-out")),
            transition("organize => analyze",animate("0.4s 0.4s ease-in"))
        ]),
    ]
})
export class UsageDetailComponent {

    @Input("scanTarget") scanTarget:ScanTarget;
    @Input("toggleStatus") toggleStatus:ToggleStatus;


    openUsage(child:DataItem){
        console.log("Open usage for "+child.name)
    }

    selectChild(dataItem:DataItem,event:MouseEvent){

        if(event.shiftKey){
            dataItem.selected=true;
            this.scanTarget.topFolder().selectPrecedingDataItems(dataItem);
        }else{
            if(event.metaKey){
                dataItem.selected=!dataItem.selected;
            }else{
                this.scanTarget.topFolder().setSelectionForAll(false);
                dataItem.selected=true;
            }
        }
    }
}
