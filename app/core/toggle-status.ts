/**
 * Created by NikhilVerma on 25/06/16.
 */
export class ToggleStatus{

    private _inOrganizeState:boolean=false;

    get inOrganizeState():boolean {
        return this._inOrganizeState;
    }

    set inOrganizeState(value:boolean) {
        this._inOrganizeState = value;
    }

    public getState():string{
        return this.inOrganizeState?"organize":"analyze";
    }
}