import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ManualSetAuthTokens } from "../../../../../_states/auth.state";
import { Store } from "@ngxs/store";
import { APIService } from "diu-component-library";

@Component({
  selector: "dialog-verifiy",
  templateUrl: "dialogverifiy.html"
})
export class VerifiyDialogComponent {
  errorMessage: string;
  tfa: any;
  myForm = new FormGroup({
    authcode: new FormControl(null, Validators.required)
  });

  constructor(
    public dialogRef: MatDialogRef<VerifiyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: APIService,
    private store: Store
  ) {
    this.tfa = this.data;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  enableTFA() {
    if (this.myForm.controls["authcode"].value) {
      this.authService
        .verifyMFA(this.myForm.controls["authcode"].value, this.tfa.tempSecret)
        .subscribe((data: any) => {
          if (data && data.status === 200) {
            this.store
              .dispatch(
                new ManualSetAuthTokens({
                  success: true,
                  token: data.token
                })
              )
              .subscribe(res => {
                this.dialogRef.close(data.token);
              });
          } else {
            this.errorMessage =
              "Incorrect code - Unable to verify using this code";
          }
        });
    }
  }
}
