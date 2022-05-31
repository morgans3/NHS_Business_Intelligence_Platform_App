import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { filter, map, mergeMap } from "rxjs/operators";
import { NotificationService } from "./_services/notification.service";

declare function cwr(operation: string, payload: any): void;

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public notificationService: NotificationService
    ) {}

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
                // TODO: review need for console logs
                const awsTrackable = routeData["awsTrackable"] || null;
                if (awsTrackable && awsTrackable === true) {
                    cwr("recordPageView", this.router.url);
                    console.log("Page view recorded");
                }
            });

        // Expose notification api
        window["notify"] = ({ message, actions = null, status = null }) => {
            this.notificationService.notify({ message, actions, status })
        };
    }
}
