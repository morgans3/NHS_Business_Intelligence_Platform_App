import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";

@Component({
  selector: "dialog-expand-list",
  templateUrl: "dialogexpandlist.html"
})
export class ExpandListDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ExpandListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
