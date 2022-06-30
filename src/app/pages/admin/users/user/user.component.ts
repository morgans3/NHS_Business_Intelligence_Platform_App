import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { APIService } from "diu-component-library";
import { MatTable } from "@angular/material/table";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-user",
    templateUrl: "./user.component.html",
    styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {

    @ViewChild("teamsTable", { static: true }) teamsTable: MatTable<any>;
    @ViewChild("accessLogsTable", { static: true }) accessLogsTable: MatTable<any>;

    user;
    accessLogs = [];

    constructor(
        private apiService: APIService,
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.activatedRoute.params.subscribe((params) => {
            // Get user's details
            this.apiService.getUser(params.id).subscribe((user) => {
                // Set user object
                this.user = Object.assign(user, { id: params.id });

                // Init access logs
                this.apiService.getAllAccessLogsByUser({ user: params.id }).subscribe((data: any) => {
                    this.accessLogs = data.slice(0, 5);
                    this.accessLogsTable.renderRows();
                });
            });
        });
    }

    teams = {
        list: { all: [], filtered: [] },
        selected: [],
        get: async () => {
            // Get teams list?
            if (this.teams.list.all.length === 0) {
                this.teams.list.all = (await this.apiService.getTeams().toPromise()) as any;
            }

            // Get user's teams
            this.apiService.getTeamMembershipsByUsername(this.user.username).subscribe((teamMembers: any) => {
                const usersTeamLinks = teamMembers.reduce((obj, link) => ({ ...obj, [link.teamcode]: link["id"] }), {});
                this.teams.selected = this.teams.list.all
                    .filter((team) => Object.keys(usersTeamLinks).includes(team.code))
                    .map((team) => {
                        team.link_id = usersTeamLinks[team.code];
                        return team;
                    });
            });
        },
        search: (name = "") => {
            // Filter teams
            const selectedIds = this.teams.selected.map((item) => item["id"]);
            this.teams.list.filtered = this.teams.list.all.filter((item) => {
                const itemName = item.name as string;
                const description = item.description as string;
                const fullItem = itemName.toLowerCase() + description.toLowerCase();
                return fullItem.includes(name.toLowerCase()) && !selectedIds.includes(item["id"]);
            });
        },
        assign: ($event, teamsSearchInput) => {
            // Send request
            this.apiService
                .addTeamMember({
                    id: null,
                    teamcode: $event.option.value.code,
                    username: this.user.username,
                    organisation: this.user.organisation,
                    joindate: new Date(),
                })
                .subscribe((data: any) => {
                    if (data.success) {
                        // Add team
                        this.teams.selected.push(Object.assign($event.option.value, { id: data.data["id"] }));
                        this.teamsTable.renderRows();
                        this.notificationService.success("User added to team!");
                    } else {
                        this.notificationService.error("An error occurred adding this user to the team");
                    }
                });

            // Clear input
            teamsSearchInput.value = "";
            teamsSearchInput.blur();
        },
        revoke: (index) => {
            // Send request
            this.apiService
                .removeTeamMember({
                    id: this.teams.selected[index].link_id,
                    organisation: null,
                    teamcode: null,
                    username: null,
                    joindate: null,
                })
                .subscribe((data: any) => {
                    if (data.success) {
                        // Remove by index
                        this.teams.selected.splice(index, 1);
                        this.teamsTable.renderRows();
                        this.notificationService.success("User has been removed from the team");
                    } else {
                        this.notificationService.error("An error occurred removing this user from the team");
                    }
                });
        },
    };
}
