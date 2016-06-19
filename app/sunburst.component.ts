/**
 * Created by NikhilVerma on 19/06/16.
 */


import {Component,OnInit} from '@angular/core';
import {DataItem} from "./core/data-item";
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";

import {ScanTarget} from "./core/scan-target";

@Component({
    selector: 'sunburst',
    templateUrl:'app/template/sunburst.component.html'
})
export class SunburstComponent {

    @Input("scanResult") root:DataItem;

}
