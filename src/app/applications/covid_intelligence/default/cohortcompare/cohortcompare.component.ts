import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Store } from "@ngxs/store";

import * as d3 from "d3";
import * as L from "leaflet";
import { decodeToken } from "../../../../_pipes/functions";
import { Cohort, PopulationManagementService } from "diu-component-library";
import { FeatureCollection } from "diu-component-library";
import { MosaicCode } from "diu-component-library";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";
import { AuthState } from "../../../../_states/auth.state";
import { StatCardData } from "../Regional/stat-card.component";
import { CviCohortService } from "../../_services/cvicohort-service";

export class CompTableItem {
  chart: string;
  key: string;
  baselineValue: any;
  baselineRate: any;
  compValue: any;
  compRate: any;
  ratio: any;
}

export interface ResultSet {
  chartname: string;
  chartdata: CompTableItem[];
}

export class CompResults {
  details: ResultSet[];
  baselinePop: any;
  comparisonPop: any;
}

@Component({
  selector: "app-cohortcompare",
  templateUrl: "./cohortcompare.component.html",
  styleUrls: ["./cohortcompare.component.scss"],
})
export class CohortcompareComponent implements OnInit {
  /* #region Global Variables */
  displayResults: boolean;
  group = new FormGroup({
    baseline: new FormControl(),
    comparator: new FormControl(),
  });
  cohortList: Cohort[] = [];
  tokenDecoded: any;
  mosaicCodes: MosaicCode[];
  GPPractices: any;
  gpNameLookup: any[];
  Wards: FeatureCollection;
  wardNameLookup: any[];
  baselineCohort: StatCardData = {
    title: "BASELINE COST",
    value: "",
    icon: "group",
    color: "bg-warning",
  };
  baselinePop: StatCardData = {
    title: "BASELINE POPULATION",
    value: "",
    icon: "group",
    color: "bg-danger",
  };
  comparatorCohort: StatCardData = {
    title: "COMPARATOR COST",
    value: "",
    icon: "group",
    color: "bg-success",
  };
  comparatorPop: StatCardData = {
    title: "COMPARATOR POPULATION",
    value: "",
    icon: "group",
    color: "bg-primary",
  };
  finalCompareTable: ResultSet[] = [];
  compCharts = {};
  maps = {};
  mosaicTip: any;
  compTip: any;
  /* #endregion */

  constructor(
    private store: Store, 
    private notificationService: NotificationService, 
    private populationManagementService: PopulationManagementService,
    private cviCohortsService: CviCohortService,
    private apiService: APIService
  ) {
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      this.tokenDecoded = decodeToken(token);
      this.cviCohortsService.getByUsername(this.tokenDecoded.username).subscribe((res: Cohort[]) => {
        res.forEach((item) => {
          if (item.cohorturl.length < 3) {
            item.cohorturl = "{}";
          }
          if (typeof item.cohorturl === "object") {
            if (this.isEmpty(item.cohortName)) {
              item.cohorturl = "{}";
            } else {
              item.cohorturl = JSON.stringify(item.cohorturl);
            }
          }
        });
        this.cohortList = res;
      });
      this.apiService.getMosiacs().subscribe((res: MosaicCode[]) => {
        this.mosaicCodes = res;
      });
      this.apiService.getWards().subscribe((data: FeatureCollection[]) => {
        this.Wards = data[0];
        this.wardNameLookup = [];
        this.Wards.features.forEach((row) => {
          this.wardNameLookup.push({
            code: row.properties.wd15cd,
            name: row.properties.wd15nm,
          });
        });
      });
      this.apiService.getGPPractices().subscribe((data: any[]) => {
        this.GPPractices = data[0];
        this.gpNameLookup = [];
        this.GPPractices.features.forEach((row) => {
          this.gpNameLookup.push({
            code: row.properties.Code,
            name: row.properties.Name,
          });
        });
      });
    }
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  ngOnInit() {}

  calculateComparitor() {
    if (this.group.controls["baseline"].value && this.group.controls["comparator"].value) {
      this.displayResults = false;
      this.getComparisonData();
    } else {
      this.displayResults = null;
    }
  }

