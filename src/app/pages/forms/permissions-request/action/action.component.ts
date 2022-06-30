import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../../../../_services/notification.service";
import { ActivatedRoute } from "@angular/router";
import { APIService } from "diu-component-library";
import { forkJoin } from "rxjs";

@Component({
    selector: "app-access-request-action",
    templateUrl: "./action.component.html",
    styleUrls: ["./action.component.scss"],
})
export class PermissionRequestActionFormComponent implements OnInit {
    request: any = {};
    action = "approve";

    constructor(private activatedRoute: ActivatedRoute, private notificationService: NotificationService, private apiService: APIService) {}

    ngOnInit() {
        // Listen for request id
        this.activatedRoute.queryParams.subscribe((params) => {
            // Set parent request id
            this.getRequest(params);

            // Listen for request action
            this.activatedRoute.params.subscribe((params) => {
                if (params["action"]) {
                    this.action = params["action"];
                }
            });
        });
    }

    getRequest(params) {
        this.apiService.getRequest(params.id).subscribe((request: any) => {
            forkJoin({
                capabilities: this.apiService.getCapabilities(),
                roles: this.apiService.getRoles(),
            }).subscribe((data: any) => {
                // Hyrdate capability array
                const capabilities =  data.capabilities.reduce((acc, cur) => {
                    acc[cur.id] = cur; return acc;
                }, {});
                request.data.capabilities = request.data.capabilities
                    .filter((capability) => {
                        return params.capabilities.includes(capability.id);
                    })
                    .map((capability) => {
                        capability.name = capabilities[capability.id].name;
                        capability.description = capabilities[capability.id].description;
                        if (capability.meta?.children) {
                            console.log(capability);
                            capability.children = capability.meta.children.map((child) => {
                                child.name = capabilities[child.id].name;
                                child.description = capabilities[child.id].description;
                                return child;
                            });
                        }
                        return capability;
                    });

                // Hyrdate roles array
                const roles =  data.roles.reduce((acc, cur) => {
                    acc[cur.id] = cur; return acc;
                }, {});
                request.data.roles = request.data.roles
                    .filter((role) => {
                        return params.roles.includes(role.id);
                    })
                    .map((role) => {
                        role.name = roles[role.id].name;
                        role.description = roles[role.id].description
                        return role;
                    });

                // Set approval status?
                if(request.data.completed == null) {
                    const status = request.data.roles.filter((role) => {
                        return params.roles.includes(role.id) && role.approved == null;
                    }).concat(request.data.capabilities.filter((capability) => {
                        return params.capabilities.includes(capability.id) && capability.approved == null;
                    }));
                    request.data.completed = status.length > 0 ? null : true;
                }

                // Set expired?
                request.data.expired = request.data.completed == null ? (new Date(params.expiry) < new Date()) : false;

                // Set request data
                this.request = request;
            });
        });
    }

    submit(form) {
        if (form.valid) {
            // Create form object
            let actionData: any = {
                parent_id: this.request.id,
                action: this.action,
                date: new Date().toISOString(),
                token: this.activatedRoute.snapshot.queryParams["token"]
            };

            // Set form properties
            if (this.action === "approve") {
                actionData = Object.assign(actionData, {
                    officer: form.value.officer,
                    officer_job: form.value.officer_job,
                    organisation: form.value.organisation,
                });
            } else {
                actionData.reason = form.value.reason;
            }

            // Submit form
            this.apiService.sendPermissionsRequestComplete(actionData).subscribe(() => {
                // Set status
                this.request.data.completed = this.action === "approve" ? true : false;
            });
        } else {
            this.notificationService.error("Please make sure all fields are filled in correctly!");
        }
    }

    valueJson(data) {
        return data instanceof Array ? data.join(",") : data;
    }
}
