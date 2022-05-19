import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from "@angular/core";
import { MosaicColorCodes } from "../../../_models/mosaiccode";
import * as d3 from "d3";

export interface GIGraph {
    name: string;
    category: string;
    topic: string;
    mosType: string;
    width: any;
}

@Component({
    selector: "app-GIGraph",
    template: `
        <mat-card *ngIf="settings">
            <mat-card-content>
                <mat-card-title>
                    {{ giGraphTitle }}
                </mat-card-title>
                <div #giGraph id="giGraph" class="chart"></div>
            </mat-card-content>
        </mat-card>
    `,
    styleUrls: [],
})
export class GIGraphComponent implements OnInit, OnChanges {
    @ViewChild("giGraph") giGraphDiv: ElementRef;
    @Input() gsiData: any;
    @Input() settings: GIGraph;
    giGraphTitle: string;
    allKeys: any;

    constructor() {}

    ngOnInit() {
        this.renderComponent();
    }

    ngOnChanges() {
        this.renderComponent();
    }

    renderComponent() {
        this.giGraphTitle = this.settings.name + ": " + this.settings.category + " > " + this.settings.topic;

        this.mosTypeIndicesGraph(this.settings.mosType, this.settings.category, this.settings.topic);
    }

    mosTypeIndicesGraph(mosType, cat, topic) {
        const thisTop = this.gsiData[cat];
        const varb = thisTop[topic];
        const allDataArray = [];
        for (const vari in varb) {
            if (!varb.hasOwnProperty(vari)) {
                continue;
            }
            const thisVariable = varb[vari];
            const variableAverage = this.average(Object.values(thisVariable));
            const thisCodeValue = thisVariable[mosType];
            const obsOverExpected = (thisCodeValue / variableAverage) * 100;
            allDataArray.push({
                varName: vari,
                obsOnExp: obsOverExpected,
                acVal: thisCodeValue,
            });
        }
        setTimeout(() => this.drawKeygiGraph(allDataArray, mosType), 100);
    }

    drawKeygiGraph(data, colour) {
        const margin = { top: 10, right: 20, bottom: 20, left: 20 };
        const barHeight = 30;
        const noBars = data.length;
        const barCent = 100;
        const barMax = barCent * 2;
        const width = this.settings.width - (margin.left + margin.right);
        const height = noBars * barHeight;

        // console.log(this.allKeys);

        this.allKeys = null;
        this.giGraphDiv.nativeElement.innerHTML = "";

        if (!this.allKeys) {
            this.allKeys = d3
                .select("#giGraph")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        } else {
            this.allKeys
                .select("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        }

        const barXval = function (x) {
            return Math.min(x, barCent);
        };
        const barWidthval = function (x) {
            if (x >= barCent) {
                return Math.min(x - barCent, barCent);
            } else {
                return barCent - x;
            }
        };
        const duration = 2000;
        const linearScale = d3.scaleLinear().domain([0, barMax]).range([0, width]);
        const xAxis = d3.axisBottom(d3.scaleLinear());
        const yOrdScale = d3
            .scaleBand()
            .rangeRound([0, height])
            .domain(
                data.map(function (d) {
                    return d.varName;
                })
            );
        const yAxis = d3.axisLeft(yOrdScale);
        const barData = this.allKeys.selectAll(".bar").data(data, function (d) {
            return d;
        });
        const labData = this.allKeys.selectAll(".label").data(data, function (d) {
            return d;
        });

        if (this.allKeys) {
            this.allKeys.select(".x").remove();
            this.allKeys.select(".y").remove();
            this.allKeys.selectAll(".label").remove();
        }

        barData
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d, i) {
                return linearScale(barXval(d.obsOnExp));
            })
            .attr("y", function (d) {
                return yOrdScale(d.varName);
            })
            .style("fill", function (d) {
                return MosaicColorCodes.find((x) => x.code === colour.substring(0, 1)).color;
            })
            .attr("height", function (d) {
                return barHeight;
            })
            .attr("width", function (d, i) {
                return linearScale(barWidthval(d.obsOnExp));
            })
            .merge(barData)
            .transition()
            .duration(duration)
            .attr("x", function (d, i) {
                return linearScale(barXval(d.obsOnExp));
            })
            .attr("y", function (d) {
                return yOrdScale(d.varName);
            })
            .style("fill", function (d) {
                return MosaicColorCodes.find((x) => x.code === colour.substring(0, 1)).color;
            })
            .attr("height", function (d) {
                return barHeight;
            })
            .attr("width", function (d, i) {
                return linearScale(barWidthval(d.obsOnExp));
            });

        labData
            .enter()
            .append("g")
            .attr("class", "label")
            .append("text")
            .attr("x", function (d) {
                return linearScale(barMax);
            })
            .attr("y", function (d) {
                return yOrdScale(d.varName) + 1;
            })
            .attr("text-anchor", "end")
            .attr("dy", "1.5em")
            .text(function (d) {
                return Math.round(d.obsOnExp);
            });

        labData
            .enter()
            .append("g")
            .attr("class", "label")
            .append("text")
            .attr("x", function (d) {
                return linearScale(0);
            })
            .attr("y", function (d) {
                return yOrdScale(d.varName) + 1;
            })
            .attr("text-anchor", "start")
            .attr("dy", "1.5em")
            .text(function (d) {
                return Math.round(d.acVal * 100.0) / 100.0;
            });

        barData
            .exit()
            .transition()
            .duration(duration)
            .attr("y", function (d) {
                return yOrdScale(d.varName);
            })
            .style("fill", function (d) {
                return MosaicColorCodes.find((x) => x.code === colour.substring(0, 1)).color;
            })
            .attr("width", function (d, i) {
                return linearScale(barWidthval(d.obsOnExp));
            })
            .remove();

        this.allKeys
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text");

        this.allKeys
            .append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width / 2 + ",0)")
            .call(yAxis)
            .selectAll("text");
    }

    average(data) {
        const sum = data.reduce(function (sm, value) {
            return sm + value;
        }, 0);
        return sum / data.length;
    }
}
