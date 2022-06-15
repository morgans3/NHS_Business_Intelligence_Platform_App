import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "admin-dashboard-modal",
    templateUrl: "./dashboard.modal.html",
})
export class DashboardModalComponent implements OnInit {
    newDashboard = false;
    dashboard = new FormGroup({
        name: new FormControl("", Validators.required),
        url: new FormControl("", Validators.required),
        ownerName: new FormControl("", Validators.required),
        ownerEmail: new FormControl("", Validators.required),
        icon: new FormControl("", Validators.required),
        environment: new FormControl("", Validators.required),
        status: new FormControl("", Validators.required),
        description: new FormControl("", Validators.required),
        images: new FormControl([]),
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private apiService: APIService,
        private dialogRef: MatDialogRef<DashboardModalComponent>,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        // Set values from opener
        if (this.data.dashboard) {
            this.newDashboard = false;
            this.dashboard.patchValue(this.data.dashboard);
            this.dashboard.get("name").disable();
        } else {
            this.newDashboard = true;
        }
    }

    save() {
        if(this.dashboard.valid) {
            // Update app with new values
            if (this.newDashboard) {
                this.apiService.addDashboard(this.dashboard.getRawValue()).subscribe((res: any) => {
                    if (res.success === true) {
                        this.notificationService.success("Dashboard updated successfully");
                        this.dialogRef.close(this.dashboard.getRawValue());
                    } else {
                        this.notificationService.error("An error occurred updating the dashboard");
                    }
                });
            } else {
                this.apiService.updateDashboard(this.dashboard.getRawValue()).subscribe((res: any) => {
                    if (res.success === true) {
                        this.notificationService.success("Dashboard updated successfully");
                        this.dialogRef.close(this.dashboard.getRawValue());
                    } else {
                        this.notificationService.error("An error occurred updating the dashboard");
                    }
                });
            }
        } else {
            this.notificationService.error("Please ensure all fields are completed correctly")
        }
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../shared/shared.module";
import { DemoMaterialModule } from "../../../../demo-material-module";

@NgModule({
    imports: [CommonModule, SharedModule, DemoMaterialModule],
    declarations: [DashboardModalComponent],
})
export class DashboardModalModule {}
