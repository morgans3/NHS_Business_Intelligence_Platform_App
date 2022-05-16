import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  HostListener,
  ElementRef
} from "@angular/core";
import * as d3 from "d3";
import { Chart, PieChart } from "../../_models/chart";

@Component({
  selector: "app-d3piechart",
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
export class PieChartComponent implements OnChanges {
  @ViewChild("parent") parentContainer: ElementRef;

  @Input() chart?: PieChart;
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
      this.myChart = this.myDC.pieChart("#" + this.chart.name);
      this.myChart.controlsUseVisibility(true);
      this.createChart();
    }
  }

  createChart() {
    this.myChart.dimension(this.chart.dim).group(this.chart.group);

    if (this.parentContainer.nativeElement.clientHeight) {
      const width = Math.floor(
        this.parentContainer.nativeElement.clientWidth * 0.8
      );
      const height = this.parentContainer.nativeElement.clientHeight - 75;

      if (width < height) {
        this.myChart.height(width);
        this.myChart.width(width);
      } else {
        this.myChart.height(height);
        this.myChart.width(height);
      }
    }

    if (this.chart.colours) {
      this.myChart.ordinalColors(this.chart.colours);
    }

    this.myChart.render();
  }

  onResize() {
    this.initChart();
  }
}
