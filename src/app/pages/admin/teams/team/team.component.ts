import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";
import { SharedCapabilitiesTableComponent } from "../../_shared/capabilities-table/capabilities-table.component";
import { SharedRolesTableComponent } from "../../_shared/roles-table/roles-table.component";
import { forkJoin } from "rxjs";

@Component({
    selector: "admin-team",
    templateUrl: "./team.component.html",
    styleUrls: ["./team.component.scss"],
})
export class TeamComponent implements OnInit {
    @ViewChild("roles") roles: SharedRolesTableComponent;
    @ViewChild("capabilities") capabilities: SharedCapabilitiesTableComponent;

    id = null;
    team = new FormGroup({
        id: new FormControl(null),
        code: new FormControl(""),
        name: new FormControl(""),
        description: new FormControl(""),
        organisationcode: new FormControl(""),
        responsiblepeople: new FormControl([]),
    });

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private apiService: APIService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        // Listen for id param
        this.activatedRoute.params.subscribe((params) => {
            if (params.id && params.id !== "new") {
                this.apiService.getTeams().subscribe((teams: any) => {
                    // Get team and set value
                    const team = teams.find((team) => {
                        return team.id === params.id;
                    });
                    this.team.patchValue(team);
                });
            }
        });
    }

    save() {
        // Create/Update team?
        if (this.team.value.id) {
            // Update team
            this.apiService.updateTeam(this.team.value).subscribe((data: any) => {
                if (data.success) {
                    // Update roles and capabilities
                    forkJoin({
                        capabilities: this.capabilities.save(),
                        roles: this.roles.save(),
                    }).subscribe((data: any) => {
                        if (data.capabilities.success && data.roles.success) {
                            this.notificationService.success("Team updated successfully!");
                            this.router.navigateByUrl("/admin/teams");
                        } else {
                            this.notificationService.error("An error adding roles & capabilities to the team");
                        }
                    });
                } else {
                    this.notificationService.error("An error occurred updating the team");
                }
            });
        } else {
            this.apiService.createTeam(this.team.value).subscribe((response: any) => {
                if (response.success) {
                    // Update model id
                    this.roles.modelId = response.data.id;
                    this.capabilities.modelId = response.data.id;

                    // Create roles and capabilties
                    forkJoin({
                        capabilities: this.capabilities.save(),
                        roles: this.roles.save(),
                    }).subscribe((data: any) => {
                        if (data.capabilities.success && data.roles.success) {
                            this.notificationService.success("Team created successfully!");
                            this.router.navigateByUrl("/admin/teams");
                        } else {
                            this.notificationService.error("An error adding roles & capabilities to the team");
                        }
                    });
                } else {
                    this.notificationService.error("An error occurred creating the team");
                }
            });
        }
    }

    update() {
        // TODO: implement function or update html onSubmit
    }
}
