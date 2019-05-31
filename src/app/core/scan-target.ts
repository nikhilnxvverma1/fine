/**
 * Created by NikhilVerma on 18/06/16.
 */
import {ScanTargetType} from "./scan-target-type";
import {DataItem} from "./data-item";
import {Folder} from "./folder";
import {SortOption} from "./sort-option";
import {Tracker} from "./tracker";
import {ScanStatus} from "./scan-status";
import {GroupElement} from "./group-element";
import {LeafElement} from "./leaf-element";
import {DisplayElement} from "./display-element";
import {SunburstComponent} from "../components/sunburst/sunburst.component";

export class ScanTarget{
    _totalElements=0;
    private _rootPath:string;
    private _name:string;
    private _type:ScanTargetType;
    private _total:number;
    private _available:number;
    private _used:number;
    private _folderStack:Folder[]=[];
    private _sortOption:SortOption=SortOption.Size;
    private _sortedInDescending:boolean=false;
    private _tracker:Tracker=new Tracker(this);
    private _displayTreeRoot:GroupElement;
    private _displayTreeCurrent:GroupElement;
    private _displayTreeHovered:DisplayElement;
    private _showAllItems:boolean=false;

    constructor(name:string,rootPath:string, type:ScanTargetType, total:number, used:number) {
        this._rootPath=rootPath;
        this._name = name;
        this._type = type;
        this.total=total;
        this.available = total-used;
        this.used = used;
        //this.tracker.scanStatus=ScanStatus.Scanned;
    }


    get rootPath():string {
        return this._rootPath;
    }

    set rootPath(value:string) {
        this._rootPath = value;
    }

    get name():string {
        return this._name;
    }

    get type():ScanTargetType {
        return this._type;
    }

    get total():number {
        return this._total;
    }

    set total(value:number) {
        this._total = value;
    }

    get available():number {
        return this._available;
    }

    set available(value:number) {
        this._available = value;
    }

    get used():number {
        return this._used;
    }

    set used(value:number) {
        this._used = value;
    }

    get folderStack():Folder[] {
        return this._folderStack;
    }

    set folderStack(value:Array<Folder>) {
        this._folderStack = value;
    }

    get sortOption():SortOption {
        return this._sortOption;
    }

    set sortOption(value:SortOption) {
        //toggle if the same option is chosen again
        //(Warning: UI design logic inserted in core class)
        if(value==this._sortOption){
            this._sortedInDescending=!this._sortedInDescending;
        }else{
            this._sortedInDescending=false;
        }
        this._sortOption = value;
        this.topFolder().sort(this.sortOption,this._sortedInDescending,false);
    }

    get tracker():Tracker {
        return this._tracker;
    }

    set tracker(value:Tracker) {
        this._tracker = value;
    }

    get displayTreeRoot():GroupElement {
        return this._displayTreeRoot;
    }

    set displayTreeRoot(value:GroupElement) {
        this._displayTreeRoot = value;
    }

    get displayTreeCurrent():GroupElement {
        return this._displayTreeCurrent;
    }

    set displayTreeCurrent(value:GroupElement) {
        this._displayTreeCurrent = value;
        this._displayTreeHovered = value;//we reset the hovered element because we always anchor on the current
        this._showAllItems=false;
    }

    get displayTreeHovered():DisplayElement {
        return this._displayTreeHovered;
    }

    set displayTreeHovered(value:DisplayElement) {
        this._displayTreeHovered = value;
    }

    get showAllItems():boolean {
        return this._showAllItems;
    }

    set showAllItems(value:boolean) {
        this._showAllItems = value;
    }

    /** Sorts the topmost folder based on size in the descending order*/
    public sortDescendingBasedOnSize(){
        this._sortedInDescending=true;
        this.topFolder().sort(this.sortOption,this._sortedInDescending,false);
    }

    public topFolder():Folder{
        return this.folderStack[this.folderStack.length-1];
    }

    public resortCurrentWorkingDirectory(){
        this.topFolder().sort(this.sortOption,this._sortedInDescending,false);
    }

