import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { NotificationService } from "../../../../../_services/notification.service";

@Component({
  selector: "dialog-number",
  templateUrl: "dialognumber.html",
})
export class NumberDialogComponent {
  
  errorMessage: string;
  myForm = new FormGroup({
    limit: new FormControl(null, Validators.required),
  });

  constructor(
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<NumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.myForm.controls["limit"].setValue(this.data);
  }

  confirm() {
    this.errorMessage = null;
    if (this.myForm.controls["limit"].value) {
      this.dialogRef.close(this.myForm.controls["limit"].value);
    } else {
      this.notificationService.warning(
        "Unable to change the limit. Please enter a number."
      );
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
