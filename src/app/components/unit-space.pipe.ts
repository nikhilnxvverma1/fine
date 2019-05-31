/**
 * Created by NikhilVerma on 19/06/16.
 */

import { Pipe, PipeTransform } from '@angular/core';
import {DataItem} from '../core/data-item';
/*
 * Returns a formatted string for a space given in bytes.
 * Result could either be in GB, MB or KB depending upon how big it is
 *
 * Usage:
 *   value | unitSpace
 */
@Pipe({name: 'unitSpace'})
export class UnitSpacePipe implements PipeTransform {
    transform(spaceInBytes: string) {
        var bytes:number=parseInt(spaceInBytes);
        var toGb:number=bytes/1073741824 ;
        var formatted:string;
        if(toGb<1){
            var toMb=bytes/1048576;
            if(toMb<1){
                var toKb=bytes/1024;
                formatted=this.round(toKb,1)+" KB";
            }else{
                formatted=this.round(toMb,1)+" MB";
            }
        }else{
            formatted=this.round(toGb,1)+" GB";
        }
        return formatted;
    }

    round(value:number,precision:number):number{
        var multiplier=Math.pow(10,precision||0);
        return Math.round(value*multiplier)/multiplier;
    }
}
