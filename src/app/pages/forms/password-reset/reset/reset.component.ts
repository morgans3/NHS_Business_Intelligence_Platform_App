import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from "@angular/forms";
import { Store } from "@ngxs/store";

import { ManualSetAuthTokens } from "../../../../_states/auth.state";
import { PasswordResetService } from "../password-reset.service";
import { environment } from "../../../../../environments/environment";
import { APIService } from "diu-component-library";

@Component({
  selector: "app-password-reset",
  templateUrl: "./reset.component.html",
  styles: [
    `
      .progress {
        background: #87898d;
        color: #fff;
        border-radius: 5px;
        margin-bottom: 1.25rem;
      }
      .progress-bar {
        font-size: 0.9rem;
        text-align: center;
        line-height: 1.1rem;
        min-width: fit-content;
      }
    `,
  ],
})
export class PasswordResetComponent implements OnInit {
  user: any;
  password_validity = { score: 0, color: "danger", strength: "weak" };
  form = new FormGroup(
    {
      password: new FormControl("", [
        Validators.required,
        (formControl: FormControl): ValidationErrors => {
          //Check password security
          if (this.checkPasswordSecurity(formControl.value).score < 100) {
            return { invalid: true };
          } else {
            return null;
          }
        },
      ]),
      password_match: new FormControl("", Validators.required),
    },
    {
      validators: [
        (form: FormGroup): ValidatorFn => {
          //Check passwords match?
          // @ts-ignore
          if (form.get("password").value == form.get("password_match").value) {
            // @ts-ignore
            form.get("password_match").setErrors(null);
          } else {
            // @ts-ignore
            form.get("password_match").setErrors({ matches: true });
          }
          // @ts-ignore
          return null;
        },
      ],
    }
  );

  constructor(private store: Store, private router: Router, private apiService: APIService, private passwordResetService: PasswordResetService) {}

  ngOnInit() {
    //Get user details
    this.passwordResetService.user.subscribe((user) => {
      this.user = user;
    });

    //Set step?
    if (this.passwordResetService.stepSource.value !== "update") {
      this.passwordResetService.stepSource.next("update");
    }
  }

  checkPasswordSecurity(password: any) {
    let score = 0;

    //Calculate security
    if (password.length >= 8) {
      score += 25;
    } //Length?
    if (/.*[A-Z].*/.test(password)) {
      score += 25;
    } //Capital letter?
    if (/[^a-zA-Z0-9]/.test(password)) {
      score += 25;
    } //Special character?
    if (/.*[0-9].*/.test(password)) {
      score += 25;
    } //Number?

    //Set status, return result
    this.password_validity = {
      score: score,
      color: score == 100 ? "success" : score >= 50 ? "warning" : "danger",
      strength: score == 100 ? "strong!" : score >= 50 ? "okay" : "weak",
    };
    return this.password_validity;
  }

  submit() {
    //Make password reset
    if (this.form.valid) {
      this.apiService.updatePassword(this.user.username, this.user.organisation.authmethod, this.form.value.password, this.user.code || null).subscribe((res: any) => {
        if (res.success) {
          if (res.token) {
            //Set token and redirect
            this.store.dispatch(new ManualSetAuthTokens(res)).subscribe(() => {
              this.router.navigate(["/" + environment.homepage]);
            });
          } else {
            //Move next step
            this.passwordResetService.nextStep();
          }
        }
      });
    }
  }
}
