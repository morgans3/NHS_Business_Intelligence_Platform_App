import { Component, OnInit } from "@angular/core";
declare let require: any;
import * as dcFull from "dc";
import * as d3 from "d3";
import * as crossfilter from "crossfilter2";
import { StatCardData } from "../Regional/stat-card.component";
declare let leafletMarkerChartBubble: any;

@Component({
    selector: "app-virus-tests",
    templateUrl: "./virus-tests.component.html",
    styleUrls: ["./virus-tests.component.scss"],
})
export class VirusTestsComponent implements OnInit {
    volumeChart: any;
    map: any;
    mapCircleScalingFactor = 100;
    xf: any;
    groupname = "Bubbles";
    totalPositives: any;
    leftstatcard: StatCardData = {
        title: "TOTAL POSITIVES",
        value: "TotalPopulation",
        icon: "group",
        color: "bg-warning",
    };
    midleftstatcard: StatCardData = {
        title: "SELECTED PILLAR I",
        value: "Pillar1Total",
        icon: "group",
        color: "bg-danger",
    };
    midrightstatcard: StatCardData = {
        title: "SELECTED PILLAR II",
        value: "Pillar2Total",
        icon: "group",
        color: "bg-success",
    };
    rightstatcard: StatCardData = {
        title: "PERCENT SELECTED",
        value: "PercentSelected",
        icon: "group",
        color: "bg-primary",
    };

    constructor() {}

    ngOnInit() {
        setTimeout(() => {
            d3.csv("assets/cases.csv").then((cases) => this.drawBubbles(cases));
        }, 100);
    }

    mapSliderChanged(event) {
        this.mapCircleScalingFactor = event.value;
        this.map.circleScale(this.mapCircleScalingFactor * 50);
        this.map.redraw();
    }

    drawBubbles(data) {
        this.totalPositives = data.length;
        this.leftstatcard.text = this.totalPositives.toString();
        this.midleftstatcard.text = this.leftstatcard.text;
        this.midrightstatcard.text = "-";
        this.rightstatcard.text = "100%";

        const dateFormatSpecifier = "%Y-%m-%d";
        const dateFormat = d3.timeFormat(dateFormatSpecifier);
        const dateFormatParser = d3.timeParse(dateFormatSpecifier);

        const pos = {};
        const max = 50;
        data.forEach(function (d) {
            pos[d.code] = [d.Y, d.X];
            d.dd = dateFormatParser(d.date);
            d.day = d3.timeDay(d.dd);
        });

        this.xf = crossfilter(data);

        const facilities = this.xf.dimension((d: any) => {
            return d.code;
        });
        const facilitiesGroup = facilities.group();

        const width = document.getElementById("mapContainer").offsetWidth;

        this.map = leafletMarkerChartBubble("#mapContainer .map", this.groupname)
            .dimension(facilities)
            .group(facilitiesGroup)
            .width(width)
            .height(500)
            .mapOptions({
                zoom: 9,
                center: {
                    lat: 53.988255,
                    lng: -2.773179,
                },
            })
            .circleScale(this.mapCircleScalingFactor * 50)
            .locationAccessor((d) => pos[d.key]);
        // .r(d3.scaleLog().domain([1, max]).range([0, 20]));

        this.map.on("preRedraw", (chart) => {
            chart.circleScale(this.mapCircleScalingFactor);
        });
        this.map.on("filtered", (chart, filter) => {
            this.volumeChart.render();
        });

        const moveDay = this.xf.dimension((d: any) => d.day);

        const dailyMoveGroup = moveDay.group();
        this.volumeChart = dcFull.barChart(".datesel", this.groupname);

        this.volumeChart
            .width(width)
            .height(150)
            .margins({ top: 0, right: 50, bottom: 20, left: 40 })
            .dimension(moveDay)
            .group(dailyMoveGroup)
            .centerBar(false)
            .gap(1)
            .x(d3.scaleTime().domain([new Date(2020, 2, 8), new Date(2020, 6, 15)]))
            .round(d3.timeDay.round)
            .alwaysUseRounding(true)
            .xUnits(function () {
                return 100;
            });
        this.volumeChart.on("filtered", (chart, filter) => {
            this.map.redraw();
            const filteredPositives = this.map.data().reduce((a, b) => {
                const x = a || 0;
                const y = b.value || 0;
                return x + y;
            }, 0);

            this.midleftstatcard.text = filteredPositives.toString();
            this.rightstatcard.text = Math.round((100 * filteredPositives) / this.totalPositives)
                .toString()
                .concat(" %");
        });
        this.renderCharts();
    }

    renderCharts() {
        this.map.render();
        dcFull.renderAll(this.groupname);
    }
}
