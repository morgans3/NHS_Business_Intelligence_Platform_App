import { CanActivate, Router } from "@angular/router";

import { AuthState } from "../_states/auth.state";
import { Injectable } from "@angular/core";
import { NotificationService } from "../_services/notification.service";
import { Store } from "@ngxs/store";

@Injectable({
    providedIn: "root",
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private notificationService: NotificationService, private store: Store) {}

    canActivate(): boolean {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            return true;
        }
        this.notificationService.error("Unauthorised!  Please login via Nexus Intelligence");
        this.router.navigate(["/login"]);
        return false;
    }
}
