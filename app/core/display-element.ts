import {DataItem} from "./data-item";
/**
 * Created by NikhilVerma on 16/08/16.
 */

export abstract class DisplayElement{
    private _x:number;
    private _y:number;
    private _dx:number;
    private _dy:number;
    private _red:number;
    private _green:number;
    private _blue:number;

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

    get red():number {
        return this._red;
    }

    set red(value:number) {
        this._red = value;
    }

    get green():number {
        return this._green;
    }

    set green(value:number) {
        this._green = value;
    }

    get blue():number {
        return this._blue;
    }

    set blue(value:number) {
        this._blue = value;
    }

    public computeRandomColor(){
        this.red=Math.floor(Math.random()*256+1);
        this.green=Math.floor(Math.random()*256+1);
        this.blue=Math.floor(Math.random()*256+1);
    }

    public colorRGB():string{
        return "rgb("+this.red+","+this.green+","+this.blue+")";
    }

    public isGroup():boolean{
        return false;
    }

    public getChildren():DisplayElement[]{
        return null;
    }

    public abstract getDataItem():DataItem;
}