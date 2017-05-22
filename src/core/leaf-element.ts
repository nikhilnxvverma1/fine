import {DisplayElement} from "./display-element";
import {DataItem} from "./data-item";
import {File} from "./file";
/**
 * Created by NikhilVerma on 16/08/16.
 */

export class LeafElement extends DisplayElement{
    private _file:File;

    set file(value:DataItem) {
        this._file = <File>value;
    }

    getDataItem():File {
        return this._file;
    }

}