import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { PatientLinked } from "diu-component-library";

interface Difference {
    name: string;
    value1: string;
    value2: string;
    dataset1: string;
    dataset2: string;
}

@Component({
    selector: "app-datasetdifferences",
    templateUrl: "./datasetdifferences.component.html",
    styleUrls: ["./datasetdifferences.component.scss"],
})
export class DatasetdifferencesComponent implements OnInit, OnChanges {
    @Input() setperson: PatientLinked;
    person: PatientLinked;
    differences: Difference[];
    constructor() {}

    ngOnInit() {}

    ngOnChanges() {
        if (this.setperson) {
            if (this.person !== this.setperson) {
                this.person = this.setperson;
                this.differences = [];
                this.checkDifferences();
            }
        }
    }

    checkDifferences() {
        const fields = Object.keys(this.person);
        fields.forEach((f) => {
            if (!f.includes("etl_run_date")) {
                if (this.person["d_" + f]) {
                    let value1 = this.person[f] || "";
                    let value2 = this.person["d_" + f] || "";
                    if (value1.toString().includes("T00:00:00.000Z")) {
                        value1 = value1.replace("T00:00:00.000Z", "");
                    }
                    if (value2.toString().includes("T00:00:00.000Z")) {
                        value2 = value2.replace("T00:00:00.000Z", "");
                    }
                    if (value1.toString().toLowerCase() !== value2.toString().toLowerCase()) {
                        if (value1.includes("_")) {
                            value1 = value1.split("_").join(" ");
                        }
                        if (value2.includes("_")) {
                            value2 = value2.split("_").join(" ");
                        }
                        this.differences.push({
                            name: f.split("_").join(" "),
                            value1,
                            value2,
                            dataset1: "CSU",
                            dataset2: "District",
                        });
                    }
                }
            }
        });
    }
}
