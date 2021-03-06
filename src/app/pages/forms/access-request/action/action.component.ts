import { Component, OnInit } from "@angular/core";
import { NotificationService } from "../../../../_services/notification.service";
import { ActivatedRoute } from "@angular/router";
import { APIService } from "diu-component-library";

@Component({
    selector: "app-access-request-action",
    templateUrl: "./action.component.html",
    styleUrls: ["./action.component.scss"],
})
export class AccessRequestActionFormComponent implements OnInit {
    request: any = {};
    action = "approve";

    constructor(private activatedRoute: ActivatedRoute, private notificationService: NotificationService, private apiService: APIService) {}

    ngOnInit() {
        // Listen for request id
        this.activatedRoute.queryParams.subscribe((params) => {
            // Set parent request id
            this.getRequest(params["id"] || null);

            // Listen for request action
            this.activatedRoute.params.subscribe((params) => {
                if (params["action"]) {
                    this.action = params["action"];
                }
            });
        });
    }

    getRequest(id) {
        this.apiService.getRequest(id).subscribe((request: any) => {
            this.request = request;
        });
    }

    submit(form) {
        if (form.valid) {
            // Create form object
            let actionData: any = {
                parent_id: this.request.id,
                action: this.action,
                date: new Date().toISOString(),
                token: this.activatedRoute.snapshot.queryParams.token
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

    valueJson(data) {
        return data instanceof Array ? data.join(",") : data;
    }
}
