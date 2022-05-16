import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { APIService } from "diu-component-library";
import * as d3 from "d3-selection";
import * as d3Scale from "d3-scale";
import * as d3Axis from "d3-axis";
import * as d3_test from "d3";

declare var require: any;
const icdlookup = require("../../../_data/ICDLookup.json");
let aii = require("../../../_data/admissions_inequality.json");
aii = JSON.parse(
  JSON.stringify(aii)
    .split('"id":')
    .join('"name":')
);
//document.write(JSON.stringify(aii));
aii = JSON.parse(
  JSON.stringify(aii)
    .split('"sii":')
    .join('"value":')
);
//document.write(JSON.stringify(aii));
aii = JSON.parse(
  JSON.stringify(aii)
    .split('"children":')
    .join('"drilldown":')
);
//document.write(JSON.stringify(aii));
let mii = require("../../../_data/mortality_inequality.json");
mii = JSON.parse(
  JSON.stringify(mii)
    .split('"id":')
    .join('"name":')
);
//document.write(JSON.stringify(mii));
mii = JSON.parse(
  JSON.stringify(mii)
    .split('"sii":')
    .join('"value":')
);
//document.write(JSON.stringify(mii));
mii = JSON.parse(
  JSON.stringify(mii)
    .split('"children":')
    .join('"drilldown":')
);
//document.write(JSON.stringify(mii));
let a_dsr = require("../../../_data/admissions_dsr.JSON");
let m_dsr = require("../../../_data/mortality_dsr.JSON");

@Component({
  selector: "app-health-inequalities-tool",
  templateUrl: "./health-inequalities-tool.component.html",
  styleUrls: ["./health-inequalities-tool.component.scss"]
})
export class HealthInequalitiesToolComponent implements OnInit {
  @ViewChild("graphMain", { static: false }) graphMain: ElementRef;
  @ViewChild("cardMain", { static: false }) cardMain: ElementRef;
  @ViewChild("toolbarMain", { static: false }) toolbarMain: ElementRef;
  margin = { top: 20, right: 20, bottom: 50, left: 20 };
  height: number;
  width: number;
  m_x: any;
  a_x: any;
  y: any;
  svg: any;
  g: any;
  line: any;
  root: any;
  draw_aii = [aii];
  old_aii = [aii];
  draw_mii = [mii];
  old_mii = [mii];
  level = 0;
  a_chapter: number;
  a_cat1: number;
  a_cat2: number;
  a_cat3: number;
  a_cat4: number;
  m_chapter: number;
  m_cat1: number;
  m_cat2: number;
  m_cat3: number;
  m_cat4: number;
  plotwidth: number;
  plotheight: number;
  tooltip: any;

  dsr_height: number;
  dsr_width: number;
  dsr_x: any;
  dsr_y: any;
  dsr_svg: any;
  dsr_g: any;
  dsr_plotwidth: number;
  dsr_plotheight: number;

  constructor(
    private apiService: APIService,
    private http: HttpClient
  ) {
    this.recordView();
  }

  recordView() {
    const url =
      window.location !== window.parent.location
        ? document.referrer
        : document.location.href;
    const newView = {
      page: "health_inequalities_tool",
      parent: url
    };
    this.apiService.addOpenSourceView(newView).subscribe((data: any) => {
      console.log(data);
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.plot_bars();
      this.setToolbarCardHeight();
    }, 500);
  }

  setToolbarCardHeight() {
    const innerCardHeight = this.cardMain.nativeElement.clientHeight + 40;
    this.toolbarMain.nativeElement.setAttribute(
      "style",
      "height: " + innerCardHeight + "px"
    );
  }

  plot_bars() {
    this.init_svg();
    this.init_axis();
    this.draw_bars();
    this.draw_axis();
  }

