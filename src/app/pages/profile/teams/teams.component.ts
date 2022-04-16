import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";

import { Store } from "@ngxs/store";
import { MatDialog } from "@angular/material/dialog";

import { iTeam, iTeamMembers, iOrganisation, iTeamRequest, iFullUser } from "diu-component-library";
import { UserGroupService } from "diu-component-library";
import { NotificationService } from "../../../_services/notification.service";
import { AuthState } from "../../../_states/auth.state";
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

  constructor(private userGroupService: UserGroupService, private notificationService: NotificationService, public dialog: MatDialog, public store: Store) {
    //Get user JWT and memberships
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      let decodedToken = decodeToken(token) as any;
      this.myTeamMemberships = decodedToken.memberships;
    }
  }

  ngOnInit() {
    //Get teams
    if (this.user) {
      this.getTeams();
    }

    this.getOrganisations(); //Get organisations and requests

    //Filter teams
    this.joinTeamForm.controls.team.valueChanges.subscribe((value: string) => {
      if (typeof value == "string") {
        this.teams.filtered = this.teams.all.filter((x: iTeam) => x.name.toLowerCase().includes(value.toLowerCase()) && !this.inTeam(x.code));
      }
    });
  }

  getTeams() {
    //Reset user's teams
    this.myTeams = [];

    // @ts-ignore
    this.store.select(ReferenceState.getTeams).subscribe((res: Team[]) => {
      this.teams.all = res;
      if (this.myTeamMemberships) {
        let myTeamCodes = this.myTeamMemberships.map((membership) => membership.teamcode);
        this.myTeams = res.filter((team) => myTeamCodes.includes(team.code));

        //Get user's team requests
        //@ts-ignore
        this.userGroupService.getTeamRequestsByUsername(this.user.username).subscribe((res: iTeamRequest[]) => {
          this.myTeamRequests = res.map((teamRequest: any) => {
            //Find corresponding team
            let teamDetails = this.teams.all.find((team) => teamRequest.teamcode == team.code);

            //Set missing properties
            teamRequest.organisationcode = teamDetails?.organisationcode || "";
            teamRequest.teamname = teamDetails?.name || "";
            return teamRequest;
          });
        });
      }
    });
  }

  inTeam(teamcode: string) {
    let x = this.myTeams.find((y) => y.code === teamcode);
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
    //Get selected team
    let team = this.joinTeamForm.value.team;
    if (team) {
      this.userGroupService
        .addTeamRequest({
          username: this.user.username,
          teamcode: team.code,
          requestdate: new Date(),
          requestor: this.user.username,
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
  }

  leaveTeam(team: iTeam) {
    this.notificationService.question("Are you sure you want to leave this team?").then((confirmed) => {
      if (confirmed == true) {
        const membership = this.myTeamMemberships.filter((x) => x.teamcode === team.code);
        if (membership.length > 0) {
          this.userGroupService.removeTeamMember(membership[0]).subscribe((res: any) => {
            if (res.success) {
              this.notificationService.success("You have now left this Team");
              this.getTeams();
            } else {
              this.notificationService.warning(res.msg);
            }
          });
        }
      }
    });
  }

  getOrganisations() {
    //Get organisations
    this.store.select(ReferenceState.getOrganisations).subscribe((res: iOrganisation[]) => {
      this.organisations = res;
    });
  }

  getOrganisationName(orgcode: string) {
    let organisation = this.organisations.find((y) => y.code === orgcode);
    return organisation ? organisation.name : "";
  }
}
