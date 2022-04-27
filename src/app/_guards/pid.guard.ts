import { CanActivate } from "@angular/router";
import { AuthState } from "../_states/auth.state";
import { Injectable } from "@angular/core";
import { Store } from "@ngxs/store";
import { NotificationService } from "../_services/notification.service";
import { decodeToken } from "../_pipes/functions";

@Injectable({
  providedIn: "root",
})
export class PidGuard implements CanActivate {

    _user;
    get user() {
        if(this._user == undefined) {
            const jwtToken = this.store.selectSnapshot(AuthState.getToken);
            this._user = decodeToken(jwtToken);
        }
        return this._user;
    }

    constructor(
        private notificationService: NotificationService,
        private store: Store
    ) { }

    canActivate(): boolean {
        if(this.user.mfa) { 
            return true; 
        } else {
            this.notificationService.error("Unauthorised!  Please provide a second factor of authentication to proceed to Sensitive Information.");
            return false;    
        }
    }
}