import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../../../../_services/notification.service";
import { ActivatedRoute, Router } from "@angular/router";
import { APIService } from "diu-component-library";

@Component({
    selector: "app-access-request-action",
    templateUrl: "./action.component.html",
    styleUrls: ["./action.component.scss"],
})
export class AccessRequestActionFormComponent implements OnInit {

    request: any = {};
    action = "approve";

    constructor(
        private activatedRoute: ActivatedRoute,
        private notificationService: NotificationService,
        private apiService: APIService,
    ) {}

    ngOnInit() {
        // Listen for request id
        this.activatedRoute.queryParams.subscribe((params) => {
            // Set parent request id
            this.getRequest(params["id"] || null, params["capabilities"]);

            // Listen for request action
            this.activatedRoute.params.subscribe((params) => {
                if (params["action"]) {
                    this.action = params["action"];
                }
            });
        });
    }

    getRequest(id, capabilitiesForApproval = []) {
        this.apiService.getAccessRequest(id).subscribe((request: any) => {
            this.apiService.getCapabilities().subscribe((data: any) => {
                // Keyby id
                const capabilities = data.reduce((acc, cur, i) => {
                    acc[cur.id] = cur;
                    return acc;
                }, {});

                // Enrich array
                request.data.capabilities = request.data.capabilities.filter((capability) => {
                    return capabilitiesForApproval.includes(capability.id)
                }).map((capability) => {
                    capability.name = capabilities[capability.id].name;
                    capability.description = capabilities[capability.id].description;
                    if(capability.meta?.children) {
                        capability.children = capability.meta.children.map((child) => {
                            child.name = capabilities[child.id].name;
                            child.description = capabilities[child.id].description;
                            return child;
                        });
                    }
                    return capability;
                });

                // Set request data
                this.request = request;
            })
        });
    }

    submit(form) {
        if (form.valid) {
            // Create form object
            let actionData: any = {
                parent_id: this.request.id,
                action: this.action,
                date: new Date().toISOString(),
                capabilities: this.request.data.capabilities
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
            this.apiService.sendAccessRequestComplete(actionData).subscribe(() => {
                // Set status
                this.request.data.approved = this.action === "approve" ? true : false;
            });
        } else {
            this.notificationService.error("Please make sure all fields are filled in correctly!");
        }
    }

    valueJson(data) { return (data instanceof Array) ? data.join(","): data }
}
