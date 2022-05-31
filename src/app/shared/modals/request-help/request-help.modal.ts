import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NotificationService } from "src/app/_services/notification.service";
import { AuthState } from "../../../_states/auth.state";
import { APIService } from "diu-component-library";
import { environment } from "src/environments/environment";
import { Store } from "@ngxs/store";

interface Request {
    email: string;
    message: string;
    attributes: any;
}

@Component({
    selector: "app-requesthelp-modal",
    templateUrl: "./request-help.modal.html",
})
export class RequestHelpModalComponent {
    request = new FormGroup({
        email: new FormControl(null, Validators.required),
        message: new FormControl(null, Validators.required),
        attributes: new FormControl({}),
    });

    constructor(
        private store: Store,
        private apiService: APIService,
        @Inject(MAT_DIALOG_DATA) public data,
        private notifcationService: NotificationService,
        public dialogRef: MatDialogRef<RequestHelpModalComponent>
    ) {
        // Get user details
        const userEmail = this.store.selectSnapshot(AuthState.getEmail);

        // Set form data
        this.request.patchValue(Object.assign({}, this.data, { email: userEmail }));
    }

    submit() {
        const request: Request = this.request.value;
        this.apiService.sendHelpRequest(request).subscribe(
            (data: any) => {
                if (data && data.success) {
                    // Notify user
                    this.notifcationService.success("Thank you! Your message has been sent, we'll try and fix the problem promptly.");
                } else {
                    // Send via email
                    this.submitViaEmail(request);
                }
            },
            () => {
                this.submitViaEmail(request);
            }
        );
    }

    submitViaEmail(request: Request) {
        this.dialogRef.close();
        window.open(
            "https://outlook.office.com/mail/deeplink/compose?to=" +
                environment.admins[0] +
                "&subject=Help+Request&body=" +
                encodeURIComponent(`
                Message: ${request.message} \n
                Email: ${request.email} \n
                Attributes: ${JSON.stringify(request.attributes)}
        `),
            "_blank"
        );
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [RequestHelpModalComponent],
})
export class RequestHelpModalModule {}
