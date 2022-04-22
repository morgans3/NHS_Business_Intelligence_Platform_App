import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngxs/store";
import { AuthState } from "src/app/_states/auth.state";
import { UpdateTeams } from "src/app/_states/reference.state";
import { NotificationService } from "src/app/_services/notification.service";
import { generateID, decodeToken } from "src/app/_pipes/functions";
import { APIService, UserSearchDialogComponent } from "diu-component-library";
import { iFullUser, iTeam, iTeamRequest, iTeamMembers, iTasks } from "diu-component-library";

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

  constructor(public store: Store, private apiService: APIService, private notificationService: NotificationService, public dialog: MatDialog) {
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
    this.selectedTeam.responsiblepeople.forEach((x: any) => {
      // @ts-ignore
      this.apiService.getUserProfileByUsername(x).subscribe((res: iFullUser) => {
        if (res) {
          if (!this.admins.includes(res)) {
            this.admins.push(res);
          }
          if (res.username === this.tokenDecoded.username) {
            this.isAdmin = true;
            this.setConfig();
          }
        }
      });
    });

    this.teammembers = [];
    this.members = [];
    this.TeamMember = false;
    // @ts-ignore
    this.apiService.getTeamMembersByCode(this.selectedTeam.code).subscribe((response: iTeamMembers[]) => {
      this.teammembers = response;
      this.teammembers.forEach((x) => {
        // @ts-ignore
        this.apiService.getUserProfileByUsername(x.username).subscribe((res: iFullUser) => {
          if (res) {
            if (!this.members.includes(res)) {
              this.members.push(res);
            }
            if (res.username === this.tokenDecoded.username) {
              this.TeamMember = true;
            }
          }
        });
      });
    });

    this.invitees = [];
    this.outstanding = [];
    this.teamrequests = [];
    // @ts-ignore
    this.apiService.getTeamRequestsByTeamCode(this.selectedTeam.code).subscribe((response: iTeamRequest[]) => {
      this.teamrequests = response.filter((x) => !x.approveddate && !x.refusedate);
      this.teamrequests.forEach((x) => {
        // @ts-ignore
        this.apiService.getUserProfileByUsername(x.username).subscribe((res: iFullUser) => {
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
        });
      });
    });
  }

  teamsChanged(event: any) {
    this.store.dispatch(UpdateTeams);
    this.getPeople();
  }

  removal(person: iFullUser) {
    if (this.members.includes(person)) {
      const member = this.teammembers.filter((x) => x.username === person.username);
      if (member) {
        this.apiService.removeTeamMember(member[0]).subscribe((res: any) => {
          if (res.success) {
            this.members.splice(this.members.indexOf(person), 1);
            this.notificationService.success("Removed from Members");
            this.teamsChanged(true);
          }
        });
      }
    }
    if (this.invitees.includes(person)) {
      const request = this.teamrequests.filter((x) => x.username === person.username);
      if (request) {
        let payload = request[0]._id;
        // request[0].isArchived = true;
        // @ts-ignore
        this.apiService.archiveTeamRequest(payload).subscribe((res: any) => {
          if (res.success) {
            this.invitees.splice(this.invitees.indexOf(person), 1);
            this.notificationService.success("Removed Invitation");
            this.teamsChanged(true);
          }
        });
      }
    }
    if (this.admins.includes(person)) {
      this.selectedTeam.responsiblepeople.splice(this.selectedTeam.responsiblepeople.indexOf(person.username), 1);
      this.apiService.updateTeam(this.selectedTeam).subscribe((res: any) => {
        if (res.success) {
          this.notificationService.success("Removed Admin");
          this.teamsChanged(true);
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
          this.teamsChanged(true);
        }
      });
    }
  }

  makeAdmin(person: iFullUser) {
    if (this.admins.filter((x) => x.username === person.username).length === 0) {
      this.selectedTeam.responsiblepeople.push(person.username);
      this.apiService.updateTeam(this.selectedTeam).subscribe((res: any) => {
        this.admins.push(person);
        this.notificationService.success("Promoted to Admin");
        this.teamsChanged(true);
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
          teamcode: this.selectedTeam.code,
          // isArchived: false,
          requestdate: new Date(),
        };
        this.apiService.addTeamRequest(request).subscribe((res: any) => {
          if (res.success) {
            const Task: iTasks = {
              _id: generateID(),
              username: result.username,
              iscompleted: false,
              sentdate: new Date(),
              sender: this.tokenDecoded.username,
              archive: false,
              header: "Request to join " + this.selectedTeam.name,
              importance: "Normal",
              message: "Would you like to join our Team?",
              invite: "Team",
              teamcode: this.selectedTeam.code,
            };
            this.notificationService.success("Request Sent.");
            this.teamrequests.push(request);
            this.invitees.push(result);
            this.teamsChanged(true);
          } else {
            this.notificationService.warning("Unable to add team request.");
          }
        });
      }
    });
  }

  requestAccess() {
    const newRequest: iTeamRequest = {
      username: this.tokenDecoded.username,
      teamcode: this.selectedTeam.code,
      // isArchived: false,
      requestdate: new Date(),
      requestor: this.tokenDecoded.username,
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
        this.teamsChanged(true);
      } else {
        this.notificationService.warning(res.msg);
      }
    });
  }
}
