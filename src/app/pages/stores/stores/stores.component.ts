import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { APIService } from "diu-component-library";

@Component({
    selector: "app-stores",
    templateUrl: "./stores.component.html",
})
export class StoresComponent implements OnInit {
    context = "apps";
    storeConfig: any;

    constructor(private router: Router, private apiService: APIService) {
        this.context = this.router.url.replace("/", "");
    }

    ngOnInit() {
        this.apiService.getPayloadById(this.switchFromPathToDBID(this.context)).subscribe((payload: any) => {
            if (payload) {
                this.storeConfig = payload.config;
            }
        });
    }

    modify(config: any) {
        try {
            return JSON.parse(config);
        } catch {
            return config;
        }
    }

    switchFromPathToDBID(path: string) {
        switch (path) {
            case "dashboardstore":
                return "dashboard_store";
                break;
            default:
                return "app_store";
                break;
        }
    }
}
