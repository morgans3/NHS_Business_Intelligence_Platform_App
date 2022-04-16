import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Store } from "@ngxs/store";
import { MessagingService, iOrganisation } from "diu-component-library";
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

  constructor(private store: Store, private messagingService: MessagingService, private notificationService: NotificationService, private passwordResetService: PasswordResetService) {}

  ngOnInit() {
    //Initialise org dropdown
    this.getOrganisations();
  }

  submit() {
    //Send request for code
    this.messagingService.requestResetPasswordCode(this.form.value.username, this.form.value.organisation.authmethod).subscribe(
      (res: any) => {
        //Set details for next step
        this.passwordResetService.userSource.next({
          username: this.form.value.username,
          organisation: this.form.value.organisation,
          code: null,
        });

        //Move to next step
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
        this.organisations = res.filter((item) => item.authmethod == "Demo");
      }
    });
    this.store.dispatch(new UpdateOrganisations());
  }
}
