import {Component} from '@angular/core';
import {Input} from "@angular/core";
import {Tag} from "../../core/tag";
import {TextTag} from "../../core/text-tag";
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";

@Component({
  selector: 'app-selection-field',
  templateUrl: './selection-field.component.html',
  styleUrls: ['./selection-field.component.scss']
})
export class SelectionFieldComponent {
    @Input('tags')public  tags:Tag[];
    @Output('tagadded') tagAddedEvent=new EventEmitter<Tag>();
    @Output('tagremoved') tagRemovedEvent=new EventEmitter<Tag>();

    currentInput:string;

    addTagOnSpace(keyboardEvent:KeyboardEvent){

        if(keyboardEvent.keyCode==32||keyboardEvent.keyCode==13||keyboardEvent.keyCode==188){//keycode for space,enter,comma respectively

            //add tag for the current input
            //but
            //cut out the last character because it was delimiter
            let inputText = this.currentInput.substr(0,this.currentInput.length-1);
            this.addTag(inputText);
            this.currentInput="";
        }
    }

    addTag(tagText:string){
        let textTag = new TextTag(tagText);
        this.tags.push(textTag);

        //make selections by configuring output back to the context-component
        this.tagAddedEvent.emit(textTag);
    }

    removeTag(tag:Tag){
        console.log("Removing tag "+tag.name);
        var index=this.tags.indexOf(tag);
        this.tags.splice(index,1);

        //make selections by configuring output back to the context-component
        this.tagRemovedEvent.emit(tag);
    }

}