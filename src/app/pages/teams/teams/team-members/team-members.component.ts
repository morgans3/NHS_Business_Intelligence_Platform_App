import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngxs/store";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";
import { AuthState } from "../../../../_states/auth.state";
import { iFullUser, iTeamRequest, iTeamMembers } from "diu-component-library";
import { generateID, decodeToken } from "../../../../_pipes/functions";

@Component({
    selector: "app-team-members",
    templateUrl: "./team-members.component.html",
    styleUrls: ["./team-members.component.scss"],
})
export class TeamMembersComponent implements OnInit, OnChanges {
    @Input() config: any;
    oldConfig: any;
    profiles: iFullUser[];
    isAdmin = false;
    outstanding: iTeamRequest[] = [];
    tokenDecoded: any;
    blnShowAdminButton = false;
    blnShowRemoveFromTeamButton = false;
    blnShowAddToTeamButton = false;
    blnShowRemoveAdminButton = false;
    @Output() changedTeams = new EventEmitter<boolean>();
    @Output() removeTeamMember = new EventEmitter<iFullUser>();
    @Output() adminUser = new EventEmitter<iFullUser>();
    @Output() removeTeamAdmin = new EventEmitter<iFullUser>();

    constructor(
        public store: Store,
        private notificationService: NotificationService,
        private apiService: APIService,
        public dialog: MatDialog
    ) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
        }
    }

    ngOnInit() {
        this.setConfig();
    }

    ngOnChanges() {
        this.setConfig();
    }

    setConfig() {
        if (this.config) {
            if (this.config.profiles) this.profiles = this.config.profiles;
            if (this.config.isAdmin) this.isAdmin = this.config.isAdmin;
            if (this.config.outstanding) this.outstanding = this.config.outstanding;
            if (this.config.blnShowAdminButton) this.blnShowAdminButton = this.config.blnShowAdminButton;
            if (this.config.blnShowRemoveFromTeamButton) this.blnShowRemoveFromTeamButton = this.config.blnShowRemoveFromTeamButton;
            if (this.config.blnShowAddToTeamButton) this.blnShowAddToTeamButton = this.config.blnShowAddToTeamButton;
            if (this.config.blnShowRemoveAdminButton) this.blnShowRemoveAdminButton = this.config.blnShowRemoveAdminButton;
            this.oldConfig = this.config;
        }
    }

    removeUserFromTeam(person: iFullUser) {
        if (this.outstanding.length) {
            const user = this.outstanding.filter((x) => x.username === person.username);
            const index = this.outstanding.indexOf(user[0]);
            if (user) {
                const payload = user[0];
                this.apiService.archiveTeamRequest(payload).subscribe((res: any) => {
                    if (res.success) {
                        this.outstanding.splice(index, 1);
                        this.notificationService.warning("Removed Request");
                        this.changedTeams.emit(true);
                    }
                });
            }
        } else {
            this.removeTeamMember.emit(person);
        }
    }

    removeUserFromTeamAdmin(person: iFullUser) {
        this.removeTeamAdmin.emit(person);
    }

    addUserToTeam(person: iFullUser) {
        const request = this.outstanding.filter((x) => x.username === person.username);
        if (request) {
            const index = this.outstanding.indexOf(request[0]);
            request[0].approveddate = new Date();
            request[0].requestapprover = this.tokenDecoded.username;
            this.apiService.updateTeamRequest(request[0]).subscribe((res: any) => {
                if (res.success) {
                    const newTeamMember: iTeamMembers = {
                        username: person.username,
                        organisation: person.organisation,
                        teamcode: request[0].teamcode,
                        joindate: new Date(),
                        id: generateID(),
                    };
                    this.apiService.addTeamMember(newTeamMember).subscribe(() => {
                        this.notificationService.success("Added to Team");
                        this.outstanding.splice(index, 1);
                        this.changedTeams.emit(true);
                    });
                }
            });
        }
    }

    addAdmin(person: iFullUser) {
        this.adminUser.emit(person);
    }
}
