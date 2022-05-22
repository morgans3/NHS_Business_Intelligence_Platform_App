import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-question-modal",
    templateUrl: "./question.modal.html",
})
export class QuestionModalComponent {
    message;
    buttons = [
        {
            title: "Okay",
            value: true,
            color: "primary",
        },
        {
            title: "Cancel",
            value: false,
            color: "warn",
        },
    ];

    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<QuestionModalComponent>) {
        if (this.data.message) {
            this.message = this.data.message;
        }

        if (this.data.buttons) {
            this.buttons = this.data.buttons;
        }
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [QuestionModalComponent],
})
export class QuestionModalModule {}
