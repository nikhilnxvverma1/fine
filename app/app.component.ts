import {Component,OnInit} from 'angular2/core';
import {DataService} from './core/data.service'
import {InfoBoxComponent} from "./info-box.component";
import {DataAreaComponent} from "./data-area.component";

@Component({
    selector: 'app',
    templateUrl:'app/template/app.component.html',
    providers: [DataService],
    directives: [DataAreaComponent,InfoBoxComponent],
})
export class AppComponent implements OnInit{
    constructor(private _dataService:DataService){}
    ngOnInit():any {

        //dom initializations
        //noinspection TypeScriptUnresolvedFunction
        $('.collapsible').collapsible({//ignore the red, the method is loaded before
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    }

    openRoot(){
        var remote=require('remote');
        var dialog=remote.require('dialog');
        dialog.showOpenDialog({ properties: ['openDirectory']},(folderToOpen)=>{
           console.log('Root folder: '+folderToOpen);
            this._dataService.readDirectory(folderToOpen[0]);
        });
    }
}