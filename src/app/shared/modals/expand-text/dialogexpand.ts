import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";

@Component({
    selector: "dialog-expand",
    templateUrl: "dialogexpand.html",
})
export class ExpandTextDialogModalComponent {
    constructor(
        public dialogRef: MatDialogRef<ExpandTextDialogModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [ExpandTextDialogModalComponent],
})
export class ExpandTextDialogModalModule {}