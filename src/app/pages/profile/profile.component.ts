import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as d3 from "d3";
import { Store } from "@ngxs/store";
import { iFullUser, iUserDetails, APIService } from "diu-component-library";
import { AuthState } from "../../_states/auth.state";
import { NotificationService } from "../../_services/notification.service";
import { decodeToken, generateID } from "../../_pipes/functions";
import { MatTabGroup } from "@angular/material/tabs";

interface iToken {
    name: string;
    username: string;
    email: string;
    organisation: string;
    linemanager: string;
    lastactive: Date;
    id: string;
}

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
    @ViewChild("tabs", { static: true }) tabs: MatTabGroup;
    fulluser: iFullUser;
    userDecodedToken: iToken;

    constructor(
        public store: Store,
        private usergroupService: APIService,
        private notificationService: NotificationService,
        private route: ActivatedRoute
    ) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.userDecodedToken = decodeToken(token) as iToken;
        }
    }

    ngOnInit() {
        // Remove tooltip
        const tooltip_remove = d3.select("mat-sidenav-content").selectAll(".tooltip");
        tooltip_remove.remove();

        // Set active tab
        this.route.params.subscribe((params) => {
            this.tabs.selectedIndex = ["details", "teams", "access"].indexOf(params.tab);
        });

        // Get user
        this.getData();
    }

    getData() {
        if (this.userDecodedToken && this.userDecodedToken.username) {
            this.usergroupService
                .getUserProfileByUsernameAndOrganisation(`${this.userDecodedToken.username}#${this.userDecodedToken.organisation}`)
                .subscribe((res: any) => {
                    if (res.success === false) {
                        this.notificationService.warning("Unable to locate your profile, we will create a profile for you shortly.");
                        const newProfile: iUserDetails = {
                            id: generateID(),
                            username: this.userDecodedToken.username,
                        };
                        this.usergroupService.addUserProfile(newProfile).subscribe((response: any) => {
                            if (response.success === false) {
                                this.notificationService.error("Unable to create a profile, please contact your system administrator.");
                                return;
                            }
                            this.fulluser = {
                                name: this.userDecodedToken.name,
                                username: this.userDecodedToken.username,
                                email: this.userDecodedToken.email,
                                organisation: this.userDecodedToken.organisation,
                                linemanager: this.userDecodedToken.linemanager,
                                lastactive: new Date(),
                                id: response.id,
                            };
                            this.notificationService.success("Profile added");
                        });
                    } else {
                        if (res.linemanager) {
                            this.fulluser = res;
                        } else {
                            this.fulluser = {
                                name: this.userDecodedToken.name,
                                username: this.userDecodedToken.username,
                                email: this.userDecodedToken.email,
                                organisation: this.userDecodedToken.organisation,
                                linemanager: this.userDecodedToken.linemanager,
                                lastactive: new Date(),
                                id: res.id,
                                photobase64: res.photobase64,
                                contactnumber: res.contactnumber,
                                preferredcontactmethod: res.preferredcontactmethod,
                                emailpreference: res.emailpreference,
                                impreference: res.impreference,
                            };
                        }
                    }
                });
        }
    }
}
