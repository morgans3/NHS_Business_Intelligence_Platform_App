import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";

import { AuthState } from "../_states/auth.state";
import { NotificationService } from "../_services/notification.service";
import { decodeToken } from "../_pipes/functions";
import { APIService } from "diu-component-library";
import { Store } from "@ngxs/store";

@Injectable({
    providedIn: "root",
})
export class CapabilityGuard implements CanActivate {
    constructor(
        private store: Store,
        private apiService: APIService,
        private notificationService: NotificationService
    ) {}

    selectedUser;
    get user() {
        if (this.selectedUser === undefined) {
            const jwtToken = this.store.selectSnapshot(AuthState.getToken);
            this.selectedUser = decodeToken(jwtToken);
        }
        return this.selectedUser;
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        // Store status
        let userAuthorised = true;
        const userCapabilities = this.user.capabilities.map((item) => Object.keys(item)[0]);

        // Get user object
        (route.data["capabilities"] || []).forEach((capability: string) => {
            // Check if capability authorised
            const capabilityAuthorised = userCapabilities.includes(capability);
            userAuthorised = userAuthorised === false ? false : capabilityAuthorised;

            // Record log
            this.apiService.createAccessLog({
                type: `Capability${capabilityAuthorised ? "Authorised" : "Unauthorised"}#${capability}`,
                data: capability,
            });
        });

        if (!userAuthorised) {
            this.notificationService
                .notify({
                    status: "warning",
                    message: "You do not have the required permissions to access this page.",
                    actions: [
                        { id: "close", name: "Close" },
                        { id: "request", name: "Request Permission" },
                    ],
                })
                .then((snackbar) => {
                    snackbar.instance.dismissed.subscribe((action) => {
                        // Check action
                        if (action === "request") {
                            window.open(
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                `${window.location.origin}/profile/access?capabilities=${route.data["capabilities"].join(",")}`
                            );
                        }
                    });
                });
        }

        return userAuthorised;
    }
}
