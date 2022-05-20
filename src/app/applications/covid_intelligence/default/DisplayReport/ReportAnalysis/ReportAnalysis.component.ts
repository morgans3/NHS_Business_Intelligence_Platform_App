import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-ReportAnalysis",
    templateUrl: "./ReportAnalysis.component.html",
})
export class ReportAnalysisComponent implements OnInit {
    @Input() reportID: string;
    @Input() report: any;

    constructor() {}

    ngOnInit() {}
}