    /**
     * jumps to the specified folder by adding relevant folders in the folder stack
     * @param folder folder to jump to
     * @returns {boolean} true if the folder is ahead of the
     * current working directory,false otherwise
     */
    public jumpToFolder(folder:Folder):boolean{
        //go back till you find top folder
        var topFolder=this.topFolder();
        var foldersInBetween=[];
        var currentFolder=folder;

        while(currentFolder!=null&&currentFolder!=topFolder){
            foldersInBetween.push(currentFolder);
            currentFolder=currentFolder.parent;
        }
        if(currentFolder!=null){
            let length = foldersInBetween.length;
            for(var i=0; i<length; i++){
                //push in the reverse order
                this.folderStack.push(foldersInBetween[length-1-i]);
            }
            return true;
        }else{
            //this means that the folders is before the current working directory
            //truncate the entire folder stack first
            this.folderStack.splice(0,this.folderStack.length);

            //add in folders so far collected in the reverse order
            let length = foldersInBetween.length;
            for(var i=0; i<length; i++){
                //push in the reverse order
                this.folderStack.push(foldersInBetween[length-1-i]);
            }
            return false;
        }
    }

    populateDisplayElementTree(root:GroupElement):GroupElement{
        var depth=0;
        this._totalElements=0;
        var startingHue,endingHue;
        if(root.parent==null){
            startingHue=0;
            endingHue=1;
            root.getDataItem().setRgb(200,200,200);
        }else{

            //calculate the hue of this root which is will be at the mid point of the spectrum
            var parentHue=ScanTarget.rgbToHsl(
                root.getDataItem().red,
                root.getDataItem().green,
                root.getDataItem().blue)[0];

            //subtract half the hue amount for starting
            //add half the hue amount for ending
            startingHue=parentHue-root.hueAmount/2;
            endingHue=parentHue+root.hueAmount/2;
        }
        this.traverseBigItems(root,SunburstComponent.STARTING_CHILDREN_TO_SHOW,depth,startingHue,endingHue);
        return root;
    }

    traverseBigItems(groupElement:GroupElement,upperFew:number,depth:number,startingHue:number,endingHue:number){
        if(depth>SunburstComponent.MAX_DEPTH||
            upperFew<1||
            !groupElement.getDataItem().isDirectory()){
            return ;
        }
        var displayElements=this.upperDisplayElementsFor(groupElement,upperFew);
        var allGroupSize=0;
        for (var i=0;i<displayElements.length;i++){
            if (displayElements[i].isGroup()) {
                allGroupSize += displayElements[i].getDataItem().size;
            }
        }

        var hueProgress=startingHue;
        for(var i=0;i<displayElements.length;i++){
            if(displayElements[i].isGroup()){

                //color calculation
                var proportion=  displayElements[i].getDataItem().size/allGroupSize;
                var hueAmount=proportion*(endingHue-startingHue);
                var hue=hueProgress+hueAmount/2;//hue will be set at the mid point of the slot size
                var rgb=ScanTarget.hslToRgb(hue,0.7,0.5);
                displayElements[i].getDataItem().setRgb(rgb[0],rgb[1],rgb[2]);
                (<GroupElement>displayElements[i]).hueAmount=hueAmount;

                var fraction=displayElements[i].getDataItem().size/groupElement.getDataItem().size;
                var reducedUpperFew=upperFew*fraction;
                if(reducedUpperFew<1&&depth<SunburstComponent.MANDATORY_DEPTH){
                    reducedUpperFew=1;
                }
                this.traverseBigItems((<GroupElement>displayElements[i]),reducedUpperFew,depth+1,hueProgress,hueProgress+hueAmount);
                hueProgress+=hueAmount;

            }
        }

    }

