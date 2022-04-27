import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Component, Inject, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";

@Component({
  selector: "dialog-reason",
  templateUrl: "dialogreason.html",
})
export class ReasonDialogComponent {
  @ViewChild(FormGroupDirective)
  formDirective: FormGroupDirective;
  myForm = new FormGroup({
    reason: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<ReasonDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    this.dialogRef.close(this.myForm.controls["reason"].value);
  }
}
