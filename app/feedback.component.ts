/**
 * Created by NikhilVerma on 18/06/16.
 */

import {Component,OnInit} from '@angular/core';
import {DataItem} from "./core/data-item";
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";

import {ScanTarget} from "./core/scan-target";

@Component({
    selector: 'feedback',
    templateUrl:'app/template/feedback.component.html'
})
export class FeedbackComponent implements OnInit{
    ngOnInit():any {
        //TODO check stored flag, it is set, send feedback to server and reset flag
        return undefined;
    }

    private message:string;

    send(){

        console.log("Message by user :"+this.message);
        //TODO send feedback to server if online,
        //TODO if offline, collect feedback and store it somewhere and set flag
    }

}
