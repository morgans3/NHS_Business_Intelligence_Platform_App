import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "admin-access-log-modal",
    templateUrl: "./access-log.modal.html",
})
export class AccessLogModalComponent implements OnInit {
    log;
    JSON = JSON;

    constructor(@Inject(MAT_DIALOG_DATA) public data, private dialogRef: MatDialogRef<AccessLogModalComponent>) {}

    ngOnInit() {
        // Set values from opener
        this.log = this.data.log || null;
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../shared/shared.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DemoMaterialModule } from "src/app/demo-material-module";

@NgModule({
    imports: [CommonModule, SharedModule, FlexLayoutModule, DemoMaterialModule],
    declarations: [AccessLogModalComponent],
})
export class AccessLogModalModule {}
