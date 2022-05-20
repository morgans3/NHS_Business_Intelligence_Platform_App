import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-ReportSettings",
    templateUrl: "./ReportSettings.component.html",
})
export class ReportSettingsComponent implements OnInit {
    @Input() reportID: string;
    @Input() report: any;
    @Input() teamcode?: string;

    constructor() {}

    ngOnInit() {}
}
