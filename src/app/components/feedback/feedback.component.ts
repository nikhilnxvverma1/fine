import {Component,OnInit} from '@angular/core';
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";
import {trigger,state,style,transition,animate} from "@angular/animations";
import {DataItem} from "../../core/data-item";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  animations:[
	trigger('feedbackState',[
		state('open',style({
			bottom:"30px",
			right:"5px",
			transform: "scale(1, 1)",
			opacity: "1"
		})),
		state('close',style({
			bottom:"-100px",
			right:"-200px",
			transform: "scale(0, 0)",
			opacity: "0"
		})),
		transition('open => close',animate('100ms ease-in')),
		transition('close => open',animate('100ms ease-out')),
	])
  ]
})
export class FeedbackComponent implements OnInit{
    ngOnInit():any {
        //TODO check stored flag, it is set, send feedback to server and reset flag
        return undefined;
    }

    private message:string;
    private _isFeedbackOpen:boolean=false;


    get isFeedbackOpen():boolean {
        return this._isFeedbackOpen;
    }

    set isFeedbackOpen(value:boolean) {
        this._isFeedbackOpen = value;
    }

    send(){

        console.log("Message by user :"+this.message);
        //TODO send feedback to server if online,
        //TODO if offline, collect feedback and store it somewhere and set flag
    }

    closeFeedbackForm(){
        this.isFeedbackOpen=false;
    }

    getFeedbackState(){
        return this.isFeedbackOpen?"open":"close";
    }

}
