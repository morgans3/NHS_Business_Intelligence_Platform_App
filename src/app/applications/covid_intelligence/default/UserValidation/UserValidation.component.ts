import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { JwtHelper } from "angular2-jwt";
import { MatDialog } from "@angular/material";
import { ValidateDialogComponent } from "./dialogvalidate";
import { VerifiyDialogComponent } from "./dialogverifiy";
import { AuthService } from "../../_services/auth.service";
import { NotificationService } from "../../_services/notification.service";
import { AuthState, ManualSetAuthTokens } from "../../_states/auth.state";

@Component({
  selector: "app-UserValidation",
  templateUrl: "./UserValidation.component.html",
  styleUrls: ["./UserValidation.component.scss"],
})
export class UserValidationComponent implements OnInit {
  @Output() confirmation = new EventEmitter();
  token: any;
  tokenDecoded: any;

  constructor(private store: Store, private authService: AuthService, private notificationService: NotificationService, public dialog: MatDialog) {
    this.token = this.store.selectSnapshot(AuthState.getToken);
    if (this.token) {
      this.tokenDecoded = new JwtHelper().decodeToken(this.token);
      if (this.tokenDecoded.mfa) {
        this.confirmation.emit(this.tokenDecoded);
      }
    }
  }

  ngOnInit() {
    if (this.tokenDecoded && this.tokenDecoded.mfa) {
      this.confirmation.emit(this.tokenDecoded);
    }
  }

  showInfo() {
    if (this.tokenDecoded.mfa) {
      this.confirmation.emit(this.tokenDecoded);
    } else {
      this.authService.checkMFA().subscribe((res: any) => {
        if (res.error) {
          this.notificationService.warning("Unable to contact Authentication Service");
        } else {
          if (res.msg.toString() === "true") {
            const dialogRef = this.dialog.open(ValidateDialogComponent, {
              width: "90%",
              data: this.tokenDecoded,
            });
            dialogRef.afterClosed().subscribe((response) => {
              if (response && response.length > 0) {
                this.tokenDecoded = new JwtHelper().decodeToken(response);
                this.confirmation.emit(this.tokenDecoded);
              }
            });
          } else {
            this.authService.registerMFA().subscribe((reg: any) => {
              if (reg.tempSecret) {
                const dialogRef = this.dialog.open(VerifiyDialogComponent, {
                  width: "90%",
                  data: reg,
                });
                dialogRef.afterClosed().subscribe((response) => {
                  if (response && response.length > 0) {
                    this.tokenDecoded = new JwtHelper().decodeToken(response);
                    this.confirmation.emit(this.tokenDecoded);
                  }
                });
              } else {
                this.notificationService.warning("Unable to generate Verification token.");
              }
            });
          }
        }
      });
    }
  }

  removeInfo() {
    this.tokenDecoded["mfa"] = false;
    this.store
      .dispatch(
        new ManualSetAuthTokens({
          success: true,
          token: this.token,
        })
      )
      .subscribe((res: any) => {
        this.confirmation.emit(this.tokenDecoded);
      });
  }
}
