import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MFAAuthService, UserGroupService } from "diu-component-library";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "src/app/_services/notification.service";

@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {

    @ViewChild("rolesTable") rolesTable: MatTable<any>;
    @ViewChild("capabilitiesTable") capabilitiesTable: MatTable<any>;
    @ViewChild("teamsTable") teamsTable: MatTable<any>;

    user; accessLogs = [];

    constructor(
        private router: Router,
        private authService: MFAAuthService,
        private activatedRoute: ActivatedRoute,
        private userGroupService: UserGroupService,
        private notificationService: NotificationService,
    ) { }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            //Get user's details
            this.userGroupService.getUser(params.id).subscribe((user) => {
                //Set user object
                this.user = Object.assign(user, { id: params.id });

                //Init access logs
                this.authService.getAccessLogsByUser(this.user.id).subscribe((data: any) => {
                    this.accessLogs = data.Items.slice(0, 5);
                })

                //Get team capabilities
                this.authService.getCapabilitiesByTypeId("user", this.user.id).subscribe((data: any) => {
                    this.capabilities.selected = data instanceof Array ? data : [];
                    this.capabilitiesTable.renderRows();
                });
            });
        });
    }

    roles = {
        list: { all: [], filtered: [] }, selected: [],
        get: () => {
            //Get team roles
            this.authService.getRolesByTypeId("user", this.user.id).subscribe((data: any) => {
                this.roles.selected = data instanceof Array ? data : [];
                this.rolesTable.renderRows();
            });
        },
        search: async (name = "") => {
            //Get roles list?
            if (this.roles.list.all.length == 0) {
                this.roles.list.all = (await this.authService.getRoles().toPromise()) as any;
            }

            //Filter roles
            let selectedIds = this.roles.selected.map((item) => item.id);
            this.roles.list.filtered = this.roles.list.all.filter((item) => {
                return (item.name.toLowerCase() + item.description.toLowerCase()).includes(name.toLowerCase()) && !selectedIds.includes(item.id);
            });
        },
        assign: ($event, rolesSearchInput) => {
            //Add role
            this.roles.selected.push($event.option.value);
            this.rolesTable.renderRows();

            //Clear input
            rolesSearchInput.value = "";
            rolesSearchInput.blur();
        },
        revoke: (index) => {
            //Remove by index
            this.roles.selected.splice(index, 1);
            this.rolesTable.renderRows();
        },
        save: () => {
            this.authService.syncRoleLinks(
                this.roles.selected.map((item) => item.id),
                "user", this.user.id
            ).subscribe((data: any) => {
                if (data.success) {
                    this.notificationService.success("User's roles updated successfully!");
                  } else {
                    this.notificationService.error("An error occurred updating this user's roles");
                  }
            })
        }
    };

    capabilities = {
        list: { all: [], filtered: [] }, selected: [],
        get: () => {
            //Get team roles
            this.authService.getCapabilitiesByTypeId("user", this.user.id).subscribe((data: any) => {
                this.capabilities.selected = data instanceof Array ? data : [];
                this.capabilitiesTable.renderRows();
            });
        },
        search: async (name = "") => {
            //Get roles list?
            if (this.capabilities.list.all.length == 0) {
                this.capabilities.list.all = (await this.authService.getCapabilities().toPromise()) as any;
            } 

            //Filter roles
            let selectedIds = this.capabilities.selected.map((item) => item.id);
            this.capabilities.list.filtered = this.capabilities.list.all.filter((item) => {
                return (item.name.toLowerCase() + item.description.toLowerCase()).includes(name.toLowerCase()) && !selectedIds.includes(item.id);
            });
        },
        assign: ($event, capabilitiesSearchInput) => {
          //Add role
          this.capabilities.selected.push($event.option.value);
          this.capabilitiesTable.renderRows();
    
          //Clear input
          capabilitiesSearchInput.value = "";
          capabilitiesSearchInput.blur();
        },
        revoke: (index) => {
          //Remove by index
          this.capabilities.selected.splice(index, 1);
          this.capabilitiesTable.renderRows();
        },
        save: () => {
            this.authService.syncCapabilityLinks(
                this.capabilities.selected.map((item) => item.id),
                "user", this.user.id
            ).subscribe((data: any) => {
                if (data.success) {
                    this.notificationService.success("User's capabilities updated successfully!");
                  } else {
                    this.notificationService.error("An error occurred updating this user's capabilities");
                  }
            })
        }
    };

    teams = {
        list: { all: [], filtered: [] }, selected: [],
        get: async () => {
            //Get teams list?
            if (this.teams.list.all.length == 0) {
                this.teams.list.all = (await this.userGroupService.getTeams().toPromise()) as any;
            } 
        
            //Get user's teams
            this.userGroupService.getTeamMembershipsByUsername(this.user.username).subscribe((teamMembers: any) => {
                let usersTeamLinks =  teamMembers.reduce((obj, link) => ({...obj, [link.teamcode]: link._id}), {})
                this.teams.selected = this.teams.list.all.filter(
                    (team) => Object.keys(usersTeamLinks).includes(team.code)
                ).map((team) => {
                    team.link_id = usersTeamLinks[team.code];
                    return team;
                });
            });
        },
        search: (name = "") => {
            //Filter roles
            let selectedIds = this.teams.selected.map((item) => item._id);
            this.teams.list.filtered = this.teams.list.all.filter((item) => {
                return (item.name.toLowerCase() + item.description.toLowerCase()).includes(name.toLowerCase()) && !selectedIds.includes(item._id);
            });
        },
        assign: ($event, teamsSearchInput) => {
            //Send request
            //@ts-ignore
            this.userGroupService.addTeamMember({
                teamcode: $event.option.value.code,
                username: this.user.username,
                joindate: new Date()
            }).subscribe((data: any) => {
                if (data.success) {
                    //Add team
                    this.teams.selected.push(Object.assign($event.option.value, { _id: data.data._id  }));
                    this.teamsTable.renderRows();
                    this.notificationService.success("User added to team!");
                } else {
                    this.notificationService.error("An error occurred adding this user to the team");
                }
            });
    
          //Clear input
          teamsSearchInput.value = "";
          teamsSearchInput.blur();
        },
        revoke: (index) => {
          //Send request 
          //@ts-ignore
          this.userGroupService.removeTeamMember({
            _id: this.teams.selected[index].link_id
          }).subscribe((data: any) => {
            if (data.success) {
                //Remove by index
                this.teams.selected.splice(index, 1);
                this.teamsTable.renderRows();
                this.notificationService.success("User has been removed from the team");
            } else {
                this.notificationService.error("An error occurred removing this user from the team");
            }
          })
        }
    };
}