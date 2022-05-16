import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges } from "@angular/core";
import { APIService } from "diu-component-library";
import { MosaicCode, MosaicColorCodes } from "../../../_models/mosaiccode";
import { CategoryBreakdown } from "../../../_models/categorybreakdown";
import { GSIComponent } from "../GSI/GSI.component";

import * as d3 from "d3";
import fisheye from "./d3.fisheye.js";

export interface GIGraphKey {
  name: string;
  variableRange: object;
  MosaicTypeLookup: object;
  MosaicTypeLookupValAndRange: object;
}

@Component({
  providers: [GSIComponent],
  selector: "app-mosaic-key",
  templateUrl: "./mosaic-key.component.html",
  styleUrls: ["./mosaic-key.component.scss"]
})
export class MosaicKeyComponent implements OnInit, OnChanges {

  @ViewChild("giKeyGraph") giKeyGraphDiv: ElementRef;
  @Input() gsiData: any;
  @Input() settings: GIGraphKey;

  GSImain: GSIComponent;
  giTable: CategoryBreakdown[];
  mosaicCodes: MosaicCode[];
  thematicBars: any;
  mosTypeBars: any;
  mosTypeLines: any;

  constructor(
    private apiService: APIService
  ) {}

  ngOnInit() {
    this.drawKey(this.sortProperties(this.settings.MosaicTypeLookupValAndRange));
    this.apiService.getMosiacs().subscribe((res: MosaicCode[]) => {
      this.mosaicCodes = res;
    });
  }

  ngOnChanges() {
    this.drawKey(this.sortProperties(this.settings.MosaicTypeLookupValAndRange));
  }

