import { Component, OnInit, Input } from "@angular/core";
import { simpleFadeAnimation } from "../../../../../shared/animations";
import { CategoryBreakdown } from "../../../_models/categorybreakdown";
import { JoyrideService } from "ngx-joyride";

@Component({
    selector: "app-MosaicProfile",
    templateUrl: "./MosaicProfile.component.html",
    animations: [simpleFadeAnimation],
})
export class MosaicProfileComponent implements OnInit {
    @Input() giTable: CategoryBreakdown[];
    @Input() thisCohort: string;
    filtered: CategoryBreakdown[];
    displayedTable: CategoryBreakdown[];

    constructor(private readonly joyrideService: JoyrideService) {}

    ngOnInit() {
        this.resetCat();
    }

    showGuide() {
        this.joyrideService.startTour({
            steps: ["gsiprofile1", "gsiprofile2", "gsiprofile3"],
        });
    }

    filterCat(category: CategoryBreakdown) {
        this.displayedTable = [category];
    }

    resetCat() {
        this.displayedTable = [this.giTable[0]];
    }
}
