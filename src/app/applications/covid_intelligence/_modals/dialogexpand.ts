import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";

@Component({
  selector: "dialog-expand",
  templateUrl: "dialogexpand.html",
})
export class ExpandTextDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ExpandTextDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
