import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-PublisherNotes",
    templateUrl: "./PublisherNotes.component.html",
})
export class PublisherNotesComponent implements OnInit {
    @Input() reportID: string;
    @Input() report: any;

    constructor() {}

    ngOnInit() {}
}
