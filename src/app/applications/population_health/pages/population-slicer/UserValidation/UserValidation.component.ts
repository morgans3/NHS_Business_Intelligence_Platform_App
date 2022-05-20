import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { Store } from "@ngxs/store";
import { AuthState, ManualSetAuthTokens } from "../../../../../_states/auth.state";
import { NotificationService } from "../../../../../_services/notification.service";
import { APIService } from "diu-component-library";
import { MatDialog } from "@angular/material/dialog";
import { ValidateDialogComponent } from "./dialogvalidate";
import { VerifiyDialogComponent } from "./dialogverifiy";
import { decodeToken } from "../../../../../_pipes/functions";

@Component({
    selector: "app-UserValidation",
    templateUrl: "./UserValidation.component.html",
})
export class UserValidationComponent implements OnInit {
    @Output() confirmation = new EventEmitter();
    token: any;
    tokenDecoded: any;

    constructor(
        private store: Store,
        private authService: APIService,
        private notificationService: NotificationService,
        public dialog: MatDialog
    ) {
        this.token = this.store.selectSnapshot(AuthState.getToken);
        if (this.token) {
            this.tokenDecoded = decodeToken(this.token);
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
                            width: "350px",
                            data: this.tokenDecoded,
                        });
                        dialogRef.afterClosed().subscribe((response) => {
                            if (response && response.length > 0) {
                                this.tokenDecoded = decodeToken(response);
                                this.confirmation.emit(this.tokenDecoded);
                            }
                        });
                    } else {
                        this.authService.registerMFA().subscribe((reg: any) => {
                            if (reg.tempSecret) {
                                const dialogRef = this.dialog.open(VerifiyDialogComponent, {
                                    width: "350px",
                                    data: reg,
                                });
                                dialogRef.afterClosed().subscribe((response) => {
                                    if (response && response.length > 0) {
                                        this.tokenDecoded = decodeToken(response);
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
            .subscribe(() => {
                this.confirmation.emit(this.tokenDecoded);
            });
    }
}