  getComparisonData() {
    const baselineCohort = this.group.controls["baseline"].value;
    const comparatorCohort = this.group.controls["comparator"].value;
    this.populationManagementService.getComparison({ cohorta: baselineCohort, cohortb: comparatorCohort }).subscribe((res: CompResults) => {
      if (res.details === undefined) {
        this.notificationService.error("No Response from Database. Please refresh page and if the issue persists contact Support.");
        return;
      }
      this.displayResults = true;
      this.finalCompareTable = res.details;

      this.baselinePop.text = res.baselinePop;
      this.comparatorPop.text = res.comparisonPop;

      this.mosaicTip = d3.select("mat-sidenav-content").append("div").attr("class", "tooltip").style("opacity", 0);
      this.compTip = d3.select("mat-sidenav-content").append("div").attr("class", "tooltip").style("opacity", 0);
      setTimeout(() => {
        this.finalCompareTable.forEach((comp) => {
          if (comp.chartname === "gp-map-leaflet-comp") {
            this.drawCompMap(comp.chartdata, "gp-map-leaflet-comp", this.GPPractices, "Code");
          } else if (comp.chartname === "ward-map-leaflet-comp") {
            this.drawCompMap(comp.chartdata, "ward-map-leaflet-comp", this.Wards, "wd15cd");
          } else if (comp.chartname === "ccg-select-comp") {
            comp.chartdata.forEach((elem) => {
              elem.key = this.ccgLookup(elem.key);
            });
            comp.chartdata.sort((a, b) => {
              return a.key > b.key ? -1 : a.key < b.key ? 1 : 0;
            });
            this.drawCompChart(comp.chartdata, "ccg-select-comp");
          } else {
            this.drawCompChart(comp.chartdata, comp.chartname);
          }
        }, 100);
      });
    });
  }

  ccgLookup(ccgcode: string) {
    switch (ccgcode) {
      case "02M":
        return "Fylde & Wyre";
      case "02G":
        return "West Lancs";
      case "01K":
        return "Lancashire North";
      case "01E":
        return "Greater Preston";
      case "01A":
        return "East Lancashire";
      case "00X":
        return "Chorley & South Ribble";
      case "00R":
        return "Blackpool";
      case "00Q":
        return "Blackburn with Darwen";
      default:
        return "Unknown CCG";
    }
  }

