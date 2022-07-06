import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { MapService } from "./shared/map.service";

@Component({
    selector: "app-pbi-default",
    templateUrl: "./default.component.html",
    styleUrls: ["./default.component.scss"]
})
export class DefaultComponent implements OnInit {
    map1Instance;
    @ViewChild("map1") set map1(map1: ElementRef) {
        if (map1) {
            this.map1Instance = this.mapService.createMap(map1.nativeElement);
        }
    }

    map2Instance; showMap2 = false;
    @ViewChild("map2") set map2(map2: ElementRef) {
        if (map2) {
            this.map2Instance = this.mapService.createMap(map2.nativeElement);
        }
    }

    selectedMapIndex = 0;

    constructor(
        public mapService: MapService
    ) {}

    ngOnInit() {
        // Listen for selected map change
        this.mapService.selectedMapIndex.subscribe((index) => {
            this.selectedMapIndex = index;
            console.log(index);
        })
    }

    selectMap(index) {
        this.mapService.selectedMapIndex.next(index);
    }
}
