/**
 * Created by NikhilVerma on 08/06/16.
 */
import { Pipe, PipeTransform } from '@angular/core';
import {DataItem} from '../core/data-item';
/*
 * Returns the data item only if it is selected.
 * Useful when filtering selected data items in a loop
 * Usage:
 *   value | selectedDataItems
 * Example:
 *   {{ dataItem |  selectedDataItems}}
 *   formats to: 1024
 */
@Pipe({name: 'selectedDataItems'})
export class SelectedDataItemPipe implements PipeTransform {
    transform(value: DataItem[],args?) {
        console.log("executing pipe");
        return value.filter(dataItem=>{
            console.log(dataItem.name+" is selected :"+dataItem.selected);
            return dataItem.selected;
        });
    }
}
