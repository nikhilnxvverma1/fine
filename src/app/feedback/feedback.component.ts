import {Component,OnInit} from '@angular/core';
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";
import {trigger,state,style,transition,animate} from "@angular/core";
import {DataItem} from "../../core/data-item";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
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
