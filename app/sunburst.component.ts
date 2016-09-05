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
                top:"50px",
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
    @Output('jumpedToFolder') jumpedToFolderEvent=new EventEmitter<DataItem>();

    static STARTING_CHILDREN_TO_SHOW=32;
    static HALF_TILL_DEPTH=4;
    static MANDATORY_DEPTH=4;
    static MAX_DEPTH=7;
    private _totalElements=0;
    //private _rootGroupElement:GroupElement;
    //private _currentElement:GroupElement;
    private x:number=0;
    private y:number=0;
    private dx:number=0;
    private dy:number=0;

    ngOnInit():any {
        this.scanTarget.displayTreeCurrent=this.scanTarget.displayTreeRoot;
        this.makeSunburst(this.scanTarget.displayTreeCurrent,true);
        return undefined;
    }

    makeSunburst(groupElement:GroupElement,entryAnimation:boolean){
        //create an secondary DisplayElement tree
        groupElement.destroyAllChildren();
        this.scanTarget.populateDisplayElementTree(groupElement);
        console.log("Group element: "+groupElement.getDataItem().name);
        console.log("Total Elements to render: "+this.scanTarget._totalElements);
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
            .sort((a:DisplayElement,b:DisplayElement)=>{
                return b.getDataItem().size-a.getDataItem().size;
            })
            .value(function (d:DisplayElement) {
                //return d.isGroup()?d.getDataItem().size-(<GroupElement>d).omissionSize:d.getDataItem().size;
                return 1;//apparently this is giving more accurate results
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

        //element is actually the entire suburst chart but it should ideally be the path element being hovered
        var hoveredOnElement=(element,d:DisplayElement)=>{
            this.scanTarget.displayTreeHovered=d;
        };

        var hoveredOutOfElement=(element,d:DisplayElement)=>{
            console.log("left element "+element);
        };
        var leftEntireSVG=(d:DisplayElement)=>{
            this.scanTarget.displayTreeHovered=this.scanTarget.displayTreeCurrent;
        };

        var newGroup=null;//reserved for the click callback
        var click=(d:GroupElement)=>{
            console.log(" what clicked "+d.getDataItem().name);
            if(d==this.scanTarget.displayTreeCurrent){
                if(d.parent!=null){
                    //remove all children from parent
                    if (d.parent.children!=null && d.parent.children.length>0) {
                        d.parent.children.splice(0, d.parent.children.length);
                    }
                    //populate the display tree back at the parent
                    this.scanTarget.populateDisplayElementTree(d.parent);
                    this.scanTarget.jumpToFolder(d.parent.getDataItem());
                    this.jumpedToFolderEvent.emit(d.getDataItem());
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
                    var zoomedOutSvg=newGroup
                        .datum(d.parent)
                        .selectAll("path")
                        .data(partition.nodes)
                        .enter()
                        .append("path")
                        .attr("d", arc)
                        .attr('class','displayElementPath')
                        .on('mouseover',(d:DisplayElement)=>{ hoveredOnElement(this,d);})
                        .style("stroke", "white")
                        .style("stroke-width", "0.3px")
                        .on('click',click)
                        .style("fill", d=> {
                            //return color(d.name)
                            return d.getDataItem().colorRGB();
                        });
                    zoomedOutSvg.on('mouseleave',leftEntireSVG);
                    zoomedOutSvg.transition()
                        .duration(350)
                        .attrTween("opacity", (d)=> { return (t) =>{ return t; }; })
                }
            }else{
                //remove all children if any
                if (d.children!=null && d.children.length>0) {
                    d.children.splice(0, d.children.length);
                }
                //populate the display tree further starting at this node
                this.scanTarget.populateDisplayElementTree(d);
                this.scanTarget.jumpToFolder(d.getDataItem());
                this.jumpedToFolderEvent.emit(d.getDataItem());
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
                var zoomedSvg=newGroup
                    .datum(d)
                    .selectAll("path")
                    .data(partition.nodes)
                    .enter()
                    .append("path")
                    .attr("d", arc)
                    .attr('class','displayElementPath')
                    .on('mouseover',(d:DisplayElement)=>{ hoveredOnElement(this,d);})
                    .style("stroke", "white")
                    .style("stroke-width", "0.3px")
                    .on('click',click)
                    .style("fill", d=> {
                        //return color(d.name)
                        return d.getDataItem().colorRGB();
                    });

                zoomedSvg.on('mouseleave',leftEntireSVG);

                zoomedSvg.transition()
                    .duration(350)
                    .attrTween("d", (d:DisplayElement)=> {
                            return (t)=> {
                                d.t = t;
                                return arcOpen(<Arc>d);
                            }
                    });

            }

        };


        //eliminated data items cause problems
        var sunburstSvg=group.datum(groupElement)
            .selectAll("path")
            .data(partition.nodes)
            .enter()
            .append("path")
            .attr("d", entryAnimation?arcOpen:arc) //we use arc open only if we need to animate
            .attr('class','displayElementPath')
            .on('mouseover',(d:DisplayElement)=>{ hoveredOnElement(this,d);})
            .style("stroke","white" )
            .style("stroke-width", "0.3px")
            .on('click',click)
            .style("fill", d=> {
                //return color(d.name)
                return d.getDataItem().colorRGB();
            });

        sunburstSvg.on('mouseleave',leftEntireSVG);

        if (entryAnimation) {
            sunburstSvg.transition()
                .delay(600)
                .duration(400)
                .attrTween("d", (d:DisplayElement)=> {
                    return (t)=> {
                        d.t = t;
                        return arcOpen(<Arc>d);
                    }
                });
        }

    }

}
