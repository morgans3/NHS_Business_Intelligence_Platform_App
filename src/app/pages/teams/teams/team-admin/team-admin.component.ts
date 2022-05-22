import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { Store } from "@ngxs/store";
import { NotificationService } from "src/app/_services/notification.service";
import { AuthState } from "src/app/_states/auth.state";
import { iApplication, iInstallation, iTeam, iDisplayList, APIService } from "diu-component-library";
import { decodeToken } from "src/app/_pipes/functions";

@Component({
    selector: "app-team-admin",
    templateUrl: "./team-admin.component.html",
})
export class TeamAdminComponent implements OnInit, OnChanges {
    @Input() team: iTeam;
    selectedTeam: iTeam;
    applications: iApplication[] = [];
    roles: any[] = [];
    teamInstalls: iInstallation[] = [];
    tokenDecoded: any;
    displayLists: { title: string; data: iDisplayList[] }[] = [];
    teamInstallations: iInstallation[] = [];

    constructor(private apiService: APIService, public store: Store, private notificationService: NotificationService) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        if (token) {
            this.tokenDecoded = decodeToken(token);
        }
    }

    ngOnInit() {
        this.selectedTeam = this.team;
        this.getInstallations();
        this.getTeamRoles();
    }

    ngOnChanges() {
        if (this.team && this.team !== this.selectedTeam) {
            this.selectedTeam = this.team;
            this.getInstallations();
            this.getTeamRoles();
        }
    }

    getTeamRoles() {
        // TODO: switch to new roles
        // this.apiService.getRolesByTeamcode(this.team.code).subscribe((res: any) => {
        //     this.roles = [];
        //     if (res) {
        //         res.forEach((role) => {
        //             const currentRole = role;
        //             Object.keys(currentRole.role).forEach((key) => {
        //                 currentRole.name = key;
        //                 currentRole.status = currentRole.role[key];
        //             });
        //             this.roles.push(currentRole);
        //         });
        //     }
        // });
    }

    getInstallations() {
        // TODO: get installations
        // if (this.installbroker.getAllInstallations.length === 0) this.installbroker.buildUserData();
        // this.installbroker.getAllTeamInstallations(this.selectedTeam.code, (err: any, res: any) => {
        //   this.teamInstallations = res;
        // });
        // this.installbroker.createDisplayLists(
        //   "team",
        //   (err: any, res: any) => {
        //     this.displayLists = res;
        //   },
        //   this.selectedTeam.code
        // );
    }

    install(event: any, type: string) {
        console.log(event);
        console.log(type);
        // TODO: install app
        // this.installbroker.addInstallation(
        //   event.name,
        //   type.toLowerCase(),
        //   (err: any, res: iInstallation[]) => {
        //     if (err) this.notificationService.warning(err);
        //     else {
        //       this.notificationService.success("Installed");
        //     }
        //     this.getInstallations();
        //   },
        //   undefined,
        //   this.team.code
        // );
    }

    remove(event: any, type: string) {
        console.log(type);
        const install = this.teamInstallations.find((x) => x.app_name === event.name);
        if (install) {
            // TODO: remove app
            // this.installbroker.removeInstallationFromAList(
            //   install,
            //   (err: any, res: iInstallation[]) => {
            //     this.getInstallations();
            //     if (err) this.notificationService.warning(err);
            //     else {
            //       this.notificationService.success("Request Updated");
            //     }
            //   },
            //   this.teamInstallations
            // );
        }
    }
    removeTeamRole(role) {
        console.log(role);
        // TODO: Handle remove role from team
    }

    addTeamRole(role) {
        // TODO: add role to team
        console.log(role);
    }
}
