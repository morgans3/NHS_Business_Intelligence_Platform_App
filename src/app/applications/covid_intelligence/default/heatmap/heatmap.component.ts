import { Component, OnInit } from "@angular/core";
import { ResultsService } from "../../_services/results.service";

@Component({
  selector: "app-heatmap",
  templateUrl: "./heatmap.component.html",
  styleUrls: ["./heatmap.component.scss"],
})
export class HeatmapComponent implements OnInit {
  cfData: any;

  constructor(private resultsService: ResultsService) {}

  ngOnInit() {
    this.getData();
  }
  getData() {
    this.resultsService.getCFServer().subscribe((data: any) => {
      this.cfData = data;
      this.generateCharts();
    });
  }

  generateCharts() {
    // meat of building
  }

  getKeyByValue(value, object) {
    return Object.keys(object).find((key) => {
      return object[key] === value;
    });
  }

  monthDiff(d1ts, d2ts) {
    const d1 = new Date(d1ts);
    const d2 = new Date(d2ts);
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
}
