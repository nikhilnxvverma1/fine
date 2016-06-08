/**
 * Created by NikhilVerma on 08/06/16.
 */
import { Pipe, PipeTransform } from '@angular/core';
import {DataItem} from '../core/data-item';
/*
 * Returns a string with a prefix attached followed by underscore.
 * Also replaces any subsequent spaces with underscores.
 * Usage:
 *   value | prefixRemoveSpace:prefix
 * Example:
 *   {{ filename with spaces |  prefixRemoveSpace:'delete'}}
 *   formats to: delete_filename_with_spaces
 */
@Pipe({name: 'prefixRemoveSpace'})
export class PrefixAndRemoveSpace implements PipeTransform {
    transform(filename: string,prefix:string) {
        var withSpaces:string=prefix+'_'+filename;
        return withSpaces.replace(/\s+/,'_');
    }
}