    upperDisplayElementsFor(groupElement:GroupElement,upperFew:number):DisplayElement[]{

        var folder=groupElement.getDataItem();

        //get depth information to calculate 'h'
        var depth=folder.depth+1;
        if(upperFew<1){
            return null;
        }
        var sortedCopy=folder.sort(SortOption.Size,false,true);//sorts in ascending order
        var childrenToShow:DisplayElement[]=[];
        var sizeOfDisplayedElements=0;
        for(var i=0;i<upperFew&&i<sortedCopy.length;i++){
            var child=sortedCopy[sortedCopy.length-1-i];
            sizeOfDisplayedElements+=child.size;
            var childElement;
            if(child.isDirectory()){
                childElement=new GroupElement();
                childElement.folder=<Folder>child;
            }else{
                childElement=new LeafElement();
                childElement.file=child;
            }

            childElement.parent=groupElement;
            childrenToShow.push(childElement);
            this._totalElements++;
        }

        groupElement.omissionCount=sortedCopy.length-childrenToShow.length;
        groupElement.omissionSize=folder.size-sizeOfDisplayedElements;
        groupElement.children=childrenToShow;
        return childrenToShow;
    }

    /**
     * Looks up under the current display element to find
     * a matching display element for the folder
     * @param dataItem the data item for whose display element is needed
     * @returns matching display element, null if not found
     */
    displayElementFor(dataItem:DataItem):DisplayElement{
        for(var i=0;i<this.displayTreeCurrent.children.length;i++){
            if (this.displayTreeCurrent.children[i].getDataItem() == dataItem) {
                return this.displayTreeCurrent.children[i];
            }
        }
        return null;
    }

    createNewGroupElementUnderCurrent(folder:Folder):GroupElement{
        let groupElement = new GroupElement();
        groupElement.parent=this.displayTreeCurrent;
        groupElement.folder=folder;
        this.populateDisplayElementTree(groupElement);
        return groupElement;
    }

    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * Taken from : http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
     *
     * @param   {number}  h       The hue between [0,1]
     * @param   {number}  s       The saturation between [0,1]
     * @param   {number}  l       The lightness between [0,1]
     * @return  {Array}           The RGB representation between [0,255]
     */
    static hslToRgb(h, s, l){
        var r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and l in the set [0, 1].
     *
     * Taken from : http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
     *
     * @param   {number}  r       The red color value between [0,255]
     * @param   {number}  g       The green color value between [0,255]
     * @param   {number}  b       The blue color value between [0,255]
     * @return  {Array}           The HSL representation between [0,1]
     */
    static rgbToHsl(r, g, b){
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, l];
    }

    /**
     * Looks for data item with the specified string path
     * @param path the path to the data item
     * @returns {null} returns the data item if it exists under hierarchy, null otherwise
     */
    public findDataItemForPath(path:string):DataItem{

        //split the path and root path by delimiters giving elements array
        var pathElements=this.getPathElements(path);
        var rootElements=this.getPathElements(this.rootPath);

        //check if this path is in this tree
        //start comparing the path with the root as they both should have common start
        var isInThisTree=true;
        for (var i=0;i<rootElements.length;i++){
            if(pathElements[i]!=rootElements[i]){
                isInThisTree=false;
                break;
            }
        }

        if(isInThisTree){
            //if both path elements are same, that means its the root
            if(rootElements.length==pathElements.length){
                return this.folderStack[0];
            }else{
                //start looking for that data item by searching recursively each element
                //index will lead in path elements to look under a folder
                return this.searchUnderFolder(this.folderStack[0],pathElements,rootElements.length);
            }
        }else{
            return null;
        }
    }

    private getPathElements(path:string):string[]{
        var delimiter=path[0];
        var elements=path.split(delimiter);
        //trim the start an the end if they are empty strings
        if(elements[0].trim()==""){
            elements.splice(0,1);
        }
        if(elements[elements.length-1].trim()==""){
            elements.splice(elements.length-1,1);
        }
        return elements;
    }

    private searchUnderFolder(folder:Folder, pathElements:string[], index:number):DataItem{
        if(index>=pathElements.length){
            return null;
        }

        var dataItem=folder.dataItemByName(pathElements[index]);

        if(index+1<pathElements.length){
            if(dataItem!=null && dataItem.isDirectory()){
                return this.searchUnderFolder(<Folder>dataItem,pathElements,index+1);
            }else{
                return null;
            }
        }else{
            //found data item(this still could be null)
            return dataItem;
        }
    }
}