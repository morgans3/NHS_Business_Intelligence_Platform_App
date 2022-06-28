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
    constructor(private store: Store, private apiService: APIService, private notificationService: NotificationService) {}

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
            this.apiService
                .createAccessLog({
                    type: `Capability${capabilityAuthorised ? "Authorised" : "Unauthorised"}#${capability}`,
                    data: capability,
                })
                .subscribe(() => {});
        });

        if (!userAuthorised) this.notificationService.error("You're unauthorised to access this page!");

        return userAuthorised;
    }
}
