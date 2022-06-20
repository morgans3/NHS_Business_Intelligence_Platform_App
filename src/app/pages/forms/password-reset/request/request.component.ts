import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Store } from "@ngxs/store";
import { APIService, iOrganisation } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";
import { ReferenceState, UpdateOrganisations } from "../../../../_states/reference.state";
import { PasswordResetService } from "../password-reset.service";

@Component({
    selector: "app-password-reset-request",
    templateUrl: "./request.component.html",
})
export class PasswordResetRequestComponent implements OnInit {
    form = new FormGroup({
        username: new FormControl("", Validators.required),
        organisation: new FormControl("", Validators.required),
    });

    organisations: iOrganisation[] = [];

    constructor(
        private store: Store,
        private apiService: APIService,
        private notificationService: NotificationService,
        private passwordResetService: PasswordResetService
    ) {}

    ngOnInit() {
        this.getOrganisations();
    }

    submit() {
        // TODO: This needs a new API call
        this.apiService.sendVerificationCode(this.form.value.username).subscribe(
            () => {
                this.passwordResetService.userSource.next({
                    username: this.form.value.username,
                    organisation: this.form.value.organisation,
                    code: null,
                });
                this.passwordResetService.nextStep();
            },
            (error) => {
                this.notificationService.error(error);
            }
        );
    }

    getOrganisations() {
        this.store.select(ReferenceState.getOrganisations).subscribe((res: iOrganisation[]) => {
            if (res && res.length > 0) {
                this.organisations = res.filter((item) => item.authmethod === "Demo");
            }
        });
        this.store.dispatch(new UpdateOrganisations());
    }
}
