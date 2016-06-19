/**
 * Created by NikhilVerma on 19/06/16.
 */

import {Component,OnInit} from '@angular/core';
import {DataItem} from "./core/data-item";
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";

import {ScanTarget} from "./core/scan-target";
import {UnitSpace} from "./pipe/unit-space.pipe";

@Component({
    selector: 'usageDetail',
    templateUrl:'app/template/usage-detail.component.html',
    pipes:[UnitSpace]
})
export class UsageDetailComponent {

    @Input("scanResult") root:DataItem;

}
