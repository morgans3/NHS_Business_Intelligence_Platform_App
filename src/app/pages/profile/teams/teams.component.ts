import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { Store } from "@ngxs/store";
import { MatDialog } from "@angular/material/dialog";

import { iTeam, iTeamMembers, iOrganisation, iTeamRequest, iFullUser } from "diu-component-library";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../_services/notification.service";
import { AuthState, ManualSetAuthTokens } from "../../../_states/auth.state";
import { ReferenceState } from "../../../_states/reference.state";
import { decodeToken } from "../../../_pipes/functions";

@Component({
    selector: "app-profile-teams-tab",
    templateUrl: "./teams.component.html",
})
export class ProfileTeamsComponent implements OnInit {
    @Input() user: iFullUser;
    joinTeamForm = new FormGroup({
        team: new FormControl(null),
    });

    teams: { all: iTeam[]; filtered: iTeam[] } = { all: [], filtered: [] };
    myTeamMemberships: iTeamMembers[] = [];
    myTeamRequests: iTeamRequest[] = [];
    myTeams: iTeam[] = [];

    organisations: iOrganisation[] = [];

    constructor(
        private apiService: APIService,
        private notificationService: NotificationService,
        public dialog: MatDialog,
        public store: Store
    ) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            const decodedToken = decodeToken(token) as any;
            this.myTeamMemberships = decodedToken.memberships;
        }
    }

    ngOnInit() {
        if (this.user) {
            this.getTeams();
        }
        this.getOrganisations();

        this.joinTeamForm.controls.team.valueChanges.subscribe((value: string) => {
            if (typeof value === "string") {
                this.teams.filtered = this.teams.all.filter(
                    (x: iTeam) => x.name.toLowerCase().includes(value.toLowerCase()) && !this.inTeam(x.code)
                );
            }
        });
    }

    getTeams() {
        this.myTeams = [];
        this.store.select(ReferenceState.getTeams).subscribe((res: iTeam[]) => {
            this.teams = { all: res, filtered: res };
            if (this.myTeamMemberships) {
                const myTeamCodes = this.myTeamMemberships.map((membership) => membership.teamcode);
                this.myTeams = res.filter((team) => myTeamCodes.includes(team.code));

                this.apiService.getTeamRequestsByUsername(this.user.username).subscribe((res: iTeamRequest[]) => {
                    this.myTeamRequests = res.map((teamRequest: any) => {
                        const teamDetails = this.teams.all.find((team) => teamRequest.teamcode === team.code);
                        teamRequest.organisationcode = teamDetails?.organisationcode || "";
                        teamRequest.teamname = teamDetails?.name || "";
                        if (this.myTeams.filter((x) => x.code === teamRequest.teamcode).length > 0) teamRequest.inTeam = true;
                        else {
                            teamRequest.refusedate ? (teamRequest.inTeam = true) : (teamRequest.inTeam = false);
                        }
                        return teamRequest;
                    });
                });
            }
        });
    }

    cancelRequest(teamRequest: any) {
        this.notificationService.question("Are you sure you want to withdraw this request?").then((confirmed) => {
            if (confirmed === true) {
                this.apiService.archiveTeamRequest(teamRequest).subscribe((res: any) => {
                    if (res.success) {
                        this.notificationService.success("This request has been withdrawn");
                        this.getTeams();
                    } else {
                        this.notificationService.warning(res.msg);
                    }
                });
            }
        });
    }

    inTeam(teamcode: string) {
        const x = this.myTeams.find((y) => y.code === teamcode);
        if (x) {
            return true;
        }

        const y = this.myTeamRequests.find((s) => s.teamcode === teamcode);
        if (y) {
            return true;
        }

        return false;
    }

    getTeamName(team: iTeam): string {
        return team && team.name ? team.name : "";
    }

    joinTeam() {
        const team = this.joinTeamForm.value.team;
        if (team) {
            this.apiService.getUserProfileByUsernameAndOrganisation(team.responsiblepeople[0]).subscribe((resAdminProfile: any) => {
                if (resAdminProfile.success === false) {
                    this.notificationService.warning(
                        "Unable to locate administrator of team. Please contact the administrator directly to gain access to the team."
                    );
                } else {
                    this.apiService
                        .addTeamRequest({
                            username: this.user.username,
                            organisation: this.user.organisation,
                            teamcode: team.code,
                            requestdate: new Date(),
                            requestor: this.user.email,
                            emailto: resAdminProfile.email,
                        })
                        .subscribe((res: any) => {
                            if (res.success) {
                                this.notificationService.success("A request has been sent to the Team Administrator to grant you access.");
                                this.getOrganisations();
                                this.getTeams();
                            } else {
                                this.notificationService.warning(res.msg);
                            }
                        });
                }
            });
        } else {
            this.notificationService.warning("No team selected.");
        }
    }

    leaveTeam(team: iTeam) {
        this.notificationService.question("Are you sure you want to leave this team?").then((confirmed) => {
            if (confirmed === true) {
                const membership: iTeamMembers | any = this.myTeamMemberships.filter((x) => x.teamcode === team.code);
                if (membership.length > 0) {
                    const team = membership[0];
                    this.apiService.removeTeamMember(team).subscribe((res: any) => {
                        if (res.success) {
                            this.notificationService.success("You have now left this Team");
                            this.apiService.refreshAuthenticatedUser().subscribe((data: { token: string }) => {
                                if (data.token) {
                                    this.store.dispatch(
                                        new ManualSetAuthTokens({
                                            success: true,
                                            token: data.token,
                                        })
                                    );
                                    this.getTeams();
                                } else {
                                    this.notificationService.error("Could not authenticate you as as a user");
                                }
                            });
                        } else {
                            this.notificationService.warning(res.msg);
                        }
                    });
                }
            }
        });
    }

    getOrganisations() {
        this.store.select(ReferenceState.getOrganisations).subscribe((res: iOrganisation[]) => {
            this.organisations = res;
        });
    }

    getOrganisationName(orgcode: string) {
        const organisation = this.organisations.find((y) => y.code === orgcode);
        return organisation ? organisation.name : "";
    }
}
