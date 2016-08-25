/**
 * Created by NikhilVerma on 16/08/16.
 */
import {DisplayElement} from "./display-element";
import {Folder} from "./folder";

export class GroupElement extends DisplayElement{

    private _folder:Folder;
    private _children:DisplayElement[];
    private _omissionSize:number;
    private _omissionCount:number;

    set folder(value:Folder) {
        this._folder = value;
    }

    public isGroup():boolean {
        return true;
    }

    public getChildren():DisplayElement[] {
        return this._children;
    }

    get omissionSize():number {
        return this._omissionSize;
    }

    set omissionSize(value:number) {
        this._omissionSize = value;
    }

    get omissionCount():number {
        return this._omissionCount;
    }

    set omissionCount(value:number) {
        this._omissionCount = value;
    }

    set children(value:DisplayElement[]) {
        this._children = value;
    }

    get children():DisplayElement[] {
        return this._children;
    }

    public getDataItem():Folder {
        return this._folder;
    }
}