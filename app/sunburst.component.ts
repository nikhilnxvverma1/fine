/**
 * Created by NikhilVerma on 19/06/16.
 */


import {Component,OnInit,AfterContentInit,OnChanges} from '@angular/core';
import {DataItem} from "./core/data-item";
import {NgZone} from "@angular/core";
import {Input} from "@angular/core";
import {Output,EventEmitter} from "@angular/core";

import {ScanTarget} from "./core/scan-target";
import {ToggleStatus} from "./core/toggle-status";
import {trigger,state,style,transition,animate} from "@angular/core";

///<reference path="../typings/d3.d.ts"/>
import * as d3 from "d3"

///<reference path="../typings/browser/definitions/snapsvg/snapsvg.d.ts"/>
import Snap=window.snap;
import {Folder} from "./core/folder";
import {root} from "rxjs/util/root";
import {SortOption} from "./core/sort-option";
import {GroupElement} from "./core/group-element";
import {DisplayElement} from "./core/display-element";
import {LeafElement} from "./core/leaf-element";
//import * as snap from "snapsvg"
@Component({
    selector: 'sunburst',
    templateUrl:'app/template/sunburst.component.html',
    animations:[
        trigger("sunburstChartToggle",[
            state("analyze",style({
                top:"100px",
                opacity:"1"
            })),
            state("organize",style({
                top:"0",
                opacity:"0"
            })),
            transition("analyze => organize",animate("0.4s ease-out")),
            transition("organize => analyze",animate("0.4s 0.4s ease-in"))
        ]),
    ]

})
export class SunburstComponent implements OnInit{

    @Input("scanTarget") scanTarget:ScanTarget;
    @Input("toggleStatus") toggleStatus:ToggleStatus;

    private static STARTING_CHILDREN_TO_SHOW=32;
    private static HALF_TILL_DEPTH=4;
    private static MANDATORY_DEPTH=4;
    private static MAX_DEPTH=7;
    private _totalElements=0;
    private _rootGroupElement:GroupElement;
    private _currentElement:GroupElement;
    private x:number=0;
    private y:number=0;
    private dx:number=0;
    private dy:number=0;

    ngOnInit():any {
        this._rootGroupElement=new GroupElement();
        this._rootGroupElement.folder=this.scanTarget.folderStack[0];
        this.makeSunburst();
        //this.makeCirclePack();
        //this.makeIcicle();
        console.log("Content did change in sunburst");
        return undefined;
    }

    createDisplayElementTree(root:GroupElement):GroupElement{
        var depth=0;
        this._totalElements=0;
        this.traverseBigItems(root,SunburstComponent.STARTING_CHILDREN_TO_SHOW,depth);
        return root;
    }

