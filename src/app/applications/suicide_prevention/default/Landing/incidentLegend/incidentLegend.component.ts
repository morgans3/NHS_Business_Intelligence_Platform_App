import { Component, Input, OnChanges } from "@angular/core";
import { CategoryColors } from "./colorlist";

export interface Legend {
    displayName: string;
    marker: string;
    total: number;
}

@Component({
    selector: "app-spi-incidentLegend",
    templateUrl: "./incidentLegend.component.html",
})
export class IncidentLegendComponent implements OnChanges {
    @Input() input: any[];
    legend: Legend[] = [];
    lastchecked: any[] = [];

    constructor() {}

    ngOnChanges() {
        if (this.input && this.input !== this.lastchecked) {
            this.updateLegend();
            this.lastchecked = this.input;
        }
    }

    updateLegend() {
        this.legend = [];
        this.input.forEach((elem) => {
            if (elem.marker) {
                const newLegendItem = {
                    displayName: elem.displayName,
                    total: elem.total,
                    marker: elem.marker,
                };
                this.legend.push(newLegendItem);
            } else {
                const marker = CategoryColors.find((x) => x.displayName === elem.displayName);
                if (marker) {
                    const newLegendItem = {
                        displayName: marker.displayName,
                        total: elem.total,
                        marker: marker.color,
                    };
                    this.legend.push(newLegendItem);
                }
            }
        });
        this.legend.sort((a, b) => b.total - a.total);
    }
}
