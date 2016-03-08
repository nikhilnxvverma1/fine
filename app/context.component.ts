import {Component} from 'angular2/core';
import {DataService} from "./core/data.service";
import {RootModel} from "./core/root-model";
import {Input} from "angular2/core";
import {DataItem} from "./core/data-item";
import {Context} from "./core/context";
import {Data} from "./core/data";
import {SelectionFieldComponent} from "./selection-field.component";
import {DataAreaComponent} from "./data-area.component";
import {InfoBoxComponent} from "./info-box.component";
import {Output,EventEmitter} from "angular2/core";

@Component({
    selector: 'folder-context',
    directives:[SelectionFieldComponent,DataAreaComponent,InfoBoxComponent],
    templateUrl:'app/template/context.component.html',
})
export class ContextComponent {

    @Input('context') public context:Context;
    @Output('opendir') openDir:EventEmitter=new EventEmitter();

    addNewContext(folder){
        console.log("will open folder"+folder.name);
        this.openDir.emit(folder);
    }
}