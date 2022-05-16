import { Component, Input, OnChanges } from "@angular/core";
import { Crime } from "../../../../_models/police";
import { CrimeCategoryColors } from "../colorlists";

export interface Legend {
  displayName: string;
  crimeURL: string[];
  crimeNames: string[];
  total: number;
  marker: string;
}

@Component({
  selector: "app-crimeLegend",
  templateUrl: "./crimeLegend.component.html",
  styleUrls: ["./crimeLegend.component.scss"]
})
export class CrimeLegendComponent implements OnChanges {
  @Input() Crimes: Crime[];
  @Input() CrimeCategories: any;
  legend: Legend[] = [];
  lastchecked: Crime[] = [];

  constructor() {}

  ngOnChanges() {
    if (this.Crimes && this.Crimes !== this.lastchecked) {
      this.updateLegend();
      this.lastchecked = this.Crimes;
    }
  }

  updateLegend() {
    this.legend = [];
    this.Crimes.forEach(crime => {
      const marker = CrimeCategoryColors.find(x => x.url === crime.category);
      if (marker) {
        const existing = this.legend.find(y => y.marker === marker.color);
        if (existing) {
          if (existing.crimeURL.indexOf(crime.category) < 0) {
            existing.crimeURL.push(crime.category);
            existing.crimeNames.push(
              this.CrimeCategories.find(x => x.url === crime.category).name
            );
          }
          existing.total += 1;
        } else {
          const newLegendItem = {
            displayName: marker.displayName,
            crimeURL: [crime.category],
            crimeNames: [
              this.CrimeCategories.find(x => x.url === crime.category).name
            ],
            total: 1,
            marker: marker.color
          };
          this.legend.push(newLegendItem);
        }
      }
    });
    this.legend.sort((a, b) => b.total - a.total);
  }
}