  init_svg() {
    const svg_remove = d3_test.select("#admissions_container");
    svg_remove.selectAll("*").remove();

    this.plotwidth = this.graphMain.nativeElement.clientWidth - 50;
    this.plotheight = (this.plotwidth / 5) * 2.5;

    d3.select("#admissions_container")
      .append("svg")
      .attr("id", "admissions_container_plot")
      .attr("width", this.plotwidth)
      .attr("height", this.plotheight);
    this.svg = d3.select("#admissions_container_plot");
    this.width = this.plotwidth - this.margin.left - this.margin.right;
    this.height = this.plotheight - this.margin.top - this.margin.bottom;
    this.g = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );
  }
  // Define plot axis lengths
  init_axis() {
    const data = this.draw_aii.concat(this.draw_mii);
    this.m_x = d3Scale.scaleLinear().range([this.width / 2, 0]);
    this.a_x = d3Scale.scaleLinear().range([this.width / 2, this.width]);
    this.y = d3Scale
      .scaleBand()
      .rangeRound([this.height, 0])
      .padding(0.1);
    this.y.domain(data.map(d => d.name));
    this.m_x.domain([0, d3_test.max(this.draw_mii.map(d => d.value))]);
    this.a_x.domain([
      0,
      Math.max.apply(
        Math,
        this.draw_aii.map(d => d.value)
      )
    ]);
  }
  // Draw axes onto the plot
  draw_axis() {
    // y-axis
    this.g
      .append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(" + this.width / 2 + ",0)")
      .attr("id", "y_axis")
      .call(d3Axis.axisLeft(this.y));
    // Swap y-axis label side for negative values
    this.g
      .selectAll(".tick")
      .data(aii)
      .select("text")
      .attr("x", "-9")
      .style("text-anchor", "end"); //(d, i) => (d.value < 1 ? "start" : "end"));
    // Mortality x-axis
    this.g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.m_x).ticks(10));
    // Admissions x-axis
    this.g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.a_x).ticks(10));
    // x-axis label
    this.g
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        "translate(" +
          (0.5 * this.width) / 2 +
          "," +
          (this.plotheight - 25) +
          ")"
      )
      .text("SII [# per 100,000]");
    // x-axis label
    this.g
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        "translate(" +
          (1.5 * this.width) / 2 +
          "," +
          (this.plotheight - 25) +
          ")"
      )
      .text("SII [# per 1000]");
    // y-axis label
    this.g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(-5," + this.height / 2 + ")rotate(-90)")
      .text("ICD Group");
    // title
    this.g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (1.5 * this.width) / 2 + ",0)")
      .text("Admissions");
    this.g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (0.5 * this.width) / 2 + ",0)")
      .text("Mortality");
  }
  // Draw the bars onto the barplot
  draw_bars() {
    this.add_rank(this.draw_aii);
    this.add_rank(this.draw_mii);
    const right_bars = this.g
      .selectAll(".bar")
      .data(this.draw_aii)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", d => d3_test.interpolatePRGn(d.rank))
      .attr("opacity", d => Math.max(1 - d.p_rii, 0.1))
      .attr("y", d => this.y(d.name))
      .attr("x", this.a_x(0))
      .attr("stroke", "black")
      .attr("stroke-width", 0.4)
      .attr("height", this.y.bandwidth())
      .attr("width", d => this.a_x(d.value) - this.a_x(0));
    const left_bars = this.g
      .selectAll(".left_bar")
      .data(this.draw_mii)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", d => d3_test.interpolatePRGn(d.rank))
      .attr("opacity", d => Math.max(1 - d.p_rii, 0.1))
      .attr("y", d => this.y(d.name))
      .attr("x", d => this.m_x(d.value))
      .attr("stroke", "black")
      .attr("stroke-width", 0.4)
      .attr("height", this.y.bandwidth())
      .attr("width", d => this.m_x(0) - this.m_x(d.value));
    right_bars
      .on("click", (d, i) => this.one_down(d, i))
      .on("mouseover.something", (d: any) => {
        this.showTooltip(d, "Admissions");
      })
      .on("mouseout.something", () => {
        // this.tooltip = null;
      });
    left_bars
      .on("click", (d, i) => this.one_down(d, i))
      .on("mouseover.something", (d: any) => {
        this.showTooltip(d, "Mortality");
      })
      .on("mouseout.something", () => {
        // this.tooltip = null;
      });
  }
  one_down(d: any, i: any) {
    switch (this.level) {
      case 1:
        this.a_chapter = d.name;
        this.m_chapter = d.name;
        break;
      case 2:
        this.a_cat1 = d.name;
        this.m_cat1 = d.name;
        break;
      case 3:
        this.a_cat2 = d.name;
        this.m_cat2 = d.name;
        break;
      case 4:
        this.a_cat3 = d.name;
        this.m_cat3 = d.name;
        break;
      case 5:
        this.a_cat4 = d.name;
        this.m_cat4 = d.name;
        break;
      default:
        break;
    }
    this.draw_aii = this.sub_item(this.draw_aii, d.name, "down");
    this.draw_mii = this.sub_item(this.draw_mii, d.name, "");
    this.plot_bars();
  }
  one_up() {
    switch (this.level) {
      case 0:
        this.draw_aii = this.old_aii;
        this.draw_mii = this.old_mii;
        break;
      case 1:
        this.draw_aii = this.old_aii;
        this.draw_mii = this.old_mii;
        this.level = 0;
        break;
      case 2:
        this.draw_aii = this.old_aii[0].drilldown;
        this.draw_mii = this.old_mii[0].drilldown;
        this.level = 1;
        break;
      case 3:
        this.draw_aii = this.sub_item(
          this.old_aii[0].drilldown,
          this.a_chapter.toString(),
          "up"
        );
        this.draw_mii = this.sub_item(
          this.old_mii[0].drilldown,
          this.m_chapter.toString(),
          ""
        );
        break;
      case 4:
        this.draw_aii = this.sub_item(
          this.sub_item(
            this.old_aii[0].drilldown,
            this.a_chapter.toString(),
            ""
          ),
          this.a_cat1.toString(),
          "up"
        );
        this.draw_mii = this.sub_item(
          this.sub_item(
            this.old_mii[0].drilldown,
            this.m_chapter.toString(),
            ""
          ),
          this.m_cat1.toString(),
          ""
        );
        break;
      case 5:
        this.draw_aii = this.sub_item(
          this.sub_item(
            this.sub_item(
              this.old_aii[0].drilldown,
              this.a_chapter.toString(),
              ""
            ),
            this.a_cat1.toString(),
            ""
          ),
          this.a_cat2.toString(),
          "up"
        );
        this.draw_mii = this.sub_item(
          this.sub_item(
            this.sub_item(
              this.old_mii[0].drilldown,
              this.m_chapter.toString(),
              ""
            ),
            this.m_cat1.toString(),
            ""
          ),
          this.m_cat2.toString(),
          ""
        );
        break;
      case 6:
        this.draw_aii = this.sub_item(
          this.sub_item(
            this.sub_item(
              this.sub_item(
                this.old_aii[0].drilldown,
                this.a_chapter.toString(),
                ""
              ),
              this.a_cat1.toString(),
              ""
            ),
            this.a_cat2.toString(),
            ""
          ),
          this.a_cat3.toString(),
          "up"
        );
        this.draw_mii = this.sub_item(
          this.sub_item(
            this.sub_item(
              this.sub_item(
                this.old_mii[0].drilldown,
                this.m_chapter.toString(),
                ""
              ),
              this.m_cat1.toString(),
              ""
            ),
            this.m_cat2.toString(),
            ""
          ),
          this.m_cat3.toString(),
          ""
        );
        break;
      default:
        break;
    }
    this.plot_bars();
  }
  add_rank(data: any[]) {
    const sort_rii = data.slice().sort(function(a, b) {
      return b.rii - a.rii;
    });
    const rii_rank = data.slice().map(v => {
      return sort_rii.indexOf(v) + 1;
    });
    const rank_transformed = rii_rank;
    data.forEach((d, i) => {
      d.rank = rii_rank[i] / d3_test.max(rii_rank);
    });
  }
  sub_item(data, name: string, type: string) {
    if (name.length === 4 && this.level > 2) {
      this.level = this.level;
      return data;
    } else {
      if (type === "down") {
        this.level = this.level + 1;
      } else if (type === "up") {
        this.level = this.level - 1;
      }
      const filtered = data.filter(item => Object.values(item).includes(name));
      if (!filtered[0]) {
        return filtered;
      } else {
        return filtered[0].drilldown;
      }
    }
  }

  showTooltip(datum: any, type: string) {
    const icd = icdlookup.filter(x => x.ICD10Code === datum.name);
    let cat = "";
    if (icd[0]) {
      cat = icd[0].ICD10Description;
    }
    let rate_multiplier = "";
    if (type === "Mortality") {
      rate_multiplier = "100,000";
    } else {
      rate_multiplier = "1000";
    }
    this.tooltip = {
      type: type,
      multiplier: rate_multiplier,
      icdcode: datum.name,
      icdcategory: cat,
      sii: Math.round(1000 * datum.value) / 1000,
      rii: Math.round(1000 * datum.rii) / 1000
    };
    if (type === "Mortality") {
      this.plot_dsr(
        m_dsr[0].filter(x => x.id === datum.name),
        rate_multiplier
      );
    } else {
      this.plot_dsr(
        a_dsr[0].filter(x => x.id === datum.name),
        rate_multiplier
      );
    }
  }

  plot_dsr(data: any[], rate: string) {
    this.init_dsr();
    this.init_dsr_axis(data);
    this.draw_dsr(data);
    this.draw_dsr_axis(rate);
  }

  init_dsr() {
    const svg_remove = d3_test.select("#dsr_container");
    svg_remove.selectAll("*").remove();

    this.dsr_plotwidth = this.toolbarMain.nativeElement.clientWidth - 50;
    this.dsr_plotheight = (this.dsr_plotwidth / 5) * 3;

    d3.select("#dsr_container")
      .append("svg")
      .attr("id", "dsr_container_plot")
      .attr("width", this.dsr_plotwidth)
      .attr("height", this.dsr_plotheight);
    this.dsr_svg = d3.select("#dsr_container_plot");
    this.dsr_width =
      this.dsr_plotwidth - 3 * this.margin.left - this.margin.right;
    this.dsr_height =
      this.dsr_plotheight - this.margin.top - this.margin.bottom;
    this.dsr_g = this.dsr_svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );
  }
  // Define plot axis lengths
  init_dsr_axis(data: any[]) {
    this.dsr_x = d3Scale
      .scaleLinear()
      .rangeRound([2 * this.margin.left, this.dsr_width]);
    this.dsr_y = d3Scale.scaleLinear().rangeRound([this.dsr_height, 0]);
    this.dsr_y.domain([
      0,
      Math.ceil(d3_test.max(data.map(d => d.standard_rate)))
    ]);
    this.dsr_x.domain([1, 5]);
  }
  // Draw axes onto the plot
  draw_dsr_axis(rate: string) {
    // y-axis
    this.dsr_g
      .append("g")
      .attr("class", "axis axis--y")
      .attr("id", "y_axis")
      .attr("transform", "translate(" + 2 * this.margin.left + ", 0)")
      .call(d3Axis.axisLeft(this.dsr_y));
    // Swap y-axis label side for negative values
    this.dsr_g
      .selectAll(".dsr_tick")
      .select("text")
      .attr("x", "-9")
      .style("text-anchor", "end");
    // Mortality x-axis
    this.dsr_g
      .append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.dsr_height + ")")
      .call(d3Axis.axisBottom(this.dsr_x).ticks(4));
    // x-axis label
    this.dsr_g
      .append("text")
      .attr("text-anchor", "middle")
      .attr(
        "transform",
        "translate(" +
          this.dsr_width / 2 +
          "," +
          (this.margin.bottom + this.dsr_height) +
          ")"
      )
      .text("IMD Group");
    // y-axis label
    this.dsr_g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(-5," + this.dsr_height / 2 + ")rotate(-90)")
      .text("DSR [# per " + rate + "]");
    // title
    this.dsr_g
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + this.dsr_width / 2 + ",0)")
      .text("DSR");
  }
  // Draw the bars onto the barplot
  draw_dsr(data: any[]) {
    const bars = this.dsr_g
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("fill", "purple")
      .attr("cy", d => this.dsr_y(d.standard_rate))
      .attr("cx", d => this.dsr_x(6 - d.imd_group))
      .attr("r", 3);
  }
}
