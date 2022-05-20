import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-emishighlights",
    templateUrl: "./emishighlights.component.html",
})
export class EmishighlightsComponent implements OnInit {
    @Input() nhsnumber: string;
    constructor() {}

    ngOnInit() {}
}
