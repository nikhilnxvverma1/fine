import {Component,OnInit} from '@angular/core';
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";
import {trigger,state,style,transition,animate} from "@angular/animations";
import {Folder} from "../../core/folder";
import {ToggleStatus} from "../../core/toggle-status";
import * as $ from 'jquery';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.scss'],
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
    @Output("move") moveEvent=new EventEmitter<boolean>();
    @Output("reviewDelete") deleteEvent=new EventEmitter();
    @Output("rename") renameEvent=new EventEmitter<string>();
    @Output("group") groupEvent=new EventEmitter<string>();
    @Input("toggleStatus") toggleStatus:ToggleStatus;

    private newName:string="";

    ngOnInit():any {
		
        //initialization of the collapsible popouts
        // $('.collapsible').collapsible({// TODO fix imports or find alternative
        //     accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        // });
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
        this.dummyFolder.name='';
    }

}
