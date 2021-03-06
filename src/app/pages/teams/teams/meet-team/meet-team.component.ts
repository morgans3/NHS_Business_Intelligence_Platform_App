import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngxs/store";
import { AuthState } from "../../../../_states/auth.state";
import { UpdateTeams } from "../../../../_states/reference.state";
import { NotificationService } from "../../../../_services/notification.service";
import { decodeToken } from "../../../../_pipes/functions";
import { APIService, UserSearchDialogComponent } from "diu-component-library";
import { iFullUser, iTeam, iTeamRequest, iTeamMembers } from "diu-component-library";

@Component({
    selector: "app-meet-team",
    templateUrl: "./meet-team.component.html",
    styleUrls: ["./meet-team.component.scss"],
})
export class MeetTeamComponent implements OnInit, OnChanges {
    @Input() team: iTeam;
    selectedTeam: iTeam;
    isAdmin = false;
    outstanding: iFullUser[] = [];
    admins: iFullUser[] = [];
    members: iFullUser[] = [];
    invitees: iFullUser[] = [];
    tokenDecoded: any;
    teamrequests: iTeamRequest[] = [];
    teammembers: iTeamMembers[] = [];
    TeamMember = false;
    adminProfile: any;
    membersProfile: any;
    invitesProfile: any;
    requestsProfile: any;

