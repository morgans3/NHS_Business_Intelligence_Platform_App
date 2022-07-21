import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { DatasetService } from "../../shared/dataset.service";
import { MapService } from "../../shared/map.service";

@Component({
    selector: "app-pbi-filter",
    templateUrl: "./filter.component.html",
    styleUrls: ["./filter.component.scss"]
})
export class FilterComponent implements OnInit {

    datasets = {};
    form: FormGroup = new FormGroup({
        filters: new FormArray([])
    });

    constructor(
        private mapService: MapService,
        private datasetService: DatasetService
    ) { }

    ngOnInit() {
        this.datasetService.datasets.subscribe((datasets) => {
            this.datasets = datasets.reduce((acc, dataset) => {
                acc[dataset.id] = dataset;
                return acc;
            }, {});
        });
    }

    add() {
        console.log(this.form);
        (this.form.get("filters") as FormArray).push(
            new FormGroup({
                dataset: new FormControl(null),
                field: new FormControl(null),
                fieldValue: new FormControl(null)
            })
        );
    }
}
