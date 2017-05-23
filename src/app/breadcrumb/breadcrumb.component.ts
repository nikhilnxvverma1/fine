import {Component,ViewChild,ElementRef,HostListener} from '@angular/core';
import {DataService} from "../../core/data.service";
import {RootModel} from "../../core/root-model";
import {Input} from "@angular/core";
import {DataItem} from "../../core/data-item";
import {Context} from "../../core/context";
import {Data} from "../../core/data";
import {Output,EventEmitter} from "@angular/core";
import {ContextComponent} from "../context/context.component";
import {OnChanges,AfterViewChecked} from "@angular/core";
import {ChangeDetectorRef} from "@angular/core";
import {NgZone} from "@angular/core";
import {ScanTarget} from "../../core/scan-target";
import {Folder} from "../../core/folder";
import {GroupElement} from "../../core/group-element";
declare var $:any;

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements AfterViewChecked{

    //@Input('menuState') private _menuState:string;
    @Input('scanTarget') private _scanTarget:ScanTarget;
    @Input('rootModel') public rootModel:RootModel;
    @Input('contextStack') public contextStack:Context[];
    @Output('opendataitem') openDataItemEvent=new EventEmitter<DataItem>();
    @Output('openMainMenu') openMainMenuEvent=new EventEmitter<BreadcrumbComponent>();
    @ViewChild(ContextComponent) private _contextComponent:ContextComponent;

    //----------------Breadcrumb contraction handling--------------------
    @ViewChild('breadcrumbContainerStrip') private _breadcrumbContainerStrip:ElementRef;
    @ViewChild('menuLink') private _menuLink:ElementRef;

    /** This will be binded to the widths of the div elements*/
    private _breadcrumbWidths:number[]=[];

    /** Used as a final target while animating the widths*/
    private _targetBreadcrumbWidths:number[]=[];

    private _hoveredElement:HTMLElement;

    //the time is in milliseconds
    private _breadcrumbContractionAnimationTimeLimit=100;
    private _animationIntervalDelay=5;
    private _currentAnimationTime=0;
    private _breadcrumbAnimationTimerId:NodeJS.Timer;
    private _breadcrumbChanged=false;
    private _doBreadcrumbItemsNeedToContract=false;



    constructor(private _dataService: DataService,private _zone:NgZone) {}

    ngAfterViewChecked(){
        if (this._breadcrumbChanged) {
            this._breadcrumbChanged=false;
            //triggering another change after change detection is not allowed in angular 2
            //because of potential cascading effects, therefore using setTimeout
            window.setTimeout(()=>{this.updateBreadcrumbWidths(true)});
        }
    }

    @HostListener('window:resize',['$event'])
    onResize(event:Event){
        //relayout the breadcrumb without the animation
        this.updateBreadcrumbWidths(false);
    }

    openRoot(){

        var dialog=require('electron').remote.dialog;

        dialog.showOpenDialog({ properties: ['openDirectory']},(folderToOpen)=>{
            this._zone.run(()=>{

                if(folderToOpen==null) return;
                var dataItems:DataItem[]=this._dataService.readDirectory(folderToOpen[0]);//this also needs to happen inside ng zone
                this.rootModel.rootDirectory=folderToOpen[0];
                //create a new context holding the value of the root now
                var context=new Context();//null context meaning root
                context.dataItems=dataItems;
                //this.rootModel.contextStack.splice(0,this.rootModel.contextStack.length);
                //this.rootModel.contextStack.push(context);
                this.contextStack.splice(0,this.rootModel.contextStack.length);
                this.contextStack.push(context);
                console.log('RootModel Model folder: '+this.rootModel.rootDirectory);

            });
        });
    }

    backTo(folder:Folder){

        var index:number=this._scanTarget.folderStack.indexOf(folder);
        if(index==this._scanTarget.folderStack.length-1) return;

        //going back by that much amount
        var parentsToSkip=this._scanTarget.folderStack.length-(index+1);

        this._scanTarget.folderStack.splice(index+1,this._scanTarget.folderStack.length);

        //go up the hierarchy by skipping those many parents
        var i=0;
        while(i<parentsToSkip){
            this._scanTarget.displayTreeCurrent=this._scanTarget.displayTreeCurrent.parent;
            i++;
        }

        //for the new current working directory, rebuild the sunburst
        this._contextComponent.getSunburstComponent().makeSunburst(this._scanTarget.displayTreeCurrent,false);

        //update the breadcrumb widths
        this._breadcrumbChanged=true;
    }

    openDataItem(dataItem:DataItem){

        if(dataItem.isDirectory()){
            (<Folder>dataItem).sort(this._scanTarget.sortOption,false,false);
            this._scanTarget.folderStack.push(<Folder>dataItem);
            var newGroupElement=<GroupElement>this._scanTarget.displayElementFor(dataItem);
            if(newGroupElement==null){
                newGroupElement=this._scanTarget.createNewGroupElementUnderCurrent(<Folder>dataItem);
            }
            this._scanTarget.displayTreeCurrent=newGroupElement;

            //update the breadcrumb widths
            this._breadcrumbChanged=true;

        }else{

            //mind the subtle difference here. command line "open" requires those quotes for the full path
            let filePath=dataItem.getFullyQualifiedPath();
            var spawn = require('child_process').spawn;
            spawn('open', [filePath]);
        }
    }

    openMainMenu(){
        this.openMainMenuEvent.emit(this);
    }

    jumpedToFolder(dataItem:DataItem){
        //update the breadcrumb widths
        this._breadcrumbChanged=true;
    }

    hoveredOverBreadcrumbItem(event:Event){
        this._hoveredElement=<HTMLElement>event.target;
        this.updateBreadcrumbWidths(true);
    }

    hoveredOutOfBreadcrumbArea(){
        this._hoveredElement=null;
        this.updateBreadcrumbWidths(true);
    }

    private shrinkWidthArraysIfNeeded(){
        var totalBreadcrumbItems=this._scanTarget.folderStack.length;

        if(this._breadcrumbWidths.length>totalBreadcrumbItems){
            var deleteCount=this._breadcrumbWidths.length-totalBreadcrumbItems;
            this._breadcrumbWidths.splice(totalBreadcrumbItems,deleteCount);
        }

        if(this._targetBreadcrumbWidths.length>totalBreadcrumbItems){
            var deleteCount=this._targetBreadcrumbWidths.length-totalBreadcrumbItems;
            this._targetBreadcrumbWidths.splice(totalBreadcrumbItems,deleteCount);
        }
    }

    updateBreadcrumbWidths(shouldAnimate:boolean){
        console.log("updating widts of breadcrumbs");
        this.shrinkWidthArraysIfNeeded();

        //get the native container and its width
        let container = (<HTMLElement>this._breadcrumbContainerStrip.nativeElement);
        let containerWidth=container.offsetWidth;

        //subtract the padding and the menu link to get the actual available width
        var availableWidth=containerWidth
            -this.pixelsToNumbers($(container).css('padding-left'))
            -this.pixelsToNumbers($(container).css('padding-right'))
            -(<HTMLElement>this._menuLink.nativeElement).offsetWidth;

        //element with full width will either be the hovered element(if exists) otherwise the last element
        var fullWidthElement=<HTMLDivElement>(this._hoveredElement!=null?this._hoveredElement:this.lastChildElement(container));
        var reservedWidth=(<HTMLSpanElement>this.firstChildElement(fullWidthElement)).offsetWidth;
        //if (2<3) {//dev purposes only
        //    return;
        //}

        //in order to accommodate the reserved width, we will need to fit everything
        //else in the remaining space
        var remainingWidth=availableWidth-reservedWidth;

        //we will need to find the needed width for all remaining items
        var neededWidth=0;
        for(var i=0;i<container.children.length;i++) {
            //exclude the menu link and the fullWidthElement
            let child = <HTMLElement>container.children[i];
            if ((child != this._menuLink.nativeElement)&&
                (child!=fullWidthElement)){
                neededWidth+=(<HTMLSpanElement>(this.firstChildElement(child))).offsetWidth;
            }
        }

        //Important: due to floating point round off and minor differences in widths
        //between child and container parent, we throw in some more extra
        //width for a safe measure
        neededWidth+=100;

        //set a flag if items need to contract, this is used at the template
        this._doBreadcrumbItemsNeedToContract=neededWidth>remainingWidth;

        //computing the fraction to reduce the needed width in order to fit in the remaining space
        var reduceByFraction=remainingWidth/neededWidth;

        //loop through each element of the container and set contracted widths
        for(var i=0;i<container.children.length;i++){

            //exclude the menu link
            let child = <HTMLElement>container.children[i];
            if(child!=this._menuLink.nativeElement){

                var breadcrumbItemWidth=0;

                if (child==fullWidthElement) {
                    breadcrumbItemWidth=reservedWidth;
                }else{

                    //get the width of the child which is indicates the width occupied content
                    var fullWidth = (<HTMLSpanElement>(this.firstChildElement(child))).offsetWidth;

                    breadcrumbItemWidth = this._doBreadcrumbItemsNeedToContract
                        ? fullWidth * reduceByFraction
                        : fullWidth;
                }

                this.changeWidthAtIndex(breadcrumbItemWidth,i-1,shouldAnimate);//subtracting the first menu link for index

            }
        }

        //clear the previous animation if any
        clearInterval(this._breadcrumbAnimationTimerId);

        if(shouldAnimate){
            this._breadcrumbAnimationTimerId=setInterval(()=>{this.animateBreadcrumbWidthsToTarget()},this._animationIntervalDelay);
        }

    }

    private changeWidthAtIndex(width:number, index:number,setOnTarget:boolean):boolean{
        if(index<this._targetBreadcrumbWidths.length){
            if (setOnTarget) {
                this._targetBreadcrumbWidths[index] = width;
            }else{
                this._breadcrumbWidths[index] = width;
            }
            return false;
        }else{
            var difference=this._targetBreadcrumbWidths.length-(index+1);
            for (var i=0;i<difference;i++){
                this._targetBreadcrumbWidths.push(0);
                this._breadcrumbWidths.push(0);
            }
            if (setOnTarget) {
                this._targetBreadcrumbWidths[index] = width;
                this._breadcrumbWidths[index] = 0;
            }else{
                this._targetBreadcrumbWidths[index] = 0;
                this._breadcrumbWidths[index] = width;
            }
            return true;
        }
    }

    private animateBreadcrumbWidthsToTarget(){
        this._currentAnimationTime+=this._animationIntervalDelay;
        var fraction=this._currentAnimationTime/this._breadcrumbContractionAnimationTimeLimit;

        //loop through each width and progress it to as much fractional part has reached
        for(var i=0;i<this._breadcrumbWidths.length;i++){
            var difference=this._targetBreadcrumbWidths[i]-this._breadcrumbWidths[i];
            this._breadcrumbWidths[i]+=fraction*difference;
        }

        //stop the interval once the timer reaches the limit
        if(this._currentAnimationTime>this._breadcrumbContractionAnimationTimeLimit){
            clearInterval(this._breadcrumbAnimationTimerId);
            this._currentAnimationTime=0;
        }
    }

    /**
     * Generic utility for adding element to an array and growing if the index is out of bounds.
     * Filling the intermediate elements with 0s
     * @param value value to set
     * @param array array to modify
     * @param index index to modify at
     * @returns {boolean} true if the array grew ,false otherwise
     */
    private static changeValueAtIndexAndGrowIfNeeded(value:number, array:number[], index:number):boolean{
        if(index<array.length){
            array[index]=value;
            return false;
        }else{
            var difference=array.length-(index+1);
            for (var i=0;i<difference;i++){
                array.push(0);
            }
            array[index]=value;
            return true;
        }
    }

    /** returns last child element of parent,null if container has no child*/
    private lastChildElement(element:HTMLElement):Element{
        return element.children.length>0?element.children[element.children.length-1]:null;
    }

    /** returns first child element of parent,null if container has no child*/
    private firstChildElement(element:HTMLElement):Element{
        return element.children.length>0?element.children[0]:null;
    }


    /**
     * Parses pixel string value to number
     * @param pixelValue value in number suffixed with px (ex: '23px')
     * @returns {number} absolute number example '23px' to 23
     */
    private pixelsToNumbers(pixelValue:string):number{
        var numberString=pixelValue.substr(0,pixelValue.length-2);
        return parseFloat(numberString);
    }

}