  /* #region Tooltip Functions */
  htmlComparatorTable(d: any) {
    let usedCompType, output;
    if (typeof d.data === "undefined") {
      usedCompType = d.key;
    } else {
      usedCompType = d.data.key;
    }
    output = "		<div class='row'>";
    output += "			<div class='col-md-12'>";
    output += "<table class='table'>";
    output += "  <thead>";
    output += "    <tr>";
    output += "      <th scope='col' style='width: 33.33%'></th>";
    output += "      <th scope='col' style='width: 33.33%'>" + this.group.controls["baseline"].value.cohortName + "</th>";
    output += "      <th scope='col' style='width: 33.33%'> " + this.group.controls["comparator"].value.cohortName + "</th>";
    output += "    </tr>";
    output += "  </thead>";
    output += "  <tbody>";
    output += "    <tr>";
    output += "      <th scope='row'>Total Pop</th>";
    output += "      <td>" + this.baselinePop.text + "</td>";
    output += "      <td>" + this.comparatorPop.text + "</td>";
    output += "    </tr>";
    output += "    <tr>";
    output += "      <th scope='row'>Total in group</th>";
    output += "      <td>" + this.numberWithCommas(d.baselineValue) + "</td>";
    output += "      <td>" + this.numberWithCommas(d.compValue) + "</td>";
    output += "    </tr>";
    output += "    <tr>";
    output += "      <th scope='row'>Rate</th>";
    output += "      <td>" + (d.baselineRate * 1000).toFixed(2).concat(" per 1000") + "</td>";
    output += "      <td>" + (d.compRate * 1000).toFixed(2).concat(" per 1000") + "</td>";
    output += "    </tr>";
    output += "      <th scope='row'></th>";
    output += "      <td></td>";
    output += "      <td></td>";
    output += "    <tr>";
    output += "    </tr>";
    output += "    <tr>";
    output += "      <th scope='row'></th>";
    output += "      <th>Expected</th>";
    output += "      <td>" + (d.baselineRate * parseFloat(this.comparatorPop.text)).toFixed(2).concat("") + "</td>";
    output += "    </tr>";
    output += "    <tr>";
    output += "      <th scope='row'></th>";
    output += "      <th>Ratio</th>";
    output += "      <td>" + this.ratioText(d) + "</td>";
    output += "    </tr>";
    output += "  </tbody>";
    output += "</table>";
    output += "			</div>";
    output += "		</div>";

    return output;
  }
  numberWithCommas(x) {
    if (x === null || typeof x === "undefined") {
      return "Nothing selected";
    } else {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
  ratioText(datum) {
    const ratio = datum.ratio;
    if (datum.baselineValue === 0 && datum.compValue === 0) {
      return "None in either";
    } else if (datum.baselineValue === 0) {
      return "None in baseline";
    } else if (datum.compValue === 0) {
      return "None in comparator";
    } else {
      return Math.round(ratio).toString().concat("%");
    }
  }

  htmlCompTooltip(d: any) {
    let usedCompType, output;
    if (typeof d.data === "undefined") {
      usedCompType = d.key;
    } else {
      usedCompType = d.data.key;
    }
    output = "	<div id='compToolTip' class='container d3-tip'>";
    output += "		<div class='row'>";
    output += "			<div class='col-md-12'>";
    output += "					<h5>" + this.chartNameToPrintable(d.chart) + ": " + usedCompType + "</h5>";
    output += "			</div>";
    output += "		</div>";
    output += this.htmlComparatorTable(d);
    output += "	</div>";
    return output;
  }
  chartNameToPrintable(key) {
    let printName = "";
    switch (key) {
      case "risk-chart-comp":
        printName = "Risk Score";
        break;
      case "age-chart-comp":
        printName = "Age";
        break;
      case "sex-chart-comp":
        printName = "Sex";
        break;
      case "ward-map-leaflet-comp":
        printName = "Electoral Ward";
        break;
      case "gp-map-leaflet-comp":
        printName = "GP Practice";
        break;
      case "ltc-chart-comp":
        printName = "Long-term Conditions";
        break;
      case "flags-chart-comp":
        printName = "Lists";
        break;
      case "no-selected-ltc-select-comp":
        printName = "Count of Selected LTCs";
        break;
      case "imd-chart-comp":
        printName = "Deprivation Decile";
        break;
      case "ltc-count-chart-comp":
        printName = "Count of LTCs";
        break;
      case "matrix-chart-comp":
        printName = "COVID Risk Matrix";
        break;
      case "ccg-select-comp":
        printName = "Commissioner";
        break;
      case "neighbourhood-select-comp":
        printName = "Neighbourhood";
        break;
      case "mosaic-chart-comp":
        printName = "Mosaic Type";
        break;
      default:
        printName = "Undefined Chart";
    }
    return printName;
  }

  htmlMosaicTooltip(d: any) {
    const mosaic: MosaicCode = this.mosaicCodes.find((x) => x.code === d.key);
    let usedMosaicType, isCompGraph, output;
    if (typeof d.data === "undefined") {
      usedMosaicType = d.key;
      isCompGraph = true;
    } else {
      usedMosaicType = d.data.key;
      isCompGraph = false;
    }
    output = "	<div id='mosaicToolTip' class='container d3-tip mosaic-" + usedMosaicType.substr(0, 1) + "'>";
    output += "		<div class='row'>";
    output += "			<div class='col-md-3'>";
    output += "<h1>" + usedMosaicType + "</h1>";
    output += "			</div>";
    output += "			<div class='col-md-9'>";
    output += "<h5>" + mosaic.name + "</h5>";
    output += "			</div>";
    output += "		</div>";
    output += "			<div class='row'>";
    output += "		<div class='col-md-12'>";
    output += "<h6>" + mosaic.desc + "</h6>";
    output += "			</div>";
    output += "		</div>";
    output += "			<div class='row'>";
    output += "		<div class='col-md-12'>";
    output += '<img alt="image" class="img-container" src="assets/images/mosaic/mosaic_' + usedMosaicType + '.jpg">';
    output += "			</div>";
    output += "		</div>";
    output += "			<div class='row'>";
    output += "		<div class='col-md-12'>";
    output += "<ul>";
    output += "<li>" + mosaic.Feat1 + "</li >";
    output += "<li>" + mosaic.Feat2 + "</li >";
    output += "<li>" + mosaic.Feat3 + "</li >";
    output += "<li>" + mosaic.Feat4 + "</li >";
    output += "<li>" + mosaic.Feat5 + "</li >";
    output += "<li>" + mosaic.Feat6 + "</li >";
    output += "<ul>";
    output += "			</div>";
    output += "		</div>";
    if (isCompGraph) {
      output += this.htmlComparatorTable(d);
    }
    output += "	</div>";
    return output;
  }
  /* #endregion */

  /* #region  Draw Charts and Maps */
  drawCompChart(data, chartName) {
    const margin = {
      top: 15,
      right: 40,
      bottom: 15,
      left: 40,
    };
    const width = 500 - margin.left - margin.right;
    const height = data.length * 25;
    if (this.compCharts[chartName]) {
      d3.select("#".concat(chartName)).append("svg").remove();
    }
    this.compCharts[chartName] = d3
      .select("#".concat(chartName))
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const axisCrossPoint = 100.0;
    const x = d3.scaleLinear().range([0, width]).domain([0, 200]);
    const y = d3
      .scaleBand()
      .rangeRound([height, 0])
      .domain(
        data.map((d) => {
          return d.key;
        })
      );
    const yAxisLeft = d3.axisLeft(y).tickSize(0);
    const yAxisRight = d3.axisRight(y).tickSize(0);
    const duration = 2000;
    const maxCompPopInChart = d3.max(data, (d: any) => {
      return d.compValue;
    });
    const bars = this.compCharts[chartName].selectAll(".bar").data(data);
    const new_bars = bars
      .enter()
      .append("rect")
      .attr("opacity", 0)
      .attr("class", (d) => {
        return "bar ".concat(this.barColourSelector(d.key, chartName));
      })
      .attr("y", (d) => {
        return y(d.key);
      })
      .attr("height", y.bandwidth())
      .attr("x", (d) => {
        return x(Math.min(this.ratioPosition(d, axisCrossPoint), axisCrossPoint));
      })
      .attr("width", (d) => {
        return x(Math.abs(Math.min(this.ratioPosition(d, axisCrossPoint), axisCrossPoint * 2) - axisCrossPoint));
      });
    if (chartName === "mosaic-chart-comp") {
      new_bars.on("mouseenter.something", (d, index, array) => this.mosaicMouseEnter(d, index, array)).on("mouseout.something", () => this.mouseLeave());
      bars.on("mouseenter.something", (d, index, array) => this.mosaicMouseEnter(d, index, array)).on("mouseout.something", () => this.mouseLeave());
    } else {
      new_bars.on("mouseenter.something", (d, index, array) => this.compMouseEnter(d, index, array)).on("mouseout.something", () => this.mouseLeave());
      bars.on("mouseenter.something", (d, index, array) => this.compMouseEnter(d, index, array)).on("mouseout.something", () => this.mouseLeave());
    }
    new_bars
      .merge(bars)
      .transition()
      .duration(duration)
      .attr("opacity", (d) => {
        return (d.compValue / parseInt(maxCompPopInChart)) * 0.9 + 0.1;
      })
      .attr("y", (d) => {
        return y(d.key);
      })
      .attr("height", y.bandwidth())
      .attr("x", (d) => {
        return x(Math.min(this.ratioPosition(d, axisCrossPoint), axisCrossPoint));
      })
      .attr("width", (d) => {
        return x(Math.abs(Math.min(this.ratioPosition(d, axisCrossPoint), axisCrossPoint * 2) - axisCrossPoint));
      });
    bars.exit().transition().duration(duration).attr("height", y.bandwidth()).attr("y", height).attr("opacity", 0).remove();
    const labels = this.compCharts[chartName].selectAll(".label").data(data);
    const new_labels = labels
      .enter()
      .append("text")
      .attr("opacity", 0)
      .attr("class", "label")
      .attr("y", (d) => {
        return y(d.key) + y.bandwidth() / 2 + 4;
      })
      .attr("x", (d) => {
        return this.getLabelPosition(d, axisCrossPoint, x);
      })
      .text((d) => {
        return this.ratioText(d);
      });
    new_labels
      .merge(labels)
      .transition()
      .duration(duration)
      .attr("opacity", 1)
      .attr("y", (d) => {
        return y(d.key) + y.bandwidth() / 2 + 4;
      })
      .attr("x", (d) => {
        return this.getLabelPosition(d, axisCrossPoint, x);
      })
      .text((d) => {
        return this.ratioText(d);
      });
    labels.exit().transition().duration(duration).attr("y", height).attr("opacity", 0).remove();
    const gyLeft = this.compCharts[chartName]
      .append("g")
      .attr("class", "y axis left")
      .attr("display", "block")
      .attr("font-weight", "600")
      .attr("transform", "translate(" + x(axisCrossPoint) + ",0)");
    gyLeft.call(yAxisLeft);
    const leftTicks = gyLeft.selectAll(".tick").style("display", (d) => {
      const ratio = data.filter((c) => c.key === d)[0].ratio;
      if (ratio < 100.1) {
        return "none";
      }
      return "block";
    });
    const gyRight = this.compCharts[chartName]
      .append("g")
      .attr("class", "y axis right")
      .attr("display", "block")
      .attr("font-weight", "600")
      .attr("transform", "translate(" + x(axisCrossPoint) + ",0)");
    gyRight.call(yAxisRight);
    const rightTicks = gyRight.selectAll(".tick").style("display", (d) => {
      const ratio = data.filter((c) => c.key === d)[0].ratio;
      if (ratio >= 100.1) {
        return "none";
      }
      return "block";
    });
  }
  barColourSelector(key, chartName) {
    let returnCol;
    switch (chartName) {
      case "risk-chart-comp":
        returnCol = "nexus-lazur";
        break;
      case "age-chart-comp":
        returnCol = "nexus-yellow";
        break;
      case "sex-chart-comp":
        if (key === "Male") {
          returnCol = "nexus-lazur";
        } else {
          returnCol = "nexus-red";
        }
        break;
      case "ltc-chart-comp":
        returnCol = "nexus-red";
        break;
      case "flag-chart-comp":
        returnCol = "nexus-red";
        break;
      case "imd-chart-comp":
        returnCol = "nexus-yellow";
        break;
      case "ltc-count-chart-comp":
        returnCol = "nexus-navy";
        break;
      case "matrix-chart-comp":
        returnCol = "nexus-red";
        break;
      case "ccg-select-comp":
        returnCol = "nexus-navy";
        break;
      case "neighbourhood-select-comp":
        returnCol = "nexus-lazur";
        break;
      case "mosaic-chart-comp":
        const mosaicGroup = key.substr(0, 1);
        returnCol = "mosaic-".concat(mosaicGroup);
        break;
      default:
        returnCol = "nexus-yellow";
    }
    return returnCol;
  }
  ratioPosition(datum, axisCrossPoint) {
    const ratio = datum.ratio;
    if (datum.baselineValue === 0 && datum.compValue === 0) {
      return axisCrossPoint;
    } else if (datum.baselineValue === 0) {
      return axisCrossPoint * 2;
    } else {
      return ratio;
    }
  }
  getLabelPosition(datum, axisCrossPoint, x) {
    let adjPos;
    let ratio = datum.ratio;
    if (isNaN(ratio)) {
      adjPos = 3;
    } else if (this.ratioPosition(datum, axisCrossPoint) < axisCrossPoint) {
      adjPos = Math.round(this.ratioPosition(datum, axisCrossPoint)).toString().length * -4 - 13;
    } else {
      const txtLength = this.ratioText(datum).length;
      if (txtLength > 6) {
        adjPos = txtLength * -4;
      } else {
        adjPos = 3;
      }
    }
    return x(Math.min(this.ratioPosition(datum, axisCrossPoint), axisCrossPoint * 2)) + adjPos;
  }
  mosaicMouseEnter(datum: any, index: number, array: any[]) {
    const attributes = array[index]["attributes"];
    const x = parseInt(attributes["x"].nodeValue);
    const y = parseInt(attributes["y"].nodeValue);
    const rect = document.getElementById(datum["chart"]).getBoundingClientRect();
    const drawer = document.getElementsByClassName("mat-drawer-content")[0];
    this.mosaicTip.transition().duration(200).style("opacity", 0.9);
    this.mosaicTip
      .html(this.htmlMosaicTooltip(datum))
      .style("left", rect.left - x + "px")
      .style("top", drawer.scrollTop + rect.top + y - 150 + "px");
  }
  compMouseEnter(datum: any, index: number, array: any[]) {
    const attributes = array[index]["attributes"];
    const x = parseInt(attributes["x"].nodeValue);
    const y = parseInt(attributes["y"].nodeValue);
    const rect = document.getElementById(datum["chart"]).getBoundingClientRect();
    const drawer = document.getElementsByClassName("mat-drawer-content")[0];
    this.compTip.transition().duration(200).style("opacity", 0.9);
    this.compTip
      .html(this.htmlCompTooltip(datum))
      .style("left", rect.left - x + "px")
      .style("top", drawer.scrollTop + rect.top + y - 150 + "px");
  }
  mouseLeave() {
    this.compTip.style("opacity", 0);
    this.mosaicTip.style("opacity", 0);
  }

  drawCompMap(data, chartName, json, lnkFieldName) {
    if (typeof this.maps[chartName] !== "undefined") {
      this.maps[chartName].off();
      this.maps[chartName].remove();
    }
    this.maps[chartName] = L.map(chartName).setView([53.967752, -2.444284], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
    }).addTo(this.maps[chartName]);
    let maxCompPop = 0;
    for (const key in json.features) {
      // skip loop if the property is from prototype
      if (!json.features.hasOwnProperty(key)) {
        continue;
      }
      const featName = json.features[key].properties[lnkFieldName];
      json.features[key].properties["ratio"] = this.searchArray(featName, data, "ratio");
      json.features[key].properties["locName"] = this.searchArray(featName, data, "key");
      json.features[key].properties["chart"] = this.searchArray(featName, data, "chart");
      json.features[key].properties["baselineRate"] = this.searchArray(featName, data, "baselineRate");
      json.features[key].properties["baselineValue"] = this.searchArray(featName, data, "baselineValue");
      json.features[key].properties["compRate"] = this.searchArray(featName, data, "compRate");
      json.features[key].properties["compValue"] = this.searchArray(featName, data, "compValue");
      const compValue = this.searchArray(featName, data, "compValue");
      if (compValue > maxCompPop) {
        maxCompPop = compValue;
      }
      json.features[key].properties["compPop"] = compValue;
    }
    L.geoJSON(json, {
      style: (feature) => {
        const mag = feature.properties.ratio;
        let opacTuUse;
        if (typeof feature.properties.compPop === "undefined") {
          opacTuUse = 0;
        } else {
          opacTuUse = feature.properties.compPop / maxCompPop;
        }
        let f_color = "#1a9850";
        if (mag >= 400) {
          f_color = "#d73027";
        } else if (mag >= 267) {
          f_color = "#f46d43";
        } else if (mag >= 178) {
          f_color = "#fdae61";
        } else if (mag >= 119) {
          f_color = "#fee08b";
        } else if (mag >= 79) {
          f_color = "#ffffbf";
        } else if (mag >= 53) {
          f_color = "#d9ef8b";
        } else if (mag >= 35) {
          f_color = "#a6d96a";
        } else if (mag >= 23) {
          f_color = "#66bd63";
        } else {
          f_color = "#1a9850";
        }
        return {
          opacity: 0.9,
          weight: 2,
          fillOpacity: opacTuUse,
          color: "#BAADAB",
          fillColor: f_color,
        };
      },
      onEachFeature: (feature, layer) => {
        const popupText = "<h3>" + this.locName(feature.properties.locName, chartName) + "</h2>" + this.htmlComparatorTable(feature.properties);
        layer.bindPopup(popupText, {
          closeButton: true,
          offset: L.point(0, -20),
        });
      },
      pointToLayer: function (feature, latlng) {
        let radToUse;
        if (typeof feature.properties.compPop === "undefined") {
          radToUse = 0;
        } else {
          radToUse = feature.properties.compPop / maxCompPop;
        }
        return L.circleMarker(latlng, {
          radius: 5 + radToUse * 20,
        });
      },
    }).addTo(this.maps[chartName]);
  }
  locName(locCode, chtType) {
    if (chtType === "gp-map-leaflet-comp") {
      let name = "Unknown";
      if (this.gpNameLookup.find((x) => x.code === locCode)) {
        name = this.gpNameLookup.find((x) => x.code === locCode).name;
      }
      return name;
    } else if (chtType === "ward-map-leaflet-comp") {
      if (locCode) {
        let name = "Unknown";
        if (this.wardNameLookup.find((x) => x.code === locCode)) {
          name = this.wardNameLookup.find((x) => x.code === locCode).name;
        }
        return name;
      } else {
        return locCode;
      }
    } else {
      return locCode;
    }
  }
  searchArray(nameKey, myArray, returnField) {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].key === nameKey) {
        return myArray[i][returnField];
      } else if (i === myArray.length - 0) {
        return NaN;
      }
    }
  }
  mergeObjects(obj1, obj2) {
    // if (!isChrome) {
    if (true) {
      const obj3 = {};
      // tslint:disable-next-line: forin
      for (const attrname in obj1) {
        obj3[attrname] = obj1[attrname];
      }
      // tslint:disable-next-line: forin
      for (const attrname in obj2) {
        obj3[attrname] = obj2[attrname];
      }
      return obj3;
    } else {
      return Object.assign(obj1, obj2);
    }
  }
  /* #endregion */
}
