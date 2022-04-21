import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { Store } from "@ngxs/store";
import { NotificationService } from "src/app/_services/notification.service";
import { AuthState } from "src/app/_states/auth.state";
import { iApplication, iInstallation, iTeam, iDisplayList, MFAAuthService } from "diu-component-library";
import { decodeToken } from "src/app/_pipes/functions";
import { InstallationsBrokerService } from "src/app/_services/installations-broker.service";

@Component({
  selector: "app-team-admin",
  templateUrl: "./team-admin.component.html",
  styleUrls: ["./team-admin.component.scss"],
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

  constructor(private authService: MFAAuthService, public store: Store, private notificationService: NotificationService, private installbroker: InstallationsBrokerService) {
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
    this.authService.getRolesByTeamcode(this.team.code).subscribe((res: any) => {
      this.roles = [];
      if (res) {
        res.forEach((role) => {
          let currentRole = role;
          Object.keys(currentRole.role).forEach((key, index) => {
            currentRole.name = key;
            currentRole.status = currentRole.role[key];
          });
          this.roles.push(currentRole);
        });
      }
    });
  }

  getInstallations() {
    if (this.installbroker.getAllInstallations.length === 0) this.installbroker.buildUserData();
    this.installbroker.getAllTeamInstallations(this.selectedTeam.code, (err: any, res: any) => {
      this.teamInstallations = res;
    });
    this.installbroker.createDisplayLists(
      "team",
      (err: any, res: any) => {
        this.displayLists = res;
      },
      this.selectedTeam.code
    );
  }

  install(event: any, type: string) {
    this.installbroker.addInstallation(
      event.name,
      type.toLowerCase(),
      (err: any, res: iInstallation[]) => {
        if (err) this.notificationService.warning(err);
        else {
          this.notificationService.success("Installed");
        }
        this.getInstallations();
      },
      undefined,
      this.team.code
    );
  }

  remove(event: any, type: string) {
    const install = this.teamInstallations.find((x) => x.app_name === event.name);
    if (install) {
      this.installbroker.removeInstallationFromAList(
        install,
        (err: any, res: iInstallation[]) => {
          this.getInstallations();
          if (err) this.notificationService.warning(err);
          else {
            this.notificationService.success("Request Updated");
          }
        },
        this.teamInstallations
      );
    }
  }
  removeTeamRole(role) {
    this.authService.removeTeamRole(role).subscribe((res: any) => {
      if (res.success) {
        this.notificationService.success(res.msg);
      } else {
        this.notificationService.warning(res.msg);
      }
      this.getTeamRoles();
    });
  }

  addTeamRole(role) {
    //TODO: add role to team
  }
}