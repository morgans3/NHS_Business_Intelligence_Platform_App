import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AuthState } from "../../../_states/auth.state";
import { Store } from "@ngxs/store";

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
        @Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<RequestHelpModalComponent>
    ) {
        // Get user details
        const userEmail = this.store.selectSnapshot(AuthState.getEmail);

        // Set form data
        this.request.patchValue(Object.assign(
            {}, this.data, { email: userEmail }
        ));
    }

    submit() {}

}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [RequestHelpModalComponent],
})
export class RequestHelpModalModule {}
