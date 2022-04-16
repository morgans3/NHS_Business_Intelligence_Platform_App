import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { PasswordResetService } from "../password-reset.service";
import { MessagingService } from "diu-component-library";
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

  constructor(private messagingService: MessagingService, private passwordResetService: PasswordResetService, private notificationService: NotificationService) {}

  ngOnInit() {
    //Listen for user details
    this.passwordResetService.user.subscribe((user) => {
      this.user = user;
    });
  }

  verify() {
    //Check code is valid
    this.messagingService.verifyResetPasswordCode(this.user.username, this.user.organisation.authmethod, this.form.value.code).subscribe(
      (res: any) => {
        if (res && res.success == false) {
          //Show error
          this.notificationService.error(res.msg);
        } else {
          //Set code value
          this.user.code = this.form.value.code;
          this.passwordResetService.userSource.next(this.user);

          //Move to next step
          this.passwordResetService.nextStep();
        }
      },
      (error) => {
        this.notificationService.error(error);
      }
    );
  }
}
