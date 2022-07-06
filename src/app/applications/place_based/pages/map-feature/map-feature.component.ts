import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MapService } from "../../shared/map.service";

@Component({
    selector: "app-pbi-map-feature",
    templateUrl: "./map-feature.component.html",
})
export class MapFeatureComponent implements OnInit {

    feature;

    constructor(
        private mapService: MapService,
        private router: Router
    ) {}

    ngOnInit() {
        this.mapService.selectedFeature.subscribe((feature) => {
            if(feature) {
                this.feature = feature;
            } else {
                this.router.navigateByUrl("/apps/mapping")
            }
        })
    }
}
