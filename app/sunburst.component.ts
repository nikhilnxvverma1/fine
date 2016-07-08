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
export class SunburstComponent implements OnInit,OnChanges{

    @Input("scanTarget") scanTarget:ScanTarget;
    @Input("toggleStatus") toggleStatus:ToggleStatus;

    ngOnInit():any {
        if(this.scanTarget==null){
            return;
        }

        this.makeSunburst.call(this);

        // Keep track of the node that is currently being displayed as the root.
        var node;
        return undefined;
    }
    ngOnChanges():any {
        if(this.scanTarget==null){
            return undefined;
        }
        console.log("Content did change in sunburst");
        return undefined;
    }

    makeSunburst() {
        var width = 760,
            height = 600,
            radius = Math.min(width, height) / 2;

        //var x = d3.scale.linear().domain([0, 2 * Math.PI]).range([0, 2 * Math.PI]);
        var x = d3.scale.linear().range([0, 2 * Math.PI]);

        //var y = d3.scale.sqrt().domain([0, radius*radius]).range([0, radius]);
        var y = d3.scale.sqrt().range([0, radius]);

        var color = d3.scale.category20c();

        var svg = d3.selectAll("sunburst")
            .insert("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

        d3.select("sunburstImg").remove();

    //.size([2 * Math.PI, radius*radius   ])
        var partition = d3.layout.partition()
            .value(function (d:DataItem) {
                return d.size;
            });

        var arc = d3.svg.arc<ArcItem>()
            .startAngle((d)=> {
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

        svg.datum(this.scanTarget.folderStack[0])
            .selectAll("path")
            .data(partition.nodes)
            .enter()
            .append("path")
            .attr("d", arc)
            .style("stroke", "#fff")
            .on('click',click)
            .style("fill", d=> {
                return color(d.name)
            });


    }

}

interface ArcItem{
    x:number;
    y:number;
    dx:number;
    dy:number;
}
