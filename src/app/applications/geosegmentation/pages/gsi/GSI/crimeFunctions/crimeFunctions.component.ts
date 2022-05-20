import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Crime } from "../../../../_models/police";

@Component({
    selector: "app-crimeFunctions",
    templateUrl: "./crimeFunctions.component.html",
})
export class CrimeFunctionsComponent implements OnInit {
    @Input() Crimes?: Crime[];
    @Output() filteredLayer = new EventEmitter();

    constructor() {}

    ngOnInit() {}
}
