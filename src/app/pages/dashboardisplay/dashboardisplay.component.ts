import { Component, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { NavigationEnd, Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Component({
    selector: "app-dashboardisplay",
    templateUrl: "./dashboardisplay.component.html",
})
export class DashboardisplayComponent implements OnInit {
    safeURL: SafeResourceUrl;
    selectedDashboard: string;
    constructor(private sanitizer: DomSanitizer, private router: Router) {
        this.router.events.subscribe((ev) => {
            if (ev instanceof NavigationEnd) {
                this.changeDashboard();
            }
        });
    }

    ngOnInit() {
        this.changeDashboard();
    }

    changeDashboard() {
        const parsedUrl = window.location.href;
        let url = parsedUrl.split("/").slice(-1).pop();
        if (url.includes("dashboardstore")) {
            this.selectedDashboard = null;
            return;
        }
        const shinyserver = this.combineURL(parsedUrl, "shiny.");
        url = shinyserver + url;
        this.selectedDashboard = url;
        this.updateLink(url);
    }

    private combineURL(origin: string, subd: string) {
        const domain = origin.split("//")[1].split("/")[0].replace("www", "");
        if (domain.includes("localhost")) {
            return "https://" + subd + environment.websiteURL + "/";
        } else if (domain.includes("dev") || domain.includes("demo")) {
            return "https://" + subd + domain + "/";
        }
        return "https://" + subd + domain + "/";
    }

    updateLink(newlink) {
        this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(newlink);
    }
}
