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
import {SortOption} from "./core/sort-option";

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
    private _moreItems:DataItem[]=[];

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

    showMoreItems(){

        //sort a copy of the children of folder based on size in ascending order
        var sortedCopy=this.scanTarget.displayTreeCurrent.getDataItem().sort(SortOption.Size,true);

        //clear the entire array first
        this._moreItems.splice(0,this._moreItems.length);

        //pick the last few elements that were omitted out
        var i=this.scanTarget.displayTreeCurrent.omissionCount-1;
        while(i>=0){
            this._moreItems.push(sortedCopy[i]);
            i--;
        }
        console.log("omission count "+this.scanTarget.displayTreeCurrent.omissionCount+" size "+this._moreItems.length);

        for (i=0;i<this._moreItems.length;i++){
            console.log("name " +this._moreItems[i].name);
        }

        this.scanTarget.showAllItems=true;
    }
}
