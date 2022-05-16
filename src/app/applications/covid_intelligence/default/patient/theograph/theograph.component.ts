// @ts-nocheck
import { Component, OnInit, HostListener, Input, AfterViewInit } from "@angular/core";
import { dummydata } from "./DummyPatient";
import * as d3 from "d3";

export const actCodes = ["UCC", "AE", "IP_NEL", "IP_EL", "OP", "RADIO"];
export const actColours = ["#D73A89", "#ed5565", "#f8ac59", "#1ab394", "#23c6c8", "#389AD6"];
export const actNames = ["Urgent Care Centre", "Accident and Emergency", "Inpatient Admission (Non-elective)", "Inpatient Admission (Elective)", "Outpatient Appointment", "Radiography"];
export const actTyps = ["Inpatient", "Inpatient", "Emergency", "Emergency", "Appointment", "Appointment"];

@Component({
  selector: "app-theograph",
  templateUrl: "./theograph.component.html",
  styleUrls: ["./theograph.component.scss"],
})
export class TheographComponent implements OnInit, AfterViewInit {
  @Input() person: any;
  typname: any;
  focusBars: any;
  admissionBarWidth = 15;
  admissionBarWidthSmall = 5;
  admissionCircleRadius = 7;
  admissionCircleRadiusSmall = 2;
  totalHeight = 300;
  xAxis: any;
  xAxis2: any;
  yAxis: any;
  margin: any;
  margin2: any;
  width: any;
  height: any;
  height2: any;
  x: any;
  x2: any;
  y: any;
  y2: any;
  focusCircle: any;
  focus: any;
  color: any;
  typcat: any;
  div: any;
  admissionDetails: any;
  parseDate: any;
  brush: any;
  svg: any;
  toolTipInitialSize: any;
  hevents: any;
  context: any;
  showTheograph = false;

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    setTimeout(() => {
      this.redrawWidths();
    }, 0);
  }

  constructor() {
    const domain = origin.split("//")[1].split("/")[0].replace("www", "");
    if (domain.includes("localhost") || domain.includes("dev") || domain.includes("demo")) {
      this.showTheograph = true;
    }
  }

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.showTheograph) {
      this.redrawWidths();
      this.initGlobals();
      this.drawTheograph();
    }
  }

  redrawWidths() {
    const parentWidth = document.getElementById("theocontainer").clientWidth;
    this.margin = { top: 10, right: 100, bottom: 100, left: 80 };
    this.margin2 = { top: 230, right: 100, bottom: 20, left: 80 };
    this.width = parentWidth - this.margin.left - this.margin.right;
    this.height = this.totalHeight - this.margin.top - this.margin.bottom;
    this.height2 = this.totalHeight - this.margin2.top - this.margin2.bottom;

    this.x = d3.scaleTime().range([0, this.width]);
    this.x2 = d3.scaleTime().range([0, this.width]);
    this.y = d3.scaleBand().rangeRound([0, this.height]).padding(1);
    this.y2 = d3.scaleBand().rangeRound([0, this.height2]).padding(1);

    this.xAxis = d3.axisBottom(this.x);
    this.xAxis2 = d3.axisBottom(this.x2);
    this.yAxis = d3.axisLeft(this.y);
  }

  initGlobals() {
    this.color = d3.scaleOrdinal().domain(actCodes).range(actColours);
    this.typname = d3.scaleOrdinal().domain(actCodes).range(actNames);
    this.typcat = d3.scaleOrdinal().domain(actCodes).range(actTyps);
    this.div = d3.select("#wrapper").append("div").attr("id", "tooltip").attr("class", "tooltip").style("opacity", 0);
    this.admissionDetails = d3.select("#admissionDetails").style("opacity", 1);
    this.parseDate = d3.timeParse("%d/%m/%Y");
    this.toolTipInitialSize = [document.getElementById("admissionDetails").clientWidth, document.getElementById("admissionDetails").clientHeight];
  }

  drawTheograph() {
    this.svg = d3
      .select("#theograph")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height + this.margin.top + this.margin.bottom);
    this.svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", this.width).attr("height", this.height);
    this.focus = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    this.hevents = this.focus.append("g").attr("clip-path", "url(#clip)");
    this.context = this.svg.append("g").attr("transform", "translate(" + this.margin2.left + "," + this.margin2.top + ")");
    const newdata = JSON.parse(JSON.stringify(dummydata));
    newdata.forEach((element) => {
      if (element.EventDate) {
        element.EventDate = this.parseDate(element.EventDate);
      }
    });
    this.drawing(newdata);
    this.drawLegend();
  }

  drawing(data: any) {
    this.x.domain(
      d3.extent(
        data.map((d) => {
          return d.EventDate;
        })
      )
    );
    this.y.domain(
      data.map(function (d) {
        return d.TypeCat;
      })
    );
    this.x2.domain(this.x.domain());
    this.y2.domain(this.y.domain());
    this.focus
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .style("font-size", "12px")
      .call(this.xAxis);
    this.focus.append("g").attr("class", "y axis").style("font-size", "12px").call(this.yAxis);
    this.focusBars = this.hevents
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => {
        return this.x(d.EventDate);
      })
      .attr("y", (d) => {
        return this.y(d.TypeCat) - this.admissionBarWidth / 2.0;
      })
      .style("fill", (d) => {
        return this.color(d.Type);
      })
      .attr("width", (d) => {
        const fdate = new Date();
        const event = d.EventDate;
        fdate.setTime(event.getTime() + d.LengthOfStay * 1000 * 60 * 60 * 24);
        return this.x(fdate) - this.x(event);
      })
      .attr("height", this.admissionBarWidth)
      .on("mouseover.something", (d, me, t1) => {
        d3.select(t1[me])
          .transition()
          .style("fill-opacity", ".125")
          .attr("height", this.admissionBarWidth * 2)
          .style("stroke", "black");
        this.div.transition().duration(200).style("opacity", 0.9);

        this.addHtmlDetailsAndTooltip(this.div, d);

        
        this.div
          //@ts-ignore
          .style("left", d3.event.pageX + "px")
          .style("background", this.color(d.Type))
          //@ts-ignore
          .style("top", d3.event.pageY + "px")
          .style("width", this.toolTipInitialSize[1])
          .style("height", this.toolTipInitialSize[2]);
      })
      .on("mouseout.something", (d, me, t1) => {
        d3.select(t1[me]).transition().style("fill-opacity", "1").attr("height", this.admissionBarWidth).style("stroke", "none");
        this.div.transition().duration(500).style("opacity", 0);
      });

    this.brush = d3
      .brushX()
      .extent([
        [this.x2.range()[0], 0],
        [this.x2.range()[1], this.height2],
      ])
      .on("start", () => this.x2.domain())
      .on("brush", () => {
        //@ts-ignore
        const s = d3.event.selection; // || this.x2.range();
        this.x2.domain();
        this.x.domain(s.map(this.x2.invert, this.x2));
        this.focusBars
          .attr("x", (d, i) => {
            return this.x(d.EventDate);
          })
          .attr("width", (d) => {
            const fdate = new Date();
            fdate.setTime(d.EventDate.getTime() + d.LengthOfStay * 1000 * 60 * 60 * 24);
            return this.x(fdate) - this.x(d.EventDate);
          });
        this.focusCircle.attr("cx", (d, i) => {
          return this.x(d.EventDate);
        });
        this.focus.select(".x.axis").call(this.xAxis);
      });
    this.focusCircle = this.hevents
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => {
        return this.x(d.EventDate);
      })
      .attr("cy", (d) => {
        return this.y(d.TypeCat);
      })
      .style("fill", (d) => {
        return this.color(d.Type);
      })
      .style("fill-opacity", 1)
      .attr("r", (d) => {
        if (d.LengthOfStay > 0) {
          return 0;
        } else {
          return this.admissionCircleRadius;
        }
      })
      .on("mouseover.something", (d, me, t1) => {
        d3.select(t1[me])
          .transition()
          .style("fill-opacity", 0.125)
          .attr("r", this.admissionCircleRadius * 2)
          .style("stroke", "black");

        this.div.transition().duration(200).style("opacity", 0.9);

        this.addHtmlDetailsAndTooltip(this.div, d);

        this.div
          //@ts-ignore
          .style("left", d3.event.pageX + "px")
          .style("background", this.color(d.Type))
          //@ts-ignore
          .style("top", d3.event.pageY + "px")
          .style("width", this.toolTipInitialSize[1])
          .style("height", this.toolTipInitialSize[2]);
      })
      .on("mouseout.something", (d, me, t1) => {
        d3.select(t1[me]).transition().style("fill-opacity", 1).attr("r", this.admissionCircleRadius).style("stroke", "none");
        this.div.transition().duration(500).style("opacity", 0);
      })
      .on("click", (d, me, t1) => {
        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = document.getElementById("admissionDetails").getBoundingClientRect();

        const ttipTop = elemRect.top - bodyRect.top;
        const ttipLeft = elemRect.left - bodyRect.left;

        d3.select(t1[me])
          .transition()
          .transition()
          .duration(1000)
          .attr("r", this.admissionCircleRadius * 5)
          .transition()
          .duration(1000)
          .attr("r", this.admissionCircleRadius)
          .attr("r", this.admissionCircleRadius);

        // this.div
        //   .transition()
        //   .duration(1000)
        //   .style("left", ttipLeft + "px")
        //   .style("top", ttipTop + "px")
        //   .style("width", document.getElementById("admissionDetails").getBoundingClientRect().width + "px")
        //   .style("height", this.totalHeight + "px")
        //   .style("opacity", 0);

        this.addHtmlDetailsAndTooltip(this.admissionDetails, d);

        this.admissionDetails.style("opacity", 0).style("background", this.color(d.Type)).transition().duration(2000).style("opacity", 1);
      });

    this.context
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => {
        return this.x2(d.EventDate);
      })
      .attr("y", (d) => {
        return this.y2(d.TypeCat) - this.admissionBarWidthSmall / 2.0;
      })
      .style("fill", (d) => {
        return this.color(d.Type);
      })
      .attr("width", (d) => {
        const fdate = new Date();
        const event = d.EventDate;
        fdate.setTime(event.getTime() + d.LengthOfStay * 1000 * 60 * 60 * 24);
        return this.x2(fdate) - this.x2(event);
      })
      .attr("height", this.admissionBarWidthSmall);

    this.context
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => {
        return this.x2(d.EventDate);
      })
      .attr("cy", (d) => {
        return this.y2(d.TypeCat);
      })
      .style("fill", (d) => {
        return this.color(d.Type);
      })
      .attr("r", (d) => {
        if (d.LengthOfStay > 0) {
          return 0;
        } else {
          return this.admissionCircleRadiusSmall;
        }
      });

    this.context
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height2 + ")")
      .style("font-size", "12px")
      .call(this.xAxis2);

    this.context
      .append("g")
      .attr("class", "x brush")
      .call(this.brush)
      .selectAll("rect")
      .attr("y", -6)
      .attr("height", this.height2 + 7)
      .style("font-size", "12px");
  }

  convertDateToUS(date: string) {
    return date.substr(3, 2) + "-" + date.substr(0, 2) + "-" + date.substr(6, 2);
  }

  drawLegend() {
    const legend = d3.select("#legend").append("svg").attr("height", this.totalHeight);

    legend
      .selectAll("rect")
      .data(actCodes)
      .enter()
      .append("rect")
      .attr("x", 20)
      .attr("y", function (d, i) {
        return i * 45 + 20;
      })
      .attr("width", 20)
      .attr("height", 40)
      .style("fill", (d) => {
        return this.color(d);
      });

    legend
      .selectAll("text")
      .data(actCodes)
      .enter()
      .append("text")
      .attr("x", 50)
      .attr("y", function (d, i) {
        return i * 45 + 25 + 20;
      })
      .attr("width", 20)
      .attr("height", 40)
      .text((d) => {
        // Add total + selected time period total
        return this.typname(d);
      })
      .attr("font-size", "12px")
      .attr("fill", "black");
  }

  addHtmlDetailsAndTooltip(dv, d) {
    dv.html("<h3>" + this.typname(d.Type) + "</h3>" + "<p><b>Date: </b>" + d.EventDate.getDate() + "-" + (d.EventDate.getMonth() + 1) + "-" + d.EventDate.getFullYear() + "</p>" + "<p><b>Length of Stay:</b> " + d.LengthOfStay + " days</p>" + "<p><b>Specialty: </b>" + d.Specialty + "</p>" + "<p><b>Description:</b><br/>" + d.Description1 + "</p>" + "<p>" + d.Description2 + "</p>");
  }

  displayNHSNumber(nhsnumber: string) {
    if (nhsnumber.length > 0) {
      const first = nhsnumber.substring(0, 4);
      const second = nhsnumber.substr(4, 3);
      const third = nhsnumber.substr(7, 3);
      return first + " " + second + " " + third;
    }
    return "";
  }
}
