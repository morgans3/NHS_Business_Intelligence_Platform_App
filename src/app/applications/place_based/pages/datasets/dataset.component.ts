import { Component, OnInit } from "@angular/core";
import { DatasetService } from "../../shared/dataset.service";
import { MapService } from "../../shared/map.service";

@Component({
    selector: "app-pbi-dataset",
    templateUrl: "./dataset.component.html",
})
export class DatasetComponent implements OnInit {

    datasets = [];
    selected = [];

    constructor(
        private mapService: MapService,
        private datasetService: DatasetService
    ) {}

    ngOnInit() {
        // Listen for datasets
        this.datasetService.datasets.subscribe((datasets) => {
            this.datasets = datasets;
        });

        // Listen for map index change
        this.mapService.selectedMapIndex.subscribe((index) => {
            console.log(this.mapService.maps, index);
            this.selected = this.mapService.maps[index]?.layers.map((map) => map.id)
        });
    }

    select($event) {
        const selectedDataset = this.datasets.find((dataset) => dataset.id === $event.option.value);
        if($event.option.selected) {
            this.mapService.addDataset(selectedDataset);
        } else {
            this.mapService.removeDataset(selectedDataset);
        }
    }

    uploadDatasetFile(event) {
        if (event.target.files[0]) {
            this.datasetService.add("xlsx", event.target.files[0]);
        }
    }
}
