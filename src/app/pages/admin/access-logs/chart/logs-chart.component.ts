import { Component, OnInit, ViewChild } from "@angular/core";
import { APIService } from "diu-component-library";
import * as moment from "moment";
import { Chart } from "chart.js";

@Component({
  selector: "access-logs-chart",
  templateUrl: "./logs-chart.component.html",
})
export class AccessLogsChartComponent implements OnInit {
  @ViewChild("chartElement") chartElement;
  chart;
  date = { from: moment().add(-3, "day"), to: moment().add(3, "day") };

  constructor(private apiService: APIService) {}

  ngOnInit() {}

  ngAfterViewInit() {
    //Create chart
    this.chart = new Chart(this.chartElement.nativeElement, {
      type: "line",
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    //Get initial stats
    this.getStatistics();
  }

  getStatistics() {
    //Random colour list
    let colors = [
      "rgb(39, 32, 93)",
      "rgb(52, 34, 98)",
      "rgb(64, 36, 103)",
      "rgb(76, 37, 107)",
      "rgb(88, 38, 110)",
      "rgb(100, 39, 113)",
      "rgb(112, 40, 116)",
      "rgb(124, 41, 118)",
      "rgb(136, 42, 120)",
      "rgb(148, 43, 121)",
      "rgb(159, 44, 122)",
      "rgb(171, 45, 122)",
      "rgb(182, 47, 122)",
      "rgb(193, 49, 121)",
      "rgb(204, 51, 120)",
      "rgb(214, 55, 118)",
      "rgb(224, 59, 116)",
      "rgb(234, 63, 114)",
      "rgb(243, 69, 111)",
      "rgb(252, 75, 108)",
    ];

    //Get stats
    this.apiService.getAllAccessLogsStatistics(
      this.date.from.format('YYYY-MM-DD'),
      this.date.to.format('YYYY-MM-DD'),
    ).subscribe((statistics: any) => {
        //Update chart data
        this.chart.data.labels = statistics.periods;
        this.chart.data.datasets = statistics.data.map((type) => {
            return {
                fill: false,
                tension: 0.1,
                label: type.name,
                data: type.statistics,
                borderColor: colors[Math.floor(Math.random() * 19)],
            }
        });
        this.chart.update();
    });
  }
}
