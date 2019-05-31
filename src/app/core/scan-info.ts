/**
 * Created by NikhilVerma on 11/07/16.
 */
import {Folder} from "./folder";
import {DataService} from "./data.service";
import {Tracker} from "./tracker";

export class ScanInfo{
    private _parent:Folder;
    private _dataService:DataService;
    private _tracker:Tracker;

    constructor(parent:Folder, dataService:DataService,tracker:Tracker) {
        this._parent = parent;
        this._dataService = dataService;
        this._tracker=tracker;
    }

    get parent():Folder {
        return this._parent;
    }

    get dataService():DataService {
        return this._dataService;
    }

    get tracker():Tracker {
        return this._tracker;
    }
}