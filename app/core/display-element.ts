import {DataItem} from "./data-item";
/**
 * Created by NikhilVerma on 16/08/16.
 */

export abstract class DisplayElement{
    private _x:number;
    private _y:number;
    private _dx:number;
    private _dy:number;

    get x():number {
        return this._x;
    }

    set x(value:number) {
        this._x = value;
    }

    get y():number {
        return this._y;
    }

    set y(value:number) {
        this._y = value;
    }

    get dx():number {
        return this._dx;
    }

    set dx(value:number) {
        this._dx = value;
    }

    get dy():number {
        return this._dy;
    }

    set dy(value:number) {
        this._dy = value;
    }

    public isGroup():boolean{
        return false;
    }

    public getChildren():DisplayElement[]{
        return null;
    }

    public abstract getDataItem():DataItem;
}