import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

//@ts-ignore
import * as d3 from "d3";
import { Store } from "@ngxs/store";
import { iFullUser, iUserDetails, APIService } from "diu-component-library";
import { AuthState } from "../../_states/auth.state";
import { NotificationService } from "../../_services/notification.service";
import { decodeToken, generateID } from "../../_pipes/functions";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  //@ts-ignore
  fulluser: iFullUser;
  userDecodedToken: any;
  selectedtab: any;

  constructor(public store: Store, private usergroupService: APIService, private notificationService: NotificationService, private route: ActivatedRoute) {
    //Get jwt token
    const token = this.store.selectSnapshot(AuthState.getToken);
    if (token) {
      this.userDecodedToken = decodeToken(token);
    }
  }

  ngOnInit() {
    //Remove tooltip from the dashboar page
    const tooltip_remove = d3.select("mat-sidenav-content").selectAll(".tooltip");
    tooltip_remove.remove();

    //Get route
    this.route.paramMap.subscribe((params) => {
      this.selectedtab = params.get("tab");
    });

    //Get user data
    this.getData();
  }

  getData() {
    if (this.userDecodedToken && this.userDecodedToken.username) {
      this.usergroupService.getUserProfileByUsername(this.userDecodedToken.username).subscribe((res: any) => {
        if (res.success === false) {
          this.notificationService.warning("Unable to locate your profile, we will create a profile for you shortly.");
          const newProfile: iUserDetails = {
            _id: generateID(),
            username: this.userDecodedToken.username,
          };
          this.usergroupService.addUserProfile(newProfile).subscribe((response: any) => {
            if (response.success === false) {
              this.notificationService.error("Unable to create a profile, please contact your system administrator.");
              return;
            }
            this.fulluser = {
              name: this.userDecodedToken.name,
              username: this.userDecodedToken.username,
              email: this.userDecodedToken.email,
              organisation: this.userDecodedToken.organisation,
              linemanager: this.userDecodedToken.linemanager,
              lastactive: new Date(),
              _id: response._id,
            };
            this.notificationService.success("Profile added");
          });
        } else {
          if (res.linemanager) {
            this.fulluser = res;
          } else {
            this.fulluser = {
              name: this.userDecodedToken.name,
              username: this.userDecodedToken.username,
              email: this.userDecodedToken.email,
              organisation: this.userDecodedToken.organisation,
              linemanager: this.userDecodedToken.linemanager,
              lastactive: new Date(),
              _id: res._id,
              photobase64: res.photobase64,
              contactnumber: res.contactnumber,
              preferredcontactmethod: res.preferredcontactmethod,
              emailpreference: res.emailpreference,
              impreference: res.impreference,
            };
          }
        }
      });
    }
  }
}
