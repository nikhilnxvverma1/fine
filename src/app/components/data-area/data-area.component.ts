import {Component,OnInit, ElementRef} from '@angular/core';
import {Output} from "@angular/core";
import {Input,ViewChildren,QueryList,ViewChild} from "@angular/core";
import {OnChanges} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {trigger,state,style,transition,animate} from "@angular/animations";
import {DataItemComponent} from "../data-item/data-item.component";
import {Context} from "../../core/context";
import {RootModel} from "../../core/root-model";
import {Data} from "../../core/data";
import {DataItem} from "../../core/data-item";
import {Folder} from "../../core/folder";
import {ToggleStatus} from "../../core/toggle-status";
import {Point} from "../../core/point";
import {SortOption} from "../../core/sort-option";
declare var $:any;

@Component({
  selector: 'app-data-area',
  templateUrl: './data-area.component.html',
  styleUrls: ['./data-area.component.scss'],
  animations:[
        trigger('sortByMenuState',[
            state('open',style({
                visibility:"visible",
                opacity:"1"
            })),
            state('close',style({
                visibility:"hidden",
                opacity:"0"
            })),
            transition('open => close',[animate('100ms')]),
            transition('close => open',[animate('100ms',style({opacity:"1",visibility:"visible"}))]),
        ]),
        trigger("dataAreaItemsToggle",[
            state("analyze",style({
                top:"100px",
                opacity:"0"
            })),
            state("organize",style({
                top:"0px",
                opacity:"1"
            })),
            transition("analyze => organize",animate("0.4s 0.4s ease-out")),
            transition("organize => analyze",animate("0.4s ease-in"))
        ]),
        trigger("subheaderToggle",[
            state("analyze",style({
                top:"-30px",
            })),
            state("organize",style({
                top:"0px",
            })),
            transition("analyze => organize",animate("0.4s 0.4s ease-out")),
            transition("organize => analyze",animate("0.4s ease-in"))
        ]),
    ]
})
export class DataAreaComponent{

    private _isSortByMenuOpen=false;
    @Input("toggleStatus") toggleStatus:ToggleStatus;
    @Input('dataItems') public dataItems:DataItem[];
    @Input('sortOption') public sortOption:SortOption;
    @Output('opendataitem') openDataItemEvent=new EventEmitter<DataItem>();
    @Output('deselectall') deselectEvent=new EventEmitter<DataAreaComponent>();
    @Output('sortby') sortByEvent=new EventEmitter<SortOption>();
    @Input('dummyFolder') public dummyFolder:Folder;

    @ViewChildren(DataItemComponent) dataItemComponents:QueryList<DataItemComponent>;
    @ViewChild('selectionRect') private _selectionRect:ElementRef;
    @ViewChild('dataAreaContainer') private _dataAreaContainer:ElementRef;

    private _initialX:number;
    private _initialY:number;

    get isSortByMenuOpen():boolean {
        return this._isSortByMenuOpen;
    }

    set isSortByMenuOpen(value:boolean) {
        this._isSortByMenuOpen = value;
    }

    openDataItem(dataItem:DataItem){
        console.log("will open data item"+dataItem.name);
        this.openDataItemEvent.emit(dataItem);
        if(dataItem.isDirectory()){
            this._dataAreaContainer.nativeElement.scrollTop=0;
        }
    }

    toggleSortByMenu(event){
        this.isSortByMenuOpen=!this.isSortByMenuOpen;
        //this.isSortByMenuOpen=true;
        event.stopPropagation()
    }

    selectSortOption(sortOptionInt,event){
        console.log("sort option selected");
        this.isSortByMenuOpen=false;
        event.stopPropagation();
        var sortOption:SortOption=sortOptionInt;
        this.sortByEvent.emit(sortOption);
    }

    getSortByMenuState(){
        return this._isSortByMenuOpen?"open":"close";
    }


    /**Mouse event**/

    mouseDown(event:MouseEvent){
        let element = this._dataAreaContainer.nativeElement;
        var local=Point.pageToLocal(element,event.pageX,event.pageY);
        var selectionDiv=this._selectionRect.nativeElement;
        selectionDiv.style.visibility='visible';
        selectionDiv.style.top=local.y+element.scrollTop;
        selectionDiv.style.left=local.x;
        selectionDiv.style.width=0;
        selectionDiv.style.height=0;
        this._initialX=local.x;
        this._initialY=local.y;

        //this.context.setSelectionForAll(false);
        if (!event.metaKey) {
            this.deselectEvent.emit(this);
        }

    }

    mouseMove(event:MouseEvent){
        //only if left button is pressed
        if (event.buttons == 1) {

            var local=Point.pageToLocal(this._dataAreaContainer.nativeElement,event.pageX,event.pageY);

            var selectionDiv=this._selectionRect.nativeElement;
            var width=(local.x-this._initialX);
            if(width<0){
                selectionDiv.style.left=local.x;
                selectionDiv.style.width=width*-1;
            }else{
                selectionDiv.style.width=width;
            }

            var height=(local.y-this._initialY);
            if(height<0){
                let element = this._dataAreaContainer.nativeElement;
                selectionDiv.style.top=local.y+element.scrollTop;;
                selectionDiv.style.height=height*-1;//just making it positive
            }else{
                selectionDiv.style.height=height;
            }

            //select overlapping and invert if the meta key was down
            this.selectOverlappingDataItems(selectionDiv.getBoundingClientRect(),event.metaKey);
        }
    }

    mouseUp(event:MouseEvent){
        var selectionDiv=this._selectionRect.nativeElement;
        selectionDiv.style.visibility='hidden';
    }

    mouseOut(event:MouseEvent){
        console.log("mouse out "+event.x+","+event.y);
        var selectionDiv=this._selectionRect.nativeElement;
        selectionDiv.style.visibility='hidden';
    }

    private selectOverlappingDataItems(rect:ClientRect,metaKeyDown:boolean):number{
        var totalSelected=0;
        this.dataItemComponents.forEach(function (dataItemComponent:DataItemComponent,i:number){
            var element=dataItemComponent.elementRef.nativeElement.firstChild;
            var span=$(element).find("img")[0];
            var dataItemRect=span.getBoundingClientRect();
            if(DataAreaComponent.overlaps(rect,dataItemRect)){

                //dataItemComponent.dataItem.selected=metaKeyDown?!dataItemComponent.dataItem.selected:true;
                dataItemComponent.dataItem.selected=true;
                totalSelected++;
            }else if(!metaKeyDown){
                dataItemComponent.dataItem.selected=false;
            }
        });
        return totalSelected;
    }

    public static overlaps(rect1:ClientRect,rect2:ClientRect):boolean{
        return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
    }

    selectPrecedingDataItems(dataItem:DataItem){
        var endIndex=this.dataItems.indexOf(dataItem);
        var i=endIndex-1;
        while(i>=0){
            if(!this.dataItems[i].selected){
                this.dataItems[i].selected=true;
            }else{
                break;
            }
            i--;
        }
    }


}