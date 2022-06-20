import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";
import { SharedCapabilitiesTableComponent } from "../../_shared/capabilities-table/capabilities-table.component";

@Component({
    selector: "admin-role-edit",
    templateUrl: "./role.component.html",
    styleUrls: ["./role.component.scss"],
})
export class RoleComponent implements OnInit {
    @ViewChild("capabilities") capabilities: SharedCapabilitiesTableComponent;

    role = new FormGroup({
        id: new FormControl(null),
        name: new FormControl("", Validators.required),
        description: new FormControl("", Validators.required),
        authoriser: new FormControl("", Validators.required),
    });

    constructor(
        private router: Router,
        private apiService: APIService,
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        // Listen for id param
        this.activatedRoute.params.subscribe((params) => {
            if (params.id && params.id !== "new") {
                this.apiService.getRoleById(params.id).subscribe((role: any) => {
                    // Set values
                    this.role.patchValue(
                        Object.assign(role, {
                            value: JSON.stringify(role.value),
                        })
                    );
                });
            }
        });
    }

    save() {
        if (this.role.valid) {
            // Create or update?
            let method;
            if (this.role.value.id) {
                method = this.apiService.updateRole(this.role.value);
            } else {
                method = this.apiService.createRole(this.role.value);
            }

            // Make request
            method.subscribe((res: any) => {
                if (res.success) {
                    // Update roles and capabilities
                    this.capabilities.modelId = res.data.id;
                    this.capabilities.save().subscribe((capabilitiesSave: any) => {
                        if (capabilitiesSave.success) {
                            this.notificationService.success(`Role ${this.role.value.id ? "updated" : "created"}  successfully`);
                            this.router.navigateByUrl("/admin/roles");
                        } else {
                            this.notificationService.error("An error adding capabilities to the role");
                        }
                    });
                } else {
                    this.notificationService.error(res.msg || "An error occurred!");
                }
            });
        } else {
            this.notificationService.error("Please make sure all required fields are filled in correctly!");
        }
    }
}