  sortProperties(obj) {
    const sortable = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sortable.push([key, obj[key]]);
      }
    }
    sortable.sort(function(a, b) {
      const x = a[1][1],
        y = b[1][1];
      return x < y ? -1 : x > y ? 1 : 0;
    });
    return sortable;
  }

  drawKey(SortedKey) {
    const totalTypes = SortedKey.length;
    const KeyBoxCutoffs = [];
    SortedKey.forEach(function(x, i) {
      if (i < totalTypes - 1) {
        KeyBoxCutoffs.push((x[1][0] + SortedKey[i + 1][1][0]) / 2);
      } else {
        const lastValue = (SortedKey[i - 1][1][0] + SortedKey[i][1][0]) / 2;
        const lastDiff = x[1][0] - lastValue;
        KeyBoxCutoffs.push(x[1][0] + lastDiff);
      }
    });
    let lastRange = KeyBoxCutoffs[0] - (KeyBoxCutoffs[1] - KeyBoxCutoffs[0]);
    KeyBoxCutoffs.forEach(function(x, i) {
      KeyBoxCutoffs[i] = { start: lastRange, end: x };
      lastRange = KeyBoxCutoffs[i].end;
    });

    SortedKey.forEach(function(x, i) {
      x.push(KeyBoxCutoffs[i]);
    });

    const margin = { top: 10, right: 10, bottom: 20, left: 10 };

    const width = document.getElementById("giKeyGraph").offsetWidth - (margin.left + margin.right),
      height = 150;

    const firstRun = d3
      .select("#giKeyGraph")
      .select("svg")
      .empty();
    const allKeys = [];
    if (firstRun) {
      allKeys["mainKey"] = d3
        .select("#giKeyGraph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    } else {
      allKeys["mainKey"] = d3.select("#giKeyGraph").select("svg");
    }
    const duration = 2000;
    const keyBarHeight = height / 3;
    const start = SortedKey[0][2].start;
    const end = SortedKey[SortedKey.length - 1][2].end;
    const linearScale = d3
      .scaleLinear()
      .domain([start, end])
      .range([0, width]);
    const xFisheye = fisheye
      .scale(d3.scaleLinear, 6)
      .range([0, width])
      .domain([start, end])
      .focus(width / 2);

    const xAxis = d3.axisBottom(linearScale);
    let keyToolTip;
    if (allKeys !== undefined && allKeys["mainKey"] !== undefined) {
      this.thematicBars = allKeys["mainKey"].selectAll(".bar.thematic").data(SortedKey, function(d) {
        return d;
      });
      this.mosTypeBars = allKeys["mainKey"].selectAll(".bar.mos").data(SortedKey, function(d) {
        return d;
      });
      this.mosTypeLines = allKeys["mainKey"].selectAll(".line").data(SortedKey, function(d) {
        return d;
      });

      this.drawBars(this.thematicColourFromData, 0, this.thematicBars, "thematic", linearScale, keyBarHeight, duration);
      this.drawBars(
        this.mosaicColourFromData,
        2 * keyBarHeight,
        this.mosTypeBars,
        "mos",
        linearScale,
        keyBarHeight,
        duration
      );
      this.drawLines(this.mosaicColourFromData, this.mosTypeLines, linearScale, keyBarHeight, duration);

      if (firstRun) {
        allKeys["mainKey"]
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
      } else {
        allKeys["mainKey"]
          .select(".x")
          .transition()
          .duration(duration)
          .call(xAxis);
      }

      keyToolTip = d3
        .select("mat-sidenav-content")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      const getTooltipHtml = d => {
        const mosaic: MosaicCode = this.mosaicCodes.find(x => x.code === d[0]);
        return this.tiphtml(d[0], mosaic);
      };

      allKeys["mainKey"].selectAll("rect").on("mouseover", function(data) {
        keyToolTip
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        keyToolTip
          .html(getTooltipHtml(data))
          .style("left", Math.min(width, d3.event.pageX - 100) + "px")
          .style("top", d3.event.pageY - 50 + "px");
      });

      allKeys["mainKey"].selectAll("rect").on("click", function(d, e) {
        d3.select(this) //@ts-ignore
          .transition()
          .duration(500)
          .style("y", 0)
          .style("height", height);
      });
    }
    function applyAxisScale(scale) {
      allKeys["mainKey"]
        .selectAll(".bar")
        .attr("x", function(d, i) {
          return scale(d[2].start);
        })
        .attr("width", function(d, i) {
          return scale(d[2].end) - scale(d[2].start);
        });

      allKeys["mainKey"]
        .selectAll(".line")
        .attr("x1", function(d, i) {
          return scale(d[1][0]);
        })
        .attr("x2", function(d, i) {
          return scale(d[1][0]);
        });

      xAxis.scale(scale);

      allKeys["mainKey"].select(".x").call(xAxis);
    }
    if (allKeys !== undefined && allKeys["mainKey"] !== undefined) {
      allKeys["mainKey"].on("mousemove", function() {
        xFisheye.focus(Math.min(d3.mouse(this)[0], width));
        applyAxisScale(xFisheye);
      });

      allKeys["mainKey"].on("mouseout", function() {
        if (d3.mouse(this)[0] > width || d3.mouse(this)[0] < 0 || d3.mouse(this)[1] > height || d3.mouse(this)[1] < 0) {
          applyAxisScale(linearScale);
        } else {
          xFisheye.focus(Math.min(d3.mouse(this)[0], width));
          applyAxisScale(xFisheye);
        }

        keyToolTip
          .transition()
          .duration(200)
          .style("z-index", 9999)
          .style("opacity", 0);
      });
    }
  }

  drawBars(colorFunction, ypos, barData, usedClass, linearScale, keyBarHeight, duration) {
    if (barData !== undefined) {
      barData
        .enter()
        .append("rect")
        .attr("class", "bar ".concat(usedClass))
        .attr("x", function(d, i) {
          return linearScale(d[2].start);
        })
        .attr("y", function(d) {
          return ypos;
        })
        .style("fill", function(d) {
          return colorFunction(d);
        })
        .attr("height", function(d) {
          return keyBarHeight;
        })
        .attr("width", function(d, i) {
          return linearScale(d[2].end) - linearScale(d[2].start);
        })
        .merge(barData)
        .transition()
        .duration(duration)
        .attr("x", function(d, i) {
          return linearScale(d[2].start);
        })
        .attr("y", function(d) {
          return ypos;
        })
        .style("fill", function(d) {
          return colorFunction(d);
        })
        .attr("height", function(d) {
          return keyBarHeight;
        })
        .attr("width", function(d, i) {
          return linearScale(d[2].end) - linearScale(d[2].start);
        });

      barData
        .exit()
        .transition()
        .duration(duration)
        .attr("y", function(d) {
          return ypos;
        })
        .style("fill", function(d) {
          return colorFunction(d);
        })
        .attr("width", function(d, i) {
          return linearScale(d[2].end) - linearScale(d[2].start);
        })
        .remove();
    }
  }

  drawLines(colorFunction, lineData, linearScale, keyBarHeight, duration) {
    if (lineData !== undefined) {
      lineData
        .enter()
        .append("line")
        .attr("class", "line")
        .merge(lineData)
        .attr("x1", function(d, i) {
          return linearScale(d[1][0]);
        })
        .attr("y1", function(d, i) {
          return keyBarHeight;
        })
        .attr("x2", function(d, i) {
          return linearScale(d[1][0]);
        })
        .attr("y2", function(d, i) {
          return 2 * keyBarHeight;
        })
        .style("stroke", function(d) {
          return colorFunction(d);
        })
        .attr("stroke-width", 1)
        .merge(lineData)
        .transition()
        .duration(duration)
        .attr("x1", function(d, i) {
          return linearScale(d[1][0]);
        })
        .attr("y1", function(d, i) {
          return keyBarHeight;
        })
        .attr("x2", function(d, i) {
          return linearScale(d[1][0]);
        })
        .attr("y2", function(d, i) {
          return 2 * keyBarHeight;
        })
        .style("stroke", function(d) {
          return colorFunction(d);
        });

      lineData
        .exit()
        .transition()
        .duration(duration)
        .attr("x1", function(d, i) {
          return linearScale(d[1][0]);
        })
        .attr("y1", function(d, i) {
          return keyBarHeight;
        })
        .attr("x2", function(d, i) {
          return linearScale(d[1][0]);
        })
        .attr("y2", function(d, i) {
          return 2 * keyBarHeight;
        })
        .style("stroke", function(d) {
          return colorFunction(d);
        })
        .remove();
    }
  }

  tiphtml(d, mosaic) {
    const usedMosaicType = d;
    let output = "";
    output = "	<div id='mosaicToolTip' class='container d3-tip mosaic-" + usedMosaicType.substr(0, 1) + "'>";
    output += "		<div fxLayout='row wrap'>";
    output += "			<div>";
    output += "<h2>" + usedMosaicType + "</h2>";
    output += "			</div>";
    output += "			<div>";
    output += "<h5>" + mosaic.name + "</h5>";
    output += "			</div>";
    output += "		</div>";
    output += "			<div fxLayout='row wrap'>";
    output += "		<div fxFlex.gt-sm='100' fxFlex.gt-xs='100' fxFlex='100'>";
    output += "<h6>" + mosaic.desc + "</h6>";
    output += "			</div>";
    output += "		</div>";
    output += "			<div fxLayout='row wrap'>";
    output += "		<div fxFlex.gt-sm='100' fxFlex.gt-xs='100' fxFlex='100'>";
    output += '<img alt="image" class="img-container" src="assets/images/mosaic/mosaic_' + usedMosaicType + '.jpg">';
    output += "			</div>";
    output += "		</div>";
    output += "			<div fxLayout='row wrap'>";
    output += "		<div fxFlex.gt-sm='100' fxFlex.gt-xs='100' fxFlex='100'>";
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
    output += "	</div>";

    return output;
  }

  thematicColourFromData(d) {
    const color = d3
      .scaleLinear<string>()
      .domain([0, 0.5, 1])
      .range(["#ffff00", "#31c831", "#003366"])
      .interpolate(d3.interpolateHclLong);
    return color(d[1][1]);
  }

  mosaicColourFromData(d) {
    return MosaicColorCodes.find(x => x.code === d[0].substring(0, 1)).color;
  }
}
