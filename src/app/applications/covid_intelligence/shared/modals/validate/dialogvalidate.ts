import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Store } from "@ngxs/store";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../../_services/notification.service";
import { ManualSetAuthTokens } from "../../../../../_states/auth.state";

@Component({
    selector: "dialog-validate",
    templateUrl: "dialogvalidate.html",
})
export class ValidateDialogComponent {
    errorMessage: string;
    myForm = new FormGroup({
        authcode: new FormControl(null, Validators.required),
    });

    constructor(
        public dialogRef: MatDialogRef<ValidateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private notificationService: NotificationService,
        private apiService: APIService,
        private store: Store
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirm() {
        this.errorMessage = null;
        this.apiService.validateMFA(this.myForm.controls["authcode"].value).subscribe((data: any) => {
            if (data.status === 200) {
                this.notificationService.success("Validated successfully.");
                this.store
                    .dispatch(
                        new ManualSetAuthTokens({
                            success: true,
                            token: data.token,
                        })
                    )
                    .subscribe((res: any) => {
                        this.dialogRef.close(data.token);
                    });
            } else {
                this.notificationService.warning("Code note valid.");
                this.errorMessage = data.message;
            }
        });
    }

    removeMFA() {
        this.apiService.unregisterMFA().subscribe((data: any) => {
            if (data && data.status && data.status !== 401) {
                this.dialogRef.close();
                this.notificationService.info("MFA method removed.");
            } else {
                this.notificationService.warning("Unable to remove MFA method. Please contact support.");
            }
        });
    }
}
