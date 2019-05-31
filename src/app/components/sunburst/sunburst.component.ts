import {Component,OnInit,AfterContentInit,OnChanges} from '@angular/core';
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";
import {trigger,state,style,transition,animate} from "@angular/animations";

import {ScanTarget} from "../../core/scan-target";
import {ToggleStatus} from "../../core/toggle-status";
import {DataItem} from "../../core/data-item";

import {Folder} from "../../core/folder";
import {SortOption} from "../../core/sort-option";
import {GroupElement} from "../../core/group-element";
import {DisplayElement} from "../../core/display-element";
import {LeafElement} from "../../core/leaf-element";

@Component({
  selector: 'app-sunburst',
  templateUrl: './sunburst.component.html',
  styleUrls: ['./sunburst.component.scss'],
  animations:[
        trigger("sunburstChartToggle",[
            state("analyze",style({
                top:"50px",
                opacity:"1"
            })),
            state("organize",style({
                top:"0",
                opacity:"0"
            })),
            transition("analyze => organize",animate("0.4s ease-out")),
            transition("organize => analyze",animate("0.4s 0.4s ease-in"))
        ]),
    ]
})
export class SunburstComponent implements OnInit{

    @Input("scanTarget") scanTarget:ScanTarget;
    @Input("toggleStatus") toggleStatus:ToggleStatus;
    @Output('jumpedToFolder') jumpedToFolderEvent=new EventEmitter<DataItem>();

    static STARTING_CHILDREN_TO_SHOW=32;
    static HALF_TILL_DEPTH=4;
    static MANDATORY_DEPTH=4;
    static MAX_DEPTH=7;
    private _totalElements=0;
    //private _rootGroupElement:GroupElement;
    //private _currentElement:GroupElement;
    private x:number=0;
    private y:number=0;
    private dx:number=0;
    private dy:number=0;

    ngOnInit() {
        this.scanTarget.displayTreeCurrent=this.scanTarget.displayTreeRoot;
        // this.makeSunburst(this.scanTarget.displayTreeCurrent,true);
    }

    makeSunburst(groupElement:GroupElement,entryAnimation:boolean){
		//we are not using this, so we won't bother cleaning up this mess
		console.debug("NO Sunburst ,get rid of the function call");
	}

}
