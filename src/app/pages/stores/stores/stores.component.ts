import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Store } from "@ngxs/store";
import { ManualSetAuthTokens, AuthState } from "../../../_states/auth.state";
import { APIService, iApplication, iInstallation } from "diu-component-library";
import { NotificationService } from "../../../_services/notification.service";
import { decodeToken } from "src/app/_pipes/functions";

export interface iAppContainer {
    app: iApplication;
    install?: iInstallation;
    teaminstall?: boolean;
}

@Component({
    selector: "app-appstore",
    templateUrl: "./stores.component.html",
})
export class StoresComponent implements OnInit {
    // Dynamic config
    config = { storeEndpoint: "" };

    // Page vars
    user: any;
    apps = { installed: [], uninstalled: [] }

    constructor(
        private notificationService: NotificationService,
        private apiService: APIService,
        private store: Store,
        private router: Router,
    ) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) { this.user = decodeToken(token); }
    }

    ngOnInit() {
        // Set component config
        const configMap = { apps: "app_store", dashboardstore: "dashboard_store" };
        this.apiService.getPayloadById(configMap[this.router.url.replace("/", "")]).subscribe((payload: any) => {
            // Set config
            if (payload) {
                this.config.storeEndpoint = JSON.parse(payload.config).getAllStoreEndpoint;
            }

            // Load all apps
            this.getApps();
        });
    }

    getApps() {
        this.apiService.genericGetAPICall(this.config.storeEndpoint).subscribe((apps: iApplication[]) => {
            const userCapabilities = this.user.capabilities.map((cap) => Object.keys(cap)[0]);
            this.apps = {
                installed: apps.filter((app) => {
                    return userCapabilities.includes(app.name)
                }),
                uninstalled: apps.filter((app) => {
                    return !userCapabilities.includes(app.name)
                })
            }
        });
    }

    appChanged($event) {
        // Uninstall/Install
        if($event.action === "installed") {
            this.apps.installed.push($event.app);
            this.apps.uninstalled.splice(
                this.apps.uninstalled.findIndex((app) => app.name === $event.app.name), 1
            );
        } else {
            this.apps.uninstalled.push($event.app);
            this.apps.installed.splice(
                this.apps.installed.findIndex((app) => app.name === $event.app.name), 1
            );
        }

        // Refresh auth with new capability
        this.apiService.refreshAuthenticatedUser().subscribe((data: { token: string; }) => {
            if(data.token) {
                this.store.dispatch(
                    new ManualSetAuthTokens({
                        success: true,
                        token: data.token,
                    })
                );
            } else {
                this.notificationService.error("Could not authenticate you as as a user");
            }
        })
    }
}