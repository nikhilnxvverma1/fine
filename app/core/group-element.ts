/**
 * Created by NikhilVerma on 16/08/16.
 */
import {DisplayElement} from "./display-element";
import {Folder} from "./folder";

export class GroupElement extends DisplayElement{

    private _folder:Folder;
    private _descendants:DisplayElement[];
    private _omissionSize:number;
    private _omissionCount:number;

    set folder(value:Folder) {
        this._folder = value;
    }

    public isGroup():boolean {
        return super.isGroup();
    }

    public getChildren():DisplayElement[] {
        return super.getChildren();
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

    set descendants(value:Array) {
        this._descendants = value;
    }

    public getDataItem():Folder {
        return this._folder;
    }
}