    traverseBigItems(groupElement:GroupElement,upperFew:number,depth:number){
        if(depth>SunburstComponent.MAX_DEPTH||upperFew<1){
            return;
        }
        var displayElements=this.upperDisplayElementsFor(groupElement,upperFew);
        var i=0;
        for(i=0;i<displayElements.length;i++){
            if(displayElements[i].isGroup()){

                var fraction=displayElements[i].getDataItem().size/groupElement.getDataItem().size;
                var reducedUpperFew=upperFew*fraction;
                if(reducedUpperFew<1&&depth<SunburstComponent.MANDATORY_DEPTH){
                    reducedUpperFew=1;
                }
                this.traverseBigItems((<GroupElement>displayElements[i]),reducedUpperFew,depth+1);
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
        folder.sort(SortOption.Size);//sorts in ascending order
        var childrenToShow:DisplayElement[]=[];
        var sizeOfDisplayedElements=0;
        for(var i=0;i<upperFew&&i<folder.children.length;i++){
            var child=folder.children[folder.children.length-1-i];
            sizeOfDisplayedElements+=child.size;
            var childElement;
            if(child.isDirectory()){
                childElement=new GroupElement();
                childElement.folder=<Folder>child;
            }else{
                childElement=new LeafElement();
                childElement.file=<File>child;
            }

            childrenToShow.push(childElement);
            this._totalElements++;
        }

        groupElement.omissionCount=folder.children.length-childrenToShow.length;
        groupElement.omissionSize=folder.size-sizeOfDisplayedElements;
        groupElement.children=childrenToShow;
        return childrenToShow;
    }

    makeSunburst(){
        //create an secondary DisplayElement tree
        this.createDisplayElementTree(this._rootGroupElement);
        console.log("Total Elements to render: "+this._totalElements);
        d3.selectAll("#sunburst svg").remove();
        var width = 760,
            height = 600,
            radius = Math.min(width, height) / 2;

        //var x = d3.scale.linear().domain([0, 2 * Math.PI]).range([0, 2 * Math.PI]);
        var x = d3.scale.linear().range([0, 2 * Math.PI]);

        //var y = d3.scale.sqrt().domain([0, radius*radius]).range([0, radius]);
        var y = d3.scale.sqrt().range([0, radius]);

        var color = d3.scale.category20c();

        var svg = d3.selectAll("#sunburst")
            .insert("svg",null)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        d3.select("sunburstImg").remove();

        var partition = d3.layout.partition()
            .value(function (d:DisplayElement) {
                return d.getDataItem().size;
            });

        var arc = d3.svg.arc()
            .startAngle((d)=> {
                return Math.max(0, Math.min(2 * Math.PI, x((<ArcItem>d).x)));
            })
            .endAngle((d)=> {
                return Math.max(0, Math.min(2 * Math.PI, x((<ArcItem>d).x + (<ArcItem>d).dx)));
            })
            .innerRadius((d)=> {
                return Math.max(0, y((<ArcItem>d).y));
            })
            .outerRadius((d)=> {
                return Math.max(0, y((<ArcItem>d).y + (<ArcItem>d).dy));
            });

        var click=(d:GroupElement)=>{
            //remove all children
            d.children.splice(0,d.children.length);
            //recreate the display tree starting at this root
            this.createDisplayElementTree(d);
            this.scanTarget.jumpToFolder(d.getDataItem());
            console.log("x:"+d.x+" y:"+d.y+" dx:"+d.dx+"dy:"+d.dy);
            this.x=d.x;
            this.y=d.y;
            this.dx=d.dx;
            this.dy=d.dy;
            svg.transition()
                .duration(350)
                .selectAll("path")
                .attrTween("opacity", (d)=> { return (t) =>{ return 1-t; }; })
                .remove();

            setTimeout(()=>{
                svg.datum(d)
                    .selectAll("path")
                    .data(partition.nodes)
                    .enter()
                    .append("path")
                    .attr("d", arc)
                    .style("stroke", "none")
                    .on('click',click)
                    .style("fill", d=> {
                        //return color(d.name)
                        return d.getDataItem().colorRGB();
                    });
            },370);
            //svg.datum(d)
            //    .selectAll("path")
            //    .data(partition.nodes)
            //    .enter()
            //    .append("path")
            //    .attr("d", arc)
            //    .style("stroke", "none")
            //    .on('click',click)
            //    .style("fill", d=> {
            //        //return color(d.name)
            //        return d.getDataItem().colorRGB();
            //    });

        };


        //eliminated data items cause problems
        svg.datum(this._rootGroupElement)
            .selectAll("path")
            .data(partition.nodes)
            .enter()
            .append("path")
            .attr("d", arc)
            .style("stroke", "none")
            .on('click',click)
            .style("fill", d=> {
                //return color(d.name)
                return d.getDataItem().colorRGB();
            });
    }

    makeSunburstOld() {
        console.log("making sunburst");
        d3.selectAll("#sunburst svg").remove();
        var width = 760,
            height = 600,
            radius = Math.min(width, height) / 2;

        //var x = d3.scale.linear().domain([0, 2 * Math.PI]).range([0, 2 * Math.PI]);
        var x = d3.scale.linear().range([0, 2 * Math.PI]);

        //var y = d3.scale.sqrt().domain([0, radius*radius]).range([0, radius]);
        var y = d3.scale.sqrt().range([0, radius]);

        var color = d3.scale.category20c();

        var svg = d3.selectAll("#sunburst")
            .insert("svg",null)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        d3.select("sunburstImg").remove();

    //.size([2 * Math.PI, radius*radius   ])
        var partition = d3.layout.partition()
            .children(function(d:DataItem){
                console.log("children accesor called");
                if(!d.isDirectory()){
                    return null;
                }

                var folder=<Folder>d;
                //get depth information to calculate 'h'
                var depth=folder.depth+1;
                var h=SunburstComponent.STARTING_CHILDREN_TO_SHOW/depth;
                if(h<1){
                    return null;
                }
                folder.sort(SortOption.Size);//sorts in ascending order
                var childrenToShow:DataItem[]=[];
                for(var i=0;i<h&&i<folder.children.length;i++){
                    childrenToShow.push(folder.children[folder.children.length-1-i]);
                }

                return childrenToShow;
                //return folder.children;
            }).value(function (d:DataItem) {
                return d.size;
            });

        //TODO check if the values are NANs or not
        var arc = d3.svg.arc<ArcItem>()
            .startAngle((d)=> {
                if(isNaN((<ArcItem>d).x)){
                    //console.log("It is NAN");
                }
                return Math.max(0, Math.min(2 * Math.PI, x((<ArcItem>d).x)));
                //return (<ArcItem>d).x;
            })
            .endAngle((d)=> {
                return Math.max(0, Math.min(2 * Math.PI, x((<ArcItem>d).x + (<ArcItem>d).dx)));
                //return (<ArcItem>d).x+(<ArcItem>d).dx;
            })
            .innerRadius((d)=> {
                return Math.max(0, y((<ArcItem>d).y));
                //return Math.sqrt((<ArcItem>d).y);
            })
            .outerRadius((d)=> {
                return Math.max(0, y((<ArcItem>d).y + (<ArcItem>d).dy));
                //return Math.sqrt((<ArcItem>d).y + (<ArcItem>d).dy);
            });

        var click=(d)=>{
            console.log("clickd "+d.name);

            svg.transition()
                .duration(350)
                .tween("scale", ()=> {
                    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                        yd = d3.interpolate(y.domain(), [d.y, 1]),
                        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                    return (t)=> {
                        x.domain(xd(t));
                        y.domain(yd(t)).range(yr(t));
                    };
                })
                .selectAll("path")
                .attrTween("d", (d)=> { return () =>{ return arc(d); }; });
        };


        //eliminated data items cause problems
        svg.datum(this.scanTarget.folderStack[0])
            .selectAll("path")
            .data(partition.nodes)
            .enter()
            .append("path")
            .attr("d", arc)
            .style("stroke", "#fff")
            .on('click',click)
            .style("fill", d=> {
                //return color(d.name)
                return d.colorRGB();
            });
        //svg.selectAll("path")
        //    .data(partition)
        //    .enter()
        //    .append("path")
        //    .attr("d", arc)
        //    .style("stroke", "#fff")
        //    .on('click',click)
        //    .style("fill", d=> {
        //        //return color(d.name)
        //        return d.colorRGB();
        //    });


    }

    makeCirclePack(){
        console.log("Making circle pack");
        var width = 760,
            height = 600,
            diameter=550;

        var svg = d3.selectAll("#sunburst")
            .insert("svg",null)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        d3.select("sunburstImg").remove();

        let rootFolder = this.scanTarget.folderStack[0];
        var pack = d3.layout.pack()
            .size([diameter,diameter])
            .value(function (d:DataItem) {
                return d.size;
            }).nodes(rootFolder);

        console.log("Done packing rootFolder "+rootFolder);

        var s=Snap("#dataVisualiser");
        var rootCircle:CircleShape=rootFolder as CircleShape;

        s.circle(rootCircle.x,rootCircle.y,rootCircle.r).attr({fill:rootCircle.colorRGB()});
        for(var i=0 ;i<rootFolder.children.length;i++){

            var childCircle:CircleShape = rootFolder.children[i] as CircleShape;
            s.circle(childCircle.x,childCircle.y,childCircle.r).attr({fill:childCircle.colorRGB()});
        }
    }

    makeIcicle(){
        var width = 900,
            height = 800,
            diameter=width;

        var svg = d3.selectAll("#sunburst")
            .insert("svg",null)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        d3.select("sunburstImg").remove();

        let rootFolder = this.scanTarget.folderStack[0];
        console.log("Making partition");
        var partition = d3.layout.partition()
            .size([width,height])
            .value(function (d:DataItem) {
                return d.size;
            }).nodes(rootFolder);

        console.log("Done Making partition");
        var s=Snap("#dataVisualiser");
        console.log("drawing now");
        this.sortAndDrawMajor(s,rootFolder,4,16);
        console.log("Done drawing "+this._totalElements+" rects");
    }

    private sortAndDrawMajor(s:any,root:Folder,depth:number,h:number){
        var rootRect:RectShape=root as RectShape;

        var rectSvg=s.rect(rootRect.x,rootRect.y,rootRect.dx,rootRect.dy).attr({fill:rootRect.colorRGB()});
        this._totalElements++;
        rectSvg.hover((mouseEvent:MouseEvent)=>{ //hover in handler
            var element=mouseEvent.currentTarget as HTMLElement;
            element.setAttribute("stroke","#000");

        },(mouseEvent:MouseEvent)=>{//hover out handler
            var element=mouseEvent.currentTarget as HTMLElement;
            element.removeAttribute("stroke");

        });
        for(var i=0 ;i<root.children.length;i++){

            var child=root.children[i];
            var childRect:RectShape = child as RectShape;
            var rectSvg=s.rect(childRect.x,childRect.y,childRect.dx,childRect.dy).attr({fill:childRect.colorRGB()});
            var nodeElement=rectSvg.node;
            nodeElement.setAttribute("data-name",child.name);
            nodeElement.setAttribute("data-size",child.size);

            rectSvg.hover((mouseEvent:MouseEvent)=>{ //hover in handler
                var element=mouseEvent.currentTarget as HTMLElement;
                element.setAttribute("stroke","#000");

            },(mouseEvent:MouseEvent)=>{//hover out handler
                var element=mouseEvent.currentTarget as HTMLElement;
                element.removeAttribute("stroke");
            });

            this._totalElements++;

            if(child.isDirectory() &&
            depth>0){
                this.sortAndDrawMajor(s,<Folder>child,depth-1,h/2);
            }
        }
    }
}

interface ArcItem{
    x:number;
    y:number;
    dx:number;
    dy:number;
}

interface CircleShape{
    x:number;
    y:number;
    r:number;

    colorRGB():string;
}

interface RectShape{
    x:number;
    y:number;
    dx:number;
    dy:number;

    colorRGB():string;
}
