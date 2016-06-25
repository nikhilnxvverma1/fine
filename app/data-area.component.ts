import {Component,OnInit} from '@angular/core';
import {DataItemComponent} from "./data-item.component";
import {Input} from "@angular/core";
import {Context} from "./core/context";
import {RootModel} from "./core/root-model";
import {OnChanges} from "@angular/core";
import {Data} from "./core/data";
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {DataItem} from "./core/data-item";
import {Folder} from "./core/folder";
import {trigger,state,style,transition,animate} from "@angular/core";
import {ToggleStatus} from "./core/toggle-status";

@Component({
    selector: 'data-area',
    templateUrl:'app/template/data-area.component.html',
    directives: [DataItemComponent],
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
export class DataAreaComponent implements OnInit,OnChanges{

    private _isSortByMenuOpen=false;
    @Input("toggleStatus") toggleStatus:ToggleStatus;


    get isSortByMenuOpen():boolean {
        return this._isSortByMenuOpen;
    }

    set isSortByMenuOpen(value:boolean) {
        this._isSortByMenuOpen = value;
    }

    ngOnChanges(changes:{}):any {
        console.log("Changes made to the rootmodel len="+this.dataItems.length);
        return undefined;
    }
    ngOnInit():any {
        return undefined;
    }

    //@Input('context') public context:Context;
    @Input('dataItems') public dataItems:DataItem[];
    @Output('opendataitem') openDataItemEvent:EventEmitter=new EventEmitter();
    @Input('dummyFolder') public dummyFolder:Folder;

    openDataItem(dataItem){
        console.log("will open data item"+dataItem.name);
        this.openDataItemEvent.emit(dataItem);
    }

    toggleSortByMenu(event){
        this.isSortByMenuOpen=!this.isSortByMenuOpen;
        event.stopPropagation()

    }

    selectSortOption(event){
        this.isSortByMenuOpen=false;
        event.stopPropagation()
    }

    getSortByMenuState(){
        return this._isSortByMenuOpen?"open":"close";
    }

}