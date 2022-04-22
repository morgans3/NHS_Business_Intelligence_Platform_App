import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { APIService } from "diu-component-library";
import { NotificationService } from "../../../../_services/notification.service";

@Component({
  selector: "admin-org-modal",
  templateUrl: "./organisation.modal.html",
})
export class OrgModalComponent implements OnInit {
  org = new FormGroup({
    code: new FormControl({ value: "", disabled: true }),
    name: new FormControl(""),
    contact: new FormControl(""),
    authmethod: new FormControl(""),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data, private apiService: APIService, private dialogRef: MatDialogRef<OrgModalComponent>, private notificationService: NotificationService) {}

  ngOnInit() {
    //Set values from opener
    if (this.data.org) {
      this.org.patchValue(this.data.org);
    }
  }

  save() {
    //Update app with new values
    this.apiService.updateOrganisation(this.org.value).subscribe((res: any) => {
      if (res.success == true) {
        this.notificationService.success("Organisation updated successfully");
        this.dialogRef.close(this.org.value);
      } else {
        this.notificationService.error("An error occurred updating the organisation!");
      }
    });
  }
}

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../shared/shared.module";

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [OrgModalComponent],
})
export class OrgModalModule {}
