import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { PasswordResetService } from "../password-reset.service";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "app-password-reset-verify",
    templateUrl: "./verify.component.html",
})
export class PasswordResetVerifyComponent implements OnInit {
    user: any;
    form = new FormGroup({
        code: new FormControl("", Validators.required),
    });

    constructor(
        private apiService: APIService,
        private passwordResetService: PasswordResetService,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.passwordResetService.user.subscribe((user) => {
            this.user = user;
        });
    }

    verify() {
        // TODO: This needs a new API call
        // this.apiService.verifyResetPasswordCode(this.user.username, this.user.organisation.authmethod, this.form.value.code).subscribe(
        //     (res: any) => {
        //         if (res && res.success === false) {
        //             this.notificationService.error(res.msg);
        //         } else {
        //             this.user.code = this.form.value.code;
        //             this.passwordResetService.userSource.next(this.user);
        //             this.passwordResetService.nextStep();
        //         }
        //     },
        //     (error) => {
        //         this.notificationService.error(error);
        //     }
        // );
    }
}
