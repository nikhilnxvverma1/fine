import {DisplayElement} from "./display-element";
/**
 * Created by NikhilVerma on 16/08/16.
 */

export class LeafElement extends DisplayElement{
    private _file:File;

    set file(value:File) {
        this._file = value;
    }

    getDataItem():File {
        return undefined;
    }

}