import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-covid-landing",
    templateUrl: "./Landing.component.html",
    styleUrls: ["./Landing.component.scss"],
})
export class LandingComponent implements OnInit {
    categories: any = [];
    constructor() {}

    ngOnInit() {}
}
