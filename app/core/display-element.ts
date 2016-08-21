import {DataItem} from "./data-item";
import {GroupElement} from "./group-element";
/**
 * Created by NikhilVerma on 16/08/16.
 */

export abstract class DisplayElement{
    private _x:number;
    private _y:number;
    private _dx:number;
    private _dy:number;
    private _t:number=0;//used for arc tweening
    private _parent:GroupElement;

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

    get t():number {
        return this._t;
    }

    set t(value:number) {
        this._t = value;
    }

    get parent():GroupElement {
        return this._parent;
    }

    set parent(value:GroupElement) {
        this._parent = value;
    }

    public isGroup():boolean{
        return false;
    }

    public getChildren():DisplayElement[]{
        return null;
    }

    public abstract getDataItem():DataItem;
}