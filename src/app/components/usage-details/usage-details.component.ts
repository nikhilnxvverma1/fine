import {Component,OnInit} from '@angular/core';
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";
import {trigger,state,style,transition,animate} from "@angular/animations";

import {DataItem} from "../../core/data-item";
import {ScanTarget} from "../../core/scan-target";
import {ToggleStatus} from "../../core/toggle-status";
import {Folder} from "../../core/folder";
import {SortOption} from "../../core/sort-option";
import {GroupElement} from "../../core/group-element";
import {UnitSpacePipe} from "../unit-space.pipe";
declare var $:any;

@Component({
  selector: 'app-usage-details',
  templateUrl: './usage-details.component.html',
  styleUrls: ['./usage-details.component.scss'],
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
export class UsageDetailsComponent {

    //Important note : instead of using topFolder() we use displayTreeCurrent here everywhere

    @Input("scanTarget") scanTarget:ScanTarget;
    @Input("toggleStatus") toggleStatus:ToggleStatus;
    private _moreItems:DataItem[]=[];
    private _lastGroupElement:GroupElement;

    openUsage(child:DataItem){
        console.log("Open usage for "+child.name)
    }

    selectChild(dataItem:DataItem,event:MouseEvent){

        if(event.shiftKey){
            //var sortedCopy=this.scanTarget.displayTreeCurrent.getDataItem().sort(SortOption.Size,true,true);
            var sortedCopy=this.concatenatedDataItemList();
            dataItem.selected=true;
            UsageDetailsComponent.selectContinuousDataItems(sortedCopy,dataItem);
        }else{
            if(event.metaKey){
                dataItem.selected=!dataItem.selected;
            }else{
                this.scanTarget.topFolder().setSelectionForAll(false);
                dataItem.selected=true;
            }
        }
    }

    /**
     * Makes a list of data items that have the same order has that of the usage detail list.
     * This is done by merging the display tree list of the hovered element with the internal list(_moreItems)
     * @returns {null} list of data items that have the same order has that of the usage detail list
     */
    private concatenatedDataItemList():DataItem[]{
        let mergedList:DataItem[]=[];
        let children = this.scanTarget.displayTreeHovered.getChildren();
        for (var i=0; i<children.length; i++){
            mergedList.push(children[i].getDataItem());
        }

        for (var i=0; i<this._moreItems.length; i++){
            mergedList.push(this._moreItems[i]);
        }
        return mergedList;
    }

    private static selectContinuousDataItems(array:DataItem[], dataItem:DataItem){

        var thisIndex=array.indexOf(dataItem);

        //check if there are any selected items going forwards in index
        var selectionExistsForwardss=false;
        for(var i=thisIndex+1;i<array.length;i++){
            if(array[i].selected){
                selectionExistsForwardss=true;
                break;
            }
        }

        //if there are select everything going forwards until the selection is met
        if (selectionExistsForwardss) {
            for(var i=thisIndex+1;i<array.length;i++){
                if (!array[i].selected) {
                    array[i].selected = true;
                } else {
                    break;
                }
            }
        }else{
            //go backwards
            for(var i=thisIndex-1;i>=0;i--){
                if (!array[i].selected) {
                    array[i].selected = true;
                } else {
                    break;
                }
            }
        }
    }

    showMoreItems(){

        //sort a copy of the children of folder based on size in ascending order
        var sortedCopy=this.scanTarget.displayTreeCurrent.getDataItem().sort(SortOption.Size,false,true);

        //clear the entire array first
        this._moreItems.splice(0,this._moreItems.length);

        //pick the last few elements that were omitted out
        var i=this.scanTarget.displayTreeCurrent.omissionCount-1;
        while(i>=0){
            this._moreItems.push(sortedCopy[i]);
            i--;
        }

        //find and set the last group element from the display list
        for (var i=0;i<this.scanTarget.displayTreeCurrent.children.length;i++){
            if(this.scanTarget.displayTreeCurrent.children[i].isGroup()){
                this._lastGroupElement=<GroupElement>this.scanTarget.displayTreeCurrent.children[i];
            }
        }

        this.scanTarget.showAllItems=true;
    }

    mouseEnterDataName(event:MouseEvent){
        //this event is defined on the parent
        var divContainer=(<HTMLElement>event.target);

        //but we will refer to the span child as element and
        //the div container as parent here
        var element=$(divContainer).find("span")[0];
        var parent=divContainer;

        //start a rolling animation if the element width
        //is greater than the parent's width
        let elementWidth:number=$(element).width();
        let parentWidth:number = $(parent).width();
        if(elementWidth>parentWidth){

            //prevent the text overflow from showing dots ...
            $(parent).css("text-overflow","clip");

            //repeat a rolling animation
            var rollLoop=(elementWidth:number,parentWidth:number,duration:number,firstIterationComplete:boolean)=>{
                $(element).animate({
                    "margin-left":"-"+elementWidth+"px"
                    },
                    duration,
                    "linear",
                    ()=>{
                        $(element).css("margin-left",10+parentWidth+"px");//added extra so that the dots don't show up

                        //second iteration onwards duration will be doubled
                        //because its travelling twice the length
                        var newDuration=firstIterationComplete?duration:duration*2;
                        rollLoop(elementWidth,parentWidth,newDuration,true);
                    });
            };
            rollLoop(elementWidth,parentWidth,3000,false);
        }
        event.stopPropagation();
    }

    mouseExitDataName(event:MouseEvent){

        //this event is defined on the parent
        var divContainer=(<HTMLElement>event.target);

        //but we will refer to the span child as element and
        //the div container as parent here
        var element=$(divContainer).find("span")[0];
        var parent=divContainer;

        //stop rolling animations which will only be the case if
        //the element width is greater than the parent
        let elementWidth:number=$(element).width();
        let parentWidth:number = $(parent).width();
        if(elementWidth>parentWidth){

            //revert back to dots for text overflow
            $(parent).css("text-overflow","ellipsis");

            //stop the animation and reset margin
            $(element).css("margin-left","0px");
            $(element).stop();
        }
        event.stopPropagation();
    }
}
