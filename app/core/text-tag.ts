import {Tag} from "./tag";
export class TextTag extends Tag{
    public text:string;

    constructor(t:string){
        this.text=t;
        this.name=t;
    }

    //set text(t:string){//this causes stack overflow, don't know why
    //    this.text=t;
    //    this.name=this.text;
    //}
}