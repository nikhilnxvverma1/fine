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
import {Folder} from "./core/folder";
import {root} from "rxjs/util/root";
import {SortOption} from "./core/sort-option";
import {GroupElement} from "./core/group-element";
import {DisplayElement} from "./core/display-element";
import {LeafElement} from "./core/leaf-element";
import Arc = d3.svg.arc.Arc;
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
    //private _rootGroupElement:GroupElement;
    //private _currentElement:GroupElement;
    private x:number=0;
    private y:number=0;
    private dx:number=0;
    private dy:number=0;

    ngOnInit():any {
        this.makeSunburst();
        this.scanTarget.displayTreeCurrent=this.scanTarget.displayTreeRoot;
        return undefined;
    }

    populateDisplayElementTree(root:GroupElement):GroupElement{
        var depth=0;
        this._totalElements=0;
        this.traverseBigItems(root,SunburstComponent.STARTING_CHILDREN_TO_SHOW,depth);
        return root;
    }

    traverseBigItems(groupElement:GroupElement,upperFew:number,depth:number){
        if(depth>SunburstComponent.MAX_DEPTH||
            upperFew<1||
            !groupElement.getDataItem().isDirectory()){
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
        var sortedCopy=folder.sort(SortOption.Size,true);//sorts in ascending order
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
                childElement.file=<File>child;
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

    makeSunburst(){
        //create an secondary DisplayElement tree
        this.populateDisplayElementTree(this.scanTarget.displayTreeRoot);
        console.log("Total Elements to render: "+this._totalElements);
        d3.selectAll("#sunburst svg").remove();
        var width = 760,
            height = 600,
            radius = Math.min(width, height) / 2-20;//-20 otherwise it gets clipped

        //var x = d3.scale.linear().domain([0, 2 * Math.PI]).range([0, 2 * Math.PI]);
        var x = d3.scale.linear().range([0, 2 * Math.PI]);

        //var y = d3.scale.sqrt().domain([0, radius*radius]).range([0, radius]);
        var y = d3.scale.sqrt().range([0, radius]);

        var color = d3.scale.category20c();

        var svg=d3.selectAll("#sunburst")
            .insert("svg",null)
            .attr("width", width)
            .attr("height", height);

        var group = svg
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        d3.select("sunburstImg").remove();

        var partition = d3.layout.partition()
            .value(function (d:DisplayElement) {
                return d.getDataItem().size;
            });

        var arc = d3.svg.arc<DisplayElement>()
            .startAngle((d)=> {
                var de=<DisplayElement>d;
                return Math.max(0, Math.min(2 * Math.PI, x(de.x)));
            })
            .endAngle((d)=> {
                var de=<DisplayElement>d;
                return Math.max(0, Math.min(2 * Math.PI, x(de.x + de.dx)));
            })
            .innerRadius((d)=> {
                var de=<DisplayElement>d;
                return Math.max(0, y(de.y));
            })
            .outerRadius((d)=> {
                var de=<DisplayElement>d;
                return Math.max(0, y(de.y + de.dy));
            });

        var arcOpen = d3.svg.arc<DisplayElement>()
            .startAngle((d)=> {
                var de=<DisplayElement>d;
                return (1-de.t)*Math.max(0, Math.min(2 * Math.PI, x(this.x)))
                + de.t * Math.max(0, Math.min(2 * Math.PI, x(de.x)));
            })
            .endAngle((d)=> {
                var de=<DisplayElement>d;
                return (1-de.t) * Math.max(0, Math.min(2 * Math.PI, x(this.x + this.dx)))
                + de.t * Math.max(0, Math.min(2 * Math.PI, x(de.x + de.dx)));
            })
            .innerRadius((d)=> {
                var de=<DisplayElement>d;
                return Math.max(0, y(de.y));
                //return (1-de.t) * Math.max(0, y(this.y))
                //+ de.t * Math.max(0, y(de.y));
            })
            .outerRadius((d)=> {
                var de=<DisplayElement>d;
                return Math.max(0, y(de.y + de.dy));
                //return (1-de.t) * Math.max(0, y(this.y + this.dy))
                //+ de.t * Math.max(0, y(de.y + de.dy));
            });

        var arcClose = d3.svg.arc<DisplayElement>()
            .startAngle((d)=> {
                var de=<DisplayElement>d;
                return de.t*Math.max(0, Math.min(2 * Math.PI, x(this.x)))
                    + (1-de.t) * Math.max(0, Math.min(2 * Math.PI, x(de.x)));
            })
            .endAngle((d)=> {
                var de=<DisplayElement>d;
                return de.t * Math.max(0, Math.min(2 * Math.PI, x(this.x + this.dx)))
                    + (1-de.t) * Math.max(0, Math.min(2 * Math.PI, x(de.x + de.dx)));
            })
            .innerRadius((d)=> {
                var de=<DisplayElement>d;
                return Math.max(0, y(de.y));
                //return (1-de.t) * Math.max(0, y(this.y))
                //+ de.t * Math.max(0, y(de.y));
            })
            .outerRadius((d)=> {
                var de=<DisplayElement>d;
                return Math.max(0, y(de.y + de.dy));
                //return (1-de.t) * Math.max(0, y(this.y + this.dy))
                //+ de.t * Math.max(0, y(de.y + de.dy));
            });

        var newGroup=null;//reserved for the click callback
        var click=(d:GroupElement)=>{

            if(d==this.scanTarget.displayTreeCurrent){
                if(d.parent!=null){
                    //remove all children from parent
                    if (d.parent.children!=null && d.parent.children.length>0) {
                        d.parent.children.splice(0, d.parent.children.length);
                    }
                    //populate the display tree back at the parent
                    this.populateDisplayElementTree(d.parent);
                    this.scanTarget.jumpToFolder(d.parent.getDataItem());
                    this.scanTarget.displayTreeCurrent=d.parent;

                    //fade out
                    group.transition()
                        .duration(350)
                        .selectAll("path")
                        //.attrTween("opacity", (d)=> { return (t) =>{ return 1-t; }; })
                        .attrTween("d",(d:DisplayElement)=>{
                            return (t)=>{
                                d.t=t;
                                return arcClose(<Arc>d);
                            }
                        })
                        .remove();

                    //remove entire group after
                    setTimeout(()=>{
                        group.remove();
                        group=newGroup;
                    },360);

                    //show an arc closing animation
                    var newGroup=svg.append("g")
                        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");
                    newGroup
                        .datum(d.parent)
                        .selectAll("path")
                        .data(partition.nodes)
                        .enter()
                        .append("path")
                        .attr("d", arc)
                        .style("stroke", "white")
                        .style("stroke-width", "0.3px")
                        .on('click',click)
                        .style("fill", d=> {
                            //return color(d.name)
                            return d.getDataItem().colorRGB();
                        }).transition()
                        .duration(350)
                        .attrTween("opacity", (d)=> { return (t) =>{ return t; }; })
                }
            }else{
                //remove all children if any
                if (d.children!=null && d.children.length>0) {
                    d.children.splice(0, d.children.length);
                }
                //populate the display tree further starting at this node
                this.populateDisplayElementTree(d);
                this.scanTarget.jumpToFolder(d.getDataItem());
                this.scanTarget.displayTreeCurrent=d;
                console.log("x:"+d.x+" y:"+d.y+" dx:"+d.dx+"dy:"+d.dy);
                this.x=d.x;
                this.y=d.y;
                this.dx=d.dx;
                this.dy=d.dy;
                group.transition()
                    .duration(350)
                    .selectAll("path")
                    .attrTween("opacity", (d)=> { return (t) =>{ return 1-t; }; })
                    .remove();

                setTimeout(()=>{
                    group.remove();
                    group=newGroup;
                },360);

                var newGroup=svg.append("g")
                    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");
                newGroup
                    .datum(d)
                    .selectAll("path")
                    .data(partition.nodes)
                    .enter()
                    .append("path")
                    .attr("d", arc)
                    .style("stroke", "white")
                    .style("stroke-width", "0.3px")
                    .on('click',click)
                    .style("fill", d=> {
                        //return color(d.name)
                        return d.getDataItem().colorRGB();
                    }).transition()
                    .duration(350)
                    .attrTween("d",(d:DisplayElement)=>{
                        return (t)=>{
                            d.t=t;
                            return arcOpen(<Arc>d);
                        }
                    })
            }

        };


        //eliminated data items cause problems
        group.datum(this.scanTarget.displayTreeRoot)
            .selectAll("path")
            .data(partition.nodes)
            .enter()
            .append("path")
            .attr("d", arcOpen)
            .style("stroke","white" )
            .style("stroke-width", "0.3px")
            .on('click',click)
            .style("fill", d=> {
                //return color(d.name)
                return d.getDataItem().colorRGB();
            }).transition()
            .delay(600)             //TODO this is a bad idea
            .duration(400)
            .attrTween("d",(d:DisplayElement)=>{
                return (t)=>{
                    d.t=t;
                    return arcOpen(<Arc>d);
                }
            })
        //(d:DisplayElement)=>{return d.isGroup?"none":"white";}
    }
}
