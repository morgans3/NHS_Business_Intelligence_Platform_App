import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";

import { ReferenceState, UpdateOrganisations, UpdateTeams } from "../../../_states/reference.state";
import { Login } from "../../../_states/auth.state";
import { environment } from "../../../../environments/environment";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from "../../../_services/notification.service";
import { iOrganisation, iCredentials } from "diu-component-library";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  //@ts-ignore
  credentials: iCredentials;

  //@ts-ignore
  tokenLogin: string;

  //@ts-ignore
  apiLogin: string;
  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
    organisation: new FormControl("", Validators.required),
  });

  //@ts-ignore
  organisations: iOrganisation[];
  development = false;

  constructor(private notificationService: NotificationService, private router: Router, private store: Store) {}

  ngOnInit() {
    //Check if user is already logged in
    // if (this.store.selectSnapshot(AuthState.getToken)) {
    //   this.router.navigateByUrl("/" + environment.homepage);
    // }

    //Get default organisations
    this.organisations = [
      { name: "Admin", authmethod: "Demo" },
      { name: "Collaborative Partners", authmethod: "Demo" },
    ];
    this.getOrganisations();
  }

  getOrganisations() {
    this.store.select(ReferenceState.getOrganisations).subscribe((res: iOrganisation[]) => {
      if (res && res.length > 0) {
        this.organisations = res;
      }
    });
    this.store.dispatch(new UpdateOrganisations());
  }

  login() {
    //Clear storage
    localStorage.clear();

    //Log user in
    this.store
      .dispatch(
        new Login({
          username: this.loginForm.value.username,
          password: this.loginForm.value.password,
          organisation: this.loginForm.value.organisation.name,
          authentication: this.loginForm.value.organisation.authmethod,
        })
      )
      .subscribe(
        (success) => {
          //Get teams
          this.store.dispatch(new UpdateTeams()).subscribe(() => {
            //Check if password expired?
            if (success.stateauth.password_expired && success.stateauth.password_expired == true) {
              this.router.navigateByUrl("/Profile?action=change-password");
            } else {
              this.router.navigateByUrl("/" + environment.homepage);
            }  
          });
        },
        (error) => {
          this.notificationService.error("Login failed! Please check your username, password and organisation are correct.");
        }
      );
  }
}
