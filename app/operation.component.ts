/**
 * Created by NikhilVerma on 19/06/16.
 */

import {Component,OnInit} from '@angular/core';
import {DataItem} from "./core/data-item";
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";

import {ScanTarget} from "./core/scan-target";
import {Folder} from "./core/folder";
import {ToggleStatus} from "./core/toggle-status";
import {trigger,state,style,transition,animate} from "@angular/core";

@Component({
    selector: 'operation',
    templateUrl:'app/template/operation.component.html',
    animations:[
        trigger("operationToggle",[
            state("analyze",style({
                top:"200px",
                opacity:"0",
                transform:"scale(0,0)"
            })),
            state("organize",style({
                top:"0px",
                opacity:"1",
                transform:"scale(1,1)"
            })),
            transition("analyze => organize",animate("0.4s 0.4s ease-out")),
            transition("organize => analyze",animate("0.4s ease-in"))
        ]),
    ]
})
export class OperationComponent implements OnInit{

    @Input("dummyFolder") dummyFolder:Folder;
    @Output("move") moveEvent:EventEmitter=new EventEmitter();
    @Output("reviewDelete") deleteEvent:EventEmitter=new EventEmitter();
    @Output("rename") renameEvent:EventEmitter=new EventEmitter();
    @Output("group") groupEvent:EventEmitter=new EventEmitter();
    @Input("toggleStatus") toggleStatus:ToggleStatus;

    private newName:string="";

    ngOnInit():any {

        //initialization of the collapsible popouts
        //noinspection TypeScriptUnresolvedFunction
        $('.collapsible').collapsible({//ignore the red, the method is loaded before
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    }

    private move(deleteAfterMoving:boolean){
        this.moveEvent.emit(deleteAfterMoving);
    }

    private reviewDelete(){
        this.deleteEvent.emit(null);
    }
    private rename(){
        //console.log("new name is "+this.newName);
        this.renameEvent.emit(this.newName);
    }
    private group(){
        this.groupEvent.emit(this.dummyFolder.name);
    }

}