    constructor(
        public store: Store,
        private apiService: APIService,
        private notificationService: NotificationService,
        public dialog: MatDialog
    ) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
        }
    }

    ngOnInit() {
        if (this.team !== this.selectedTeam) {
            this.selectedTeam = this.team;
            this.getPeople();
            this.setConfig();
        }
    }

    ngOnChanges() {
        if (this.team !== this.selectedTeam) {
            this.selectedTeam = this.team;
            this.getPeople();
            this.setConfig();
        }
    }

    setConfig() {
        this.adminProfile = {
            profiles: this.admins,
            isAdmin: this.isAdmin,
            blnShowRemoveAdminButton: true,
        };
        this.membersProfile = {
            profiles: this.members,
            isAdmin: this.isAdmin,
            blnShowAdminButton: true,
            blnShowRemoveFromTeamButton: true,
        };
        this.invitesProfile = {
            profiles: this.invitees,
            isAdmin: this.isAdmin,
            outstanding: this.teamrequests,
            blnShowRemoveFromTeamButton: true,
            blnShowAddToTeamButton: true,
        };
        this.requestsProfile = {
            profiles: this.outstanding,
            isAdmin: this.isAdmin,
            outstanding: this.teamrequests,
            blnShowRemoveFromTeamButton: true,
            blnShowAddToTeamButton: true,
        };
    }

    getPeople() {
        this.isAdmin = false;
        this.admins = [];
        this.selectedTeam.responsiblepeople.forEach((x: string) => {
            this.apiService.getUserProfileByUsernameAndOrganisation(x).subscribe(
                (res: iFullUser) => {
                    if (res) {
                        if (!this.admins.includes(res)) {
                            this.admins.push(res);
                        }
                        if (res.username === this.tokenDecoded.username) {
                            this.isAdmin = true;
                            this.setConfig();
                        }
                    }
                },
                () => {
                    this.admins.push({
                        username: x.split("#")[0],
                        name: x.split("#")[0],
                        email: null,
                        organisation: x.split("#")[1],
                    });
                }
            );
        });

        this.teammembers = [];
        this.members = [];
        this.TeamMember = false;
        this.apiService.getTeamMembersByCode(this.selectedTeam.code).subscribe((response: iTeamMembers[]) => {
            this.teammembers = response;
            this.teammembers.forEach((x) => {
                this.apiService.getUserProfileByUsernameAndOrganisation(`${x.username}#${x.organisation}`).subscribe(
                    (res: iFullUser) => {
                        if (res) {
                            if (!this.members.includes(res)) {
                                this.members.push(res);
                            }
                            if (res.username === this.tokenDecoded.username) {
                                this.TeamMember = true;
                            }
                        }
                    },
                    () => {
                        this.members.push({ username: x.username, name: x.username, email: null, organisation: x.organisation });
                    }
                );
            });
        });

        this.invitees = [];
        this.outstanding = [];
        this.teamrequests = [];
        this.apiService.getTeamRequestsByTeamCode(this.selectedTeam.code).subscribe(
            (response: iTeamRequest[]) => {
                this.teamrequests = response.filter((x) => !x.approveddate && !x.refusedate);
                this.teamrequests.forEach((x) => {
                    this.apiService.getUserProfileByUsernameAndOrganisation(`${x.username}#${x.organisation}`).subscribe(
                        (res: iFullUser) => {
                            if (res) {
                                if (x.requestor) {
                                    if (!this.outstanding.includes(res)) {
                                        this.outstanding.push(res);
                                    }
                                } else {
                                    if (!this.invitees.includes(res)) {
                                        this.invitees.push(res);
                                    }
                                }
                            }
                        },
                        () => {
                            this.members.push({ username: x.username, name: x.username, email: null, organisation: x.organisation });
                        }
                    );
                });
            },
            () => {}
        );
    }

    removal(person: iFullUser) {
        if (this.members.includes(person)) {
            const member = this.teammembers.filter((x) => x.username === person.username);
            if (member) {
                this.apiService.removeTeamMember(member[0]).subscribe((res: any) => {
                    if (res.success) {
                        this.members.splice(this.members.indexOf(person), 1);
                        this.notificationService.success("Removed from Members");
                    }
                });
            }
        }
        if (this.invitees.includes(person)) {
            const request = this.teamrequests.filter((x) => x.username === person.username);
            if (request) {
                const payload = request[0];
                // request[0].isArchived = true;
                this.apiService.archiveTeamRequest(payload).subscribe((res: any) => {
                    if (res.success) {
                        this.invitees.splice(this.invitees.indexOf(person), 1);
                        this.notificationService.success("Removed Invitation");
                    }
                });
            }
        }
        if (this.admins.includes(person)) {
            this.selectedTeam.responsiblepeople.splice(this.selectedTeam.responsiblepeople.indexOf(person.username), 1);
            this.apiService.updateTeam(this.selectedTeam).subscribe((res: any) => {
                if (res.success) {
                    this.notificationService.success("Removed Admin");
                }
            });
        }
    }

    removeAdmin(person: iFullUser) {
        if (this.admins.includes(person)) {
            this.selectedTeam.responsiblepeople.splice(this.selectedTeam.responsiblepeople.indexOf(person.username), 1);
            this.apiService.updateTeam(this.selectedTeam).subscribe((res: any) => {
                if (res.success) {
                    this.notificationService.success("Removed Admin");
                    this.store.dispatch(UpdateTeams);
                }
            });
        }
    }

    makeAdmin(person: iFullUser) {
        if (this.admins.filter((x) => x.username === person.username).length === 0) {
            this.selectedTeam.responsiblepeople.push(person.username);
            this.apiService.updateTeam(this.selectedTeam).subscribe(() => {
                this.admins.push(person);
                this.notificationService.success("Promoted to Admin");
                this.store.dispatch(UpdateTeams);
            });
        } else {
            this.notificationService.warning("Already an Admin");
        }
    }

    invitePerson() {
        const dialogRef = this.dialog.open(UserSearchDialogComponent, {
            width: "600px",
            data: null,
        });

        dialogRef.afterClosed().subscribe((result: iFullUser) => {
            if (result) {
                const request: iTeamRequest = {
                    username: result.username,
                    organisation: result.organisation,
                    teamcode: this.selectedTeam.code,
                    requestdate: new Date(),
                    emailto: result.email,
                };
                this.apiService.addTeamRequest(request).subscribe((res: any) => {
                    if (res.success) {
                        this.notificationService.success("Request Sent.");
                        this.teamrequests.push(request);
                        this.invitees.push(result);
                    } else {
                        this.notificationService.warning("Unable to add team request.");
                    }
                });
            }
        });
    }

    requestAccess() {
        this.apiService
            .getUserProfileByUsernameAndOrganisation(this.selectedTeam.responsiblepeople[0])
            .subscribe((resAdminProfile: any) => {
                if (resAdminProfile.success === false) {
                    this.notificationService.warning(
                        "Unable to locate administrator of team. Please contact the administrator directly to gain access to the team."
                    );
                } else {
                    const newRequest: iTeamRequest = {
                        username: this.tokenDecoded.username,
                        organisation: this.tokenDecoded.organisation,
                        teamcode: this.selectedTeam.code,
                        requestdate: new Date(),
                        requestor: this.tokenDecoded.email,
                        emailto: resAdminProfile.email,
                    };
                    this.apiService.addTeamRequest(newRequest).subscribe((res: any) => {
                        if (res.success) {
                            this.notificationService.success("A request has been sent to the Team Administrator to grant you access.");
                            const thisPerson: iFullUser = {
                                name: this.tokenDecoded.name,
                                username: this.tokenDecoded.username,
                                email: this.tokenDecoded.email,
                                organisation: this.tokenDecoded.organisation,
                            };
                            this.outstanding.push(thisPerson);
                        } else {
                            this.notificationService.warning(res.msg);
                        }
                    });
                }
            });
    }
}
