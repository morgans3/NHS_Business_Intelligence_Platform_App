import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-savingViews",
    templateUrl: "./savingViews.component.html",
    styleUrls: ["./savingViews.component.scss"],
})
export class SavingViewsComponent implements OnInit {
    @Input() isTeam: boolean;
    myViews = ["Grange Park"];
    teamViews = ["Our Neighbourhood", "CCG PCN Comp", "PCN Property & Crime"];

    constructor() {}

    ngOnInit() {}
}
