/**
 * Created by NikhilVerma on 28/06/16.
 */

export class Point{
    private _x:number;
    private _y:number;

    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

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

    public static pageToLocal(element:Element,pageX:number,pageY:number):Point{
        var rect=element.getBoundingClientRect();
        return new Point(pageX-rect.left,pageY-rect.top);
    }
}