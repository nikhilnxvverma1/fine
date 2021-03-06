/**
 * Created by NikhilVerma on 11/07/16.
 */

import {ScanStatus} from "./scan-status";
import {ScanTarget} from "./scan-target";
import {GroupElement} from "./group-element";

export class Tracker{
    private _sizeScannedSoFar:number;
    private _scanStatus:ScanStatus;
    private _totalChildrenOfRoot:number;
    private _scanTarget:ScanTarget;

    constructor(scanTarget:ScanTarget) {
        this.sizeScannedSoFar=0;
        this.scanStatus=ScanStatus.Unscanned;
        this._scanTarget=scanTarget;
    }

    get sizeScannedSoFar():number {
        return this._sizeScannedSoFar;
    }

    set sizeScannedSoFar(value:number) {
        this._sizeScannedSoFar = value;
    }

    get scanStatus():ScanStatus {
        return this._scanStatus;
    }

    set scanStatus(value:ScanStatus) {
        this._scanStatus = value;
    }

    get totalChildrenOfRoot():number {
        return this._totalChildrenOfRoot;
    }

    set totalChildrenOfRoot(value:number) {
        this._totalChildrenOfRoot = value;
    }

    public addSize(size:number){
        this.sizeScannedSoFar=this.sizeScannedSoFar+size;
    }
    public scanDidStart(){
        this.sizeScannedSoFar=0;
        this.scanStatus=ScanStatus.CurrentlyScanning;
    }

    public scanDidEnd(){
        this.scanStatus=ScanStatus.Scanned;
        this._scanTarget.displayTreeRoot=new GroupElement();
        this._scanTarget.displayTreeRoot.folder=this._scanTarget.folderStack[0];
        this._scanTarget.sortDescendingBasedOnSize();
    }
}