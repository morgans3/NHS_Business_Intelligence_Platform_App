import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "admin-dashboard-modal",
    templateUrl: "./dashboard.modal.html",
})
export class DashboardModalComponent implements OnInit {
    dashboard = new FormGroup({
        name: new FormControl(""),
        url: new FormControl(""),
        ownerName: new FormControl(""),
        ownerEmail: new FormControl(""),
        icon: new FormControl(""),
        environment: new FormControl(""),
        status: new FormControl(""),
        description: new FormControl(""),
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
            this.dashboard.patchValue(this.data.dashboard);
            this.dashboard.get("name").disable();
        }
    }

    save() {
        // Update app with new values
        // TODO: where is this endpoint now?
        // this.apiService.updateDashboard(this.dashboard.getRawValue()).subscribe((res: any) => {
        //     if (res.success === true) {
        //         this.notificationService.success("Dashboard updated successfully");
        //         this.dialogRef.close(this.dashboard.getRawValue());
        //     } else {
        //         this.notificationService.error("An error occurred updating the dashboard!");
        //     }
        // });
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../shared/shared.module";
import { DemoMaterialModule } from "src/app/demo-material-module";

@NgModule({
    imports: [CommonModule, SharedModule, DemoMaterialModule],
    declarations: [DashboardModalComponent],
})
export class DashboardModalModule {}
