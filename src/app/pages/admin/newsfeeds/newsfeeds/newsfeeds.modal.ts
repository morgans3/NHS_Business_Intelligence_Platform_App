import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
    selector: "admin-newsfeeds-modal",
    templateUrl: "./newsfeeds.modal.html",
})
export class NewsfeedsModalComponent implements OnInit {
    newNewsfeeds = false;
    newsfeeds = new FormGroup({
        destination: new FormControl("", Validators.required),
        type: new FormControl("", Validators.required),
        priority: new FormControl("", Validators.required),
    });

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private apiService: APIService,
        private dialogRef: MatDialogRef<NewsfeedsModalComponent>,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        // Set values from opener
        if (this.data.newsfeeds) {
            this.newNewsfeeds = false;
            this.newsfeeds.patchValue(this.data.newsfeeds);
            this.newsfeeds.get("destination").disable();
            this.newsfeeds.get("type").disable();
        } else {
            this.newNewsfeeds = true;
        }
    }

    save() {
        if (this.newsfeeds.valid) {
            const payload = this.newsfeeds.getRawValue();
            payload.priority = payload.priority.toString();
            // Update app with new values
            if (this.newNewsfeeds) {
                this.apiService.addNewsFeed(payload).subscribe((res: any) => {
                    if (res.success === true) {
                        this.notificationService.success("Newsfeed updated successfully");
                        this.dialogRef.close(payload);
                    } else {
                        this.notificationService.error("An error occurred updating the newsfeed");
                    }
                });
            } else {
                this.apiService.updateNewsFeed(payload).subscribe((res: any) => {
                    if (res.success === true) {
                        this.notificationService.success("Newsfeed updated successfully");
                        this.dialogRef.close(res.data);
                    } else {
                        this.notificationService.error("An error occurred updating the newsfeed");
                    }
                });
            }
        } else {
            this.notificationService.error("Please ensure all fields are completed correctly");
        }
    }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../shared/shared.module";
import { DemoMaterialModule } from "../../../../demo-material-module";

@NgModule({
    imports: [CommonModule, SharedModule, DemoMaterialModule],
    declarations: [NewsfeedsModalComponent],
})
export class NewsfeedsModalModule {}
