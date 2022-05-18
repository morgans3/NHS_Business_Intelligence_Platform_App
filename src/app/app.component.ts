import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter, map, mergeMap } from "rxjs/operators";

declare function cwr(operation: string, payload: any): void;

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        // Listen and get all route data
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this.activatedRoute),
                map((route) => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                }),
                mergeMap((route) => route.data)
            )
            .subscribe((routeData) => {
                const awsTrackable = routeData["awsTrackable"] || null;
                console.log(awsTrackable, routeData);
                if (awsTrackable && awsTrackable === true) {
                    cwr("recordPageView", this.router.url);
                    console.log("Page view recorded");
                }
            });
    }
}
