import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";

@Component({
    selector: "dialog-profile",
    templateUrl: "dialogprofile.html",
})
export class UserDialogComponent {
    constructor(public dialogRef: MatDialogRef<UserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

    onNoClick(): void {
        this.dialogRef.close();
    }

    displayaddress(data) {
        let address = "";
        if (data.postcode) {
            if (data.addressline1) address += data.addressline1;
            if (data.addressline2) {
                if (address.length > 0) address += ", ";
                address += data.addressline2;
            }
            if (data.addressline3) {
                if (address.length > 0) address += ", ";
                address += data.addressline3;
            }
            if (data.addressline4) {
                if (address.length > 0) address += ", ";
                address += data.addressline4;
            }
            if (data.addressline5) {
                if (address.length > 0) address += ", ";
                address += data.addressline5;
            }
            if (data.postcode) {
                if (address.length > 0) address += ", ";
                address += data.postcode;
            }
        }
        return address;
    }
}
