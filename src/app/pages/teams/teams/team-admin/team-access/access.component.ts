import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { APIService, iFullUser, iTeam } from "diu-component-library";
import { CapabilitiesSelectComponent } from "src/app/shared/components/capabilities-select/capabilities-select.component";
import { NotificationService } from "../../../../../_services/notification.service";
import { reverseFormat, getChanges } from "../../../../profile/access/utils";
import { decodeToken } from "src/app/_pipes/functions";
import { AuthState } from "src/app/_states/auth.state";
import { Store } from "@ngxs/store";

@Component({
    selector: "app-team-access",
    templateUrl: "./access.component.html",
})
export class TeamAccessComponent implements OnInit {

    loading = true;
    type = "roles";
    user: iFullUser;
    original = { capabilities: [], roles: [] }
    updated = new FormGroup({
        capabilities: new FormControl([]),
        roles: new FormControl([])
    });

    @Input() team: iTeam;

    constructor(
        private store: Store,
        private apiService: APIService,
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        // Decode user token
        const jwtToken = this.store.selectSnapshot(AuthState.getToken);
        this.user = decodeToken(jwtToken) as iFullUser;

        // Get existing capabilities
        this.apiService.getCapabilitiesByTypeId("team", this.team.code).subscribe((data: Array<any>) => {
            // Set values
            this.original.capabilities = reverseFormat(data || []);
            this.updated.get("capabilities").setValue(JSON.parse(JSON.stringify(this.original.capabilities)));
        });

        // Get existing roles
        this.apiService.getRolesByTypeId("team", this.team.code).subscribe((data: Array<any>) => {
            this.original.roles = reverseFormat(data || []);
            this.updated.get("roles").setValue(JSON.parse(JSON.stringify(this.original.roles)));
            this.loading = false;
        });

        // Listen for pre-select
        this.activatedRoute.queryParams.subscribe((queryParams) => {
            if(queryParams.capabilities) {
                this.type = "capabilities";
            }
        });
    }

    async autoSelectPermissions(capabilitiesSelect: CapabilitiesSelectComponent) {
        // Pre-select permissions
        const capabilitiesForSelection = this.activatedRoute.snapshot.queryParams.capabilities?.split(",") || 0;
        if(capabilitiesForSelection.length > 0) {
            for(const capability of capabilitiesForSelection) {
                // Get capability id
                const capability_id = parseInt(capability) || capabilitiesSelect.capabilities.all.find(
                    (item) => item.name === capability
                ).id;

                // Select/Edit
                if(capability_id) {
                    if (capabilitiesSelect.selected.ids.includes(capability_id)) {
                        await capabilitiesSelect.edit(null, capability_id);
                    } else {
                        await capabilitiesSelect.select(capability_id);
                    }
                } else {
                    this.notificationService.error("Could not find the permission you'd like to request")
                }
            }
            this.submit();
        }
    }

    async submit() {
        this.loading = true;
        const resetForm = () => {
            // Reset form
            this.original = this.updated.value;
            this.updated.markAsUntouched();
            this.updated.markAsPristine();
            this.loading = false;
        }

        // Get changed attributes
        const changed = {
            roles: getChanges(this.original.roles, this.updated.value.roles),
            capabilities: getChanges(this.original.capabilities, this.updated.value.capabilities),
        }

        // Handle deleted
        for(const capability of changed.roles.deleted) {
            await this.apiService.deleteRolesLink(capability.id, this.team.code, "team").toPromise();
        }
        for(const capability of changed.capabilities.deleted) {
            await this.apiService.deleteCapabilitiesLink(capability.id, this.team.code, "team").toPromise();
        }

        // Check for changes
        if(changed.roles.edited.length > 0 || changed.capabilities.edited.length > 0) {
            this.apiService.sendPermissionsRequest({
                type: "team",
                type_id: this.team.code,
                user: {
                    id: `${this.user.username}#${this.user.organisation}`,
                    email: this.user.email
                },
                roles: changed.roles.edited || [],
                capabilities: changed.capabilities.edited || [],
                date: new Date().toISOString()
            }).subscribe((data: any) => {
                if(data.success) {
                    // Notify user
                    this.notificationService.success(data.msg);

                    // Reset form
                    resetForm();
                } else {
                    this.loading = false;
                }
            }, () => {
                this.loading = false;
            });
        } else {
            this.loading = false;
            if(changed.roles.deleted.length > 0 && changed.capabilities.deleted.length > 0) {
                this.notificationService.warning("Nothing to update!");
            } else {
                resetForm(); // Reset form
                this.notificationService.warning("The permissions have been removed from your account!");
            }
        }
    }
}
