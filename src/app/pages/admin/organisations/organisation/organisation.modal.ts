import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "admin-org-modal",
    templateUrl: "./organisation.modal.html",
})
export class OrgModalComponent implements OnInit {
    newOrg = false;
    org = new FormGroup({
        code: new FormControl(""),
        name: new FormControl(""),
        contact: new FormControl(""),
        authmethod: new FormControl(""),
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private apiService: APIService,
        private dialogRef: MatDialogRef<OrgModalComponent>,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        // Set values from opener
        if (this.data.org) {
            this.newOrg = false;
            this.org.patchValue(this.data.org);
            this.org.get("code").disable();
        } else {
            this.newOrg = true;
        }
    }

    save() {
        // Update app with new values
        if (this.newOrg) {
            this.apiService.addOrganisation(this.org.getRawValue()).subscribe((res: any) => {
                if (res.success === true) {
                    this.notificationService.success("Organisation updated successfully");
                    this.dialogRef.close(this.org.value);
                } else {
                    this.notificationService.error("An error occurred updating the organisation!");
                }
            });
        } else {
            this.apiService.updateOrganisation(this.org.value).subscribe((res: any) => {
                if (res.success === true) {
                    this.notificationService.success("Organisation updated successfully");
                    this.dialogRef.close(this.org.value);
                } else {
                    this.notificationService.error("An error occurred updating the organisation!");
                }
            });
        }
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../shared/shared.module";
import { DemoMaterialModule } from "../../../../demo-material-module";

@NgModule({
    imports: [CommonModule, SharedModule, DemoMaterialModule],
    declarations: [OrgModalComponent],
})
export class OrgModalModule {}
