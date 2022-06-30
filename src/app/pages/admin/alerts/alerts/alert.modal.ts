import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";
import { decodeToken, generateID } from "src/app/_pipes/functions";
import { AuthState } from "src/app/_states/auth.state";
import { Store } from "@ngxs/store";

@Component({
    selector: "admin-alert-modal",
    templateUrl: "./alert.modal.html",
})
export class AlertModalComponent implements OnInit {
    newAlert = false;
    alert = new FormGroup({
        name: new FormControl("", Validators.required),
        message: new FormControl("", Validators.required),
        startdate: new FormControl("", Validators.required),
        enddate: new FormControl("", Validators.required),
        status: new FormControl("", Validators.required),
        icon: new FormControl("", Validators.required),
        id: new FormControl(null),
        author: new FormControl(null),
    });
    user: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private apiService: APIService,
        private dialogRef: MatDialogRef<AlertModalComponent>,
        private notificationService: NotificationService,
        public store: Store
    ) {
        const token = this.store.selectSnapshot(AuthState.getToken);
        this.user = decodeToken(token);
    }

    ngOnInit() {
        // Set values from opener
        if (this.data.alert) {
            this.newAlert = false;
            this.alert.patchValue(this.data.alert);
            this.alert.get("id").disable();
            this.alert.get("author").disable();
        } else {
            this.newAlert = true;
        }
    }

    save() {
        if (this.alert.valid) {
            // Update app with new values
            if (this.newAlert) {
                const payload = this.alert.getRawValue();
                payload.id = generateID();
                payload.author = this.user.username;
                this.apiService.addSystemAlert(payload).subscribe((res: any) => {
                    if (res.success === true) {
                        this.notificationService.success("Alert updated successfully");
                        this.dialogRef.close(payload);
                    } else {
                        this.notificationService.error("An error occurred updating the alert");
                    }
                });
            } else {
                this.apiService.updateSystemAlert(this.alert.getRawValue()).subscribe((res: any) => {
                    if (res.success === true) {
                        this.notificationService.success("Alert updated successfully");
                        this.dialogRef.close(res.data);
                    } else {
                        this.notificationService.error("An error occurred updating the alert");
                    }
                });
            }
        } else {
            this.notificationService.error("Please ensure all fields are completed correctly");
        }
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../shared/shared.module";
import { DemoMaterialModule } from "../../../../demo-material-module";

@NgModule({
    imports: [CommonModule, SharedModule, DemoMaterialModule],
    declarations: [AlertModalComponent],
})
export class AlertModalModule {}
