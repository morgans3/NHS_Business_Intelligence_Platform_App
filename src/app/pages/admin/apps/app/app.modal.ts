import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "admin-app-modal",
    templateUrl: "./app.modal.html",
})
export class AppModalComponent implements OnInit {
    app = new FormGroup({
        name: new FormControl(""),
        description: new FormControl(""),
        url: new FormControl(""),
        ownerName: new FormControl(""),
        ownerEmail: new FormControl(""),
        icon: new FormControl(""),
        environment: new FormControl(""),
        status: new FormControl(""),
        images: new FormControl([]),
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private apiService: APIService,
        private dialogRef: MatDialogRef<AppModalComponent>,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        // Set values from opener
        if (this.data.app) {
            this.app.patchValue(this.data.app);
            this.app.get("name").disable();
        }
    }

    save() {
        // Update app with new values
        this.apiService.updateApp(this.app.getRawValue()).subscribe((res: any) => {
            if (res.success === true) {
                this.notificationService.success("App updated successfully");
                this.dialogRef.close(this.app.getRawValue());
            } else {
                this.notificationService.error("An error occurred updating the app!");
            }
        });
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../shared/shared.module";
import { DemoMaterialModule } from "../../../../demo-material-module";

@NgModule({
    imports: [CommonModule, SharedModule, DemoMaterialModule],
    declarations: [AppModalComponent],
})
export class AppModalModule {}
