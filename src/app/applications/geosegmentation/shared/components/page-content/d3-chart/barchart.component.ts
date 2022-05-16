import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  HostListener,
  ElementRef
} from "@angular/core";
import * as d3 from "d3";
import { Chart, BarChart } from "../../_models/chart";

@Component({
  selector: "app-d3barchart",
  template: `
    <mat-card>
      <mat-card-content #parent class="chartspace">
        <mat-card-title *ngIf="chart && chart.title">{{
          chart.title
        }}</mat-card-title>
        <div
          *ngIf="chart && chart.type"
          [id]="chart.name"
          (window:resize)="onResize($event)"
        ></div>
      </mat-card-content>
    </mat-card>
  `,
  styles: []
})
export class BarChartComponent implements OnChanges {
  @ViewChild("parent") parentContainer: ElementRef;

  @Input() chart?: BarChart;
  @Input() myDC?: any;
  myChart: any;

  @HostListener("window:pageshow", ["$event"])
  pageLoaded(event: any) {
    this.initChart();
  }

  constructor() {}

  ngOnChanges(): void {
    if (this.chart) {
      this.initChart();
    }
  }

  initChart() {
    if (this.chart !== undefined && this.chart.type !== undefined) {
      this.myChart = this.myDC.barChart("#" + this.chart.name);
      this.createChart();
    }
  }

  createChart() {
    this.myChart
      .dimension(this.chart.dim)
      .group(this.chart.group)
      .margins({
        top: 20,
        right: 10,
        bottom: 30,
        left: 40
      });

    if (this.parentContainer.nativeElement.clientHeight) {
      this.myChart.height(this.parentContainer.nativeElement.clientHeight - 50);
    }
    if (this.parentContainer.nativeElement.clientWidth) {
      this.myChart.width(this.parentContainer.nativeElement.clientWidth - 30);
    }

    if (this.chart.renderLabel) {
      this.myChart.renderLabel(this.chart.renderLabel);
    }
    if (this.chart.colours) {
      this.myChart.ordinalColors(this.chart.colours);
    }
    if (this.chart.xUnits) {
      switch (this.chart.xUnits) {
        case "ordinal":
          this.myChart.xUnits(this.myDC.units.ordinal);
          break;
        default:
          // number
          this.myChart.xUnits(function(xUnits) {
            return xUnits;
          });
      }
    }
    if (this.chart.elasticY) {
      this.myChart.elasticY(this.chart.elasticY);
    }
    if (this.chart.elasticX) {
      this.myChart.elasticX(this.chart.elasticX);
    }
    if (this.chart.round) {
      this.myChart.round(this.myDC.round.floor);
    }
    if (this.chart.alwaysUseRounding) {
      this.myChart.alwaysUseRounding(this.chart.alwaysUseRounding);
    }
    if (this.chart.x) {
      switch (this.chart.x) {
        case "dim":
          this.myChart.x(d3.scaleOrdinal().domain(this.chart.dim));
          break;
        default:
          // scaleLinear
          this.myChart.x(d3.scaleLinear().domain([0, 100]));
          break;
      }
    } else {
      this.myChart.x(d3.scaleBand().domain(this.chart.dim));
    }
    if (this.chart.xAxisTicks) {
      this.myChart.xAxis().ticks(this.chart.xAxisTicks);
    }
    if (this.chart.xAxisTickFormat) {
      switch (this.chart.xAxisTickFormat) {
        case "prcnt":
          this.myChart.xAxis().tickFormat(function(v) {
            return v + "%"; // can't pass this as a string so have to pass prcnt instead and do the switch-case
          });
          break;
        default:
          this.myChart.xAxis().tickFormat(function(v) {
            return v + "";
          });
          break;
      }
    }
    if (this.chart.yAxisTicks) {
      this.myChart.yAxis().ticks(this.chart.yAxisTicks);
    }
    if (this.chart.yAxisTickFormat) {
      switch (this.chart.xAxisTickFormat) {
        default:
          this.myChart
            .yAxis()
            .tickFormat(d3.format(this.chart.yAxisTickFormat));
          break;
      }
    }

    if (this.chart.gap) {
      this.myChart.gap(this.chart.gap);
    }
    if (this.chart.renderHorizontalGridLines) {
      this.myChart.renderHorizontalGridLines(
        this.chart.renderHorizontalGridLines
      );
    }
    if (this.chart.ordering) {
      switch (this.chart.ordering) {
        case "descValue":
          this.myChart.ordering(function(d) {
            return -d.value;
          });
          break;
        default:
          this.myChart.ordering(function(d) {
            return String(d.key);
          });
          break;
      }
    }

    if (this.chart.ordinalColors) {
      this.myChart.ordinalColors(this.chart.ordinalColors);
    }
    if (this.chart.colorDomain) {
      this.myChart.colorDomain(this.chart.colorDomain);
    }
    if (this.chart.colorAccessor) {
      this.myChart.colorAccessor(function(d) {
        return d.key.substr(0, 1);
      });
    }

    this.myChart.render();
  }

  onResize() {
    this.initChart();
  }
}